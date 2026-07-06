"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { resolvePrimaryAction, resolveSecondaryActions } from "@/lib/captainDelta/actions";
import {
  buildAfterAnswerCoaching,
  buildActiveMissionTermLine,
  buildContextTip,
  buildSimulationDebrief,
  buildTodayBriefing,
  markBriefingShown,
  wasBriefingShownToday,
} from "@/lib/captainDelta/briefing";
import { CONTEXT_LABELS, getCaptainDeltaContext } from "@/lib/captainDelta/context";
import {
  CAPTAIN_DELTA_AFTER_ANSWER,
  CAPTAIN_DELTA_DEBRIEF,
  CAPTAIN_DELTA_SUGGESTION,
  emitCaptainDeltaMessageDelivered,
} from "@/lib/captainDelta/events";
import { warnCaptain } from "@/lib/captainDelta/devLog";
import {
  createCaptainMessageDedupState,
  evaluateCaptainMessageDelivery,
  type CaptainMessageDedupState,
  shouldDeliverActiveTermSync,
} from "@/lib/captainDelta/messageDedup";
import {
  CAPTAIN_DELTA_LESSON_CONTEXT,
  CAPTAIN_DELTA_RECORD_BLOCKED,
  CAPTAIN_DELTA_STOP_VOICE,
  clearActivePronunciationWord,
  emitSecondaryAction,
  emitStartRecord,
  emitStopRecord,
  getCaptainDeltaRecordBridge,
  isPronunciationTermSynced,
  lessonContextForRoute,
  mergeLessonContext,
  pronunciationWordChanged,
  resolveCaptainActiveTerm,
} from "@/lib/captainDelta/lessonContext";
import { forceReleaseRecordingSession } from "@/lib/azure/recognizerSession";
import { emitPronRecordDebug } from "@/lib/captainDelta/recordRuntimeDebug";
import type {
  CaptainDeltaAction,
  CaptainDeltaAvatarState,
  CaptainDeltaContext,
  CaptainDeltaLessonContext,
  CaptainDeltaLessonContextPatch,
  CaptainDeltaMessage,
  CaptainDeltaMessageKind,
} from "@/lib/captainDelta/types";
import { DEFAULT_LESSON_CONTEXT } from "@/lib/captainDelta/types";
import { toSpeechText } from "@/lib/captainDelta/voiceText";
import {
  CAPTAIN_VOICE_TEXT_MODE_LABEL,
  isCaptainDeltaProactiveEnabled,
  isCaptainDeltaVoiceEnabled,
} from "@/lib/captainDelta/voiceConfig";
import { getNextMissionAction } from "@/lib/dailyMission";
import {
  answerPronunciationCoachingQuestion,
  getLastPronunciationCoachSession,
  isPronunciationCoachingQuestion,
} from "@/lib/pronunciationCoach";
import { buildMemoryContextForPrompt } from "@/lib/flightInstructor/memory";
import { todayKey } from "@/lib/studyTime";
import { useCaptainDeltaVoice } from "@/hooks/useCaptainDeltaVoice";
import { useCaptainDeltaPtt } from "@/hooks/useCaptainDeltaPtt";
import {
  pronunciationRecorderUiSnapshot,
  type PronunciationRecorderUiState,
} from "@/lib/pronunciation/pronunciationRecordingController";
import type { PronunciationRecordingRegistration } from "@/lib/pronunciation/pronunciationRecordingRegistration";

type CaptainDeltaContextValue = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  context: CaptainDeltaContext;
  contextLabel: string;
  lesson: CaptainDeltaLessonContext;
  currentMessage: CaptainDeltaMessage | null;
  avatarState: CaptainDeltaAvatarState;
  voice: ReturnType<typeof useCaptainDeltaVoice>;
  pttActive: boolean;
  pttInterim: string;
  pttError: string | null;
  voiceStatusLabel: string | null;
  thinking: boolean;
  /** Captain mic UI — observed from PronunciationRecordingController on /pronunciation. */
  pronunciationMicUi: PronunciationRecorderUiState | null;
  pronunciationRecordingActive: boolean;
  registerPronunciationRecording: (entry: PronunciationRecordingRegistration | null) => void;
  triggerPrimaryAction: () => void;
  triggerSecondaryAction: (actionId: string) => void;
  startPtt: () => void;
  stopPtt: () => void;
  quickQuestion: () => void;
  playBriefing: () => void;
};

const CaptainDeltaCtx = createContext<CaptainDeltaContextValue | null>(null);

type DeliverMessageOptions = {
  autoSpeak?: boolean;
  avatar?: CaptainDeltaAvatarState;
  source?: string;
  eventId?: string;
};

const TERM_ROUTE_CONTEXTS: CaptainDeltaContext[] = ["pronunciation", "vocabulary"];

function buildMessage(
  kind: CaptainDeltaMessageKind,
  text: string,
  route: CaptainDeltaContext,
  lesson: CaptainDeltaLessonContext,
  options?: {
    speechText?: string;
    primaryAction?: CaptainDeltaAction;
    secondaryActions?: CaptainDeltaAction[];
  },
): CaptainDeltaMessage {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    kind,
    text,
    speechText: options?.speechText ?? toSpeechText(text),
    at: new Date().toISOString(),
    primaryAction: options?.primaryAction ?? resolvePrimaryAction(route, lesson, kind),
    secondaryActions:
      options?.secondaryActions ?? resolveSecondaryActions(route, lesson, kind),
  };
}

export function CaptainDeltaProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const routeContext = getCaptainDeltaContext(pathname);
  const contextLabel = CONTEXT_LABELS[routeContext];
  const voice = useCaptainDeltaVoice();
  const ptt = useCaptainDeltaPtt("en-US");

  const [open, setOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<CaptainDeltaMessage | null>(null);
  const [lesson, setLesson] = useState<CaptainDeltaLessonContext>(DEFAULT_LESSON_CONTEXT);
  const [pttActive, setPttActive] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [voiceStatusLabel, setVoiceStatusLabel] = useState<string | null>(null);
  const lastContextRef = useRef<CaptainDeltaContext | null>(null);
  const routeContextRef = useRef(routeContext);
  routeContextRef.current = routeContext;
  const briefingTriggeredRef = useRef(false);
  const lastPronunciationWordRef = useRef<string | null>(null);
  const dedupStateRef = useRef<CaptainMessageDedupState>(createCaptainMessageDedupState());
  const voiceCancelRef = useRef(voice.cancelPlayback);
  voiceCancelRef.current = voice.cancelPlayback;
  const pronunciationHandlesRef = useRef<
    PronunciationRecordingRegistration["handles"] | null
  >(null);
  const [pronunciationMicUi, setPronunciationMicUi] =
    useState<PronunciationRecorderUiState | null>(null);
  const [pronunciationRecordingActive, setPronunciationRecordingActive] = useState(false);

  const registerPronunciationRecording = useCallback(
    (entry: PronunciationRecordingRegistration | null) => {
      if (!entry) {
        pronunciationHandlesRef.current = null;
        setPronunciationMicUi(null);
        setPronunciationRecordingActive(false);
        return;
      }
      pronunciationHandlesRef.current = entry.handles;
      const recording = entry.micUi.phase === "recording";
      setPronunciationRecordingActive(recording);
      setPronunciationMicUi((prev) => {
        if (!prev) return entry.micUi;
        const prevKey = pronunciationRecorderUiSnapshot(
          prev,
          null,
          prev.phase === "recording",
        );
        const nextKey = pronunciationRecorderUiSnapshot(entry.micUi, null, recording);
        return prevKey === nextKey ? prev : entry.micUi;
      });
    },
    [],
  );

  const emitPronunciationRecordBlocked = useCallback((reason: string) => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(
      new CustomEvent(CAPTAIN_DELTA_RECORD_BLOCKED, { detail: { reason } }),
    );
  }, []);

  const activeTerm = useMemo(
    () => resolveCaptainActiveTerm(routeContext, lesson),
    [routeContext, lesson],
  );

  const firstName =
    user?.name?.split(" ")[0] || user?.email?.split("@")[0] || "pilot";

  useLayoutEffect(() => {
    voiceCancelRef.current();
    forceReleaseRecordingSession();
    setCurrentMessage(null);
    registerPronunciationRecording(null);
  }, [pathname, registerPronunciationRecording]);

  useEffect(() => {
    const onStopVoice = () => voiceCancelRef.current();
    window.addEventListener(CAPTAIN_DELTA_STOP_VOICE, onStopVoice);
    return () => window.removeEventListener(CAPTAIN_DELTA_STOP_VOICE, onStopVoice);
  }, []);

  const deliverMessage = useCallback(
    (
      msg: CaptainDeltaMessage,
      options?: DeliverMessageOptions,
    ) => {
      const term = resolveCaptainActiveTerm(routeContext, lesson);
      const decision = evaluateCaptainMessageDelivery(dedupStateRef.current, {
        route: routeContext,
        kind: msg.kind,
        activeTerm: term,
        text: msg.text,
        speechText: msg.speechText ?? msg.text,
        source: options?.source,
        eventId: options?.eventId,
      });
      dedupStateRef.current = decision.next;
      if (!decision.deliver) return;

      voice.cancelPlayback();
      setCurrentMessage(msg);
      setOpen(true);
      emitCaptainDeltaMessageDelivered(msg);

      const wantSpeech = options?.autoSpeak !== false;

      if (!isCaptainDeltaVoiceEnabled()) {
        setVoiceStatusLabel(CAPTAIN_VOICE_TEXT_MODE_LABEL);
        return;
      }

      setVoiceStatusLabel(null);

      if (!wantSpeech) return;

      void voice.speak(msg.speechText ?? msg.text).then((result) => {
        if (!result.ok && result.error !== "stale") {
          setVoiceStatusLabel(CAPTAIN_VOICE_TEXT_MODE_LABEL);
          warnCaptain("deliverMessage", result.error ?? "Voice output failed");
        }
      });
    },
    [lesson, routeContext, voice],
  );

  const playBriefing = useCallback(() => {
    const dateKey = todayKey();
    const { text, speechText } = buildTodayBriefing(firstName, dateKey);
    markBriefingShown(dateKey);
    const msg = buildMessage("briefing", text, routeContext, lesson, { speechText });
    deliverMessage(msg);
  }, [deliverMessage, firstName, lesson, routeContext]);

  const replyFromCaptain = useCallback(
    async (question: string, lessonSnapshot: CaptainDeltaLessonContext) => {
      if (
        routeContext === "pronunciation" &&
        isPronunciationCoachingQuestion(question)
      ) {
        const activeTerm = resolveCaptainActiveTerm(routeContext, lessonSnapshot);
        const last = getLastPronunciationCoachSession();
        const answer = answerPronunciationCoachingQuestion(question, {
          targetWord: activeTerm ?? last?.targetWord,
          referenceText:
            lessonSnapshot.modelAnswer ??
            lessonSnapshot.question ??
            last?.referenceText,
          practiceLevel: last?.practiceLevel,
          lastFocus: last?.lastFocus,
        });
        deliverMessage(
          buildMessage("coaching", answer.message, routeContext, lessonSnapshot, {
            speechText: answer.speechText,
            primaryAction: { id: "try_again", label: "Try again", primary: true },
            secondaryActions: [
              { id: "slow_audio", label: "🎧 Slow Audio", primary: false },
            ],
          }),
          { avatar: "correcting", autoSpeak: true },
        );
        return;
      }

      setThinking(true);
      try {
        const memoryContext = buildMemoryContextForPrompt();
        const activeTerm = resolveCaptainActiveTerm(routeContext, lessonSnapshot);
        const res = await fetch("/api/captain-delta", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question,
            pageContext: contextLabel,
            memoryContext,
            transcript: lessonSnapshot.question,
            modelAnswer: lessonSnapshot.modelAnswer,
            lessonContext: {
              ...lessonSnapshot,
              activeMissionTerm: activeTerm,
            },
          }),
        });
        if (res.status === 401) {
          deliverMessage(
            buildMessage(
              "coaching",
              "Your session expired. Sign in again to ask Captain Delta a question.",
              routeContext,
              lessonSnapshot,
            ),
          );
          return;
        }
        if (!res.ok) {
          throw new Error(`Captain unavailable (${res.status})`);
        }
        const data = (await res.json()) as { reply: string };
        const msg = buildMessage("coaching", data.reply, routeContext, lessonSnapshot, {
          speechText: toSpeechText(data.reply),
        });
        deliverMessage(msg, { avatar: "correcting" });
      } catch (err) {
        warnCaptain("replyFromCaptain", "API request failed — using local coaching line", err);
        deliverMessage(
          buildMessage(
            "coaching",
            "Stay with operational language. Explain your decision like a briefing.",
            routeContext,
            lessonSnapshot,
          ),
        );
      } finally {
        setThinking(false);
      }
    },
    [contextLabel, deliverMessage, routeContext],
  );

  const startPtt = useCallback(async () => {
    voice.stop();
    ptt.clear();
    setPttActive(true);
    const ok = await ptt.start();
    if (!ok) setPttActive(false);
  }, [ptt, voice]);

  const stopPtt = useCallback(async () => {
    if (!pttActive && !ptt.listening) return;
    setPttActive(false);
    const said = await ptt.stop();
    if (said) {
      void replyFromCaptain(said, lesson);
    } else if (!ptt.error) {
      deliverMessage(
        buildMessage(
          "coaching",
          "I did not catch that. Hold the Captain button and speak again.",
          routeContext,
          lesson,
        ),
        { autoSpeak: true },
      );
    }
  }, [deliverMessage, lesson, ptt, pttActive, replyFromCaptain, routeContext]);

  const triggerPrimaryAction = useCallback(() => {
    emitPronRecordDebug({ source: "captain-primary", phase: "click" });

    if (pttActive || ptt.listening) {
      void stopPtt();
      return;
    }

    if (routeContext === "pronunciation") {
      const handles = pronunciationHandlesRef.current;
      if (!handles) return;
      if (handles.isRecording()) {
        void handles.stop();
        return;
      }
      if (handles.canStart()) {
        void handles.start();
        return;
      }
      const reason = handles.getBlockReason();
      if (reason) emitPronunciationRecordBlocked(reason);
      return;
    }

    const bridge = getCaptainDeltaRecordBridge();
    if (bridge?.isRecording()) {
      emitStopRecord();
      return;
    }

    const action = currentMessage?.primaryAction.id;
    if (action === "ready") {
      const next = getNextMissionAction();
      if (next) router.push(next.href);
      return;
    }

    if (
      action === "explain_it" ||
      action === "explain_your_way"
    ) {
      void startPtt();
      return;
    }

    const bridgeRecordActions = new Set([
      "repeat_after_me",
      "try_again",
      "read_back",
      "describe_picture",
    ]);

    if (action && bridgeRecordActions.has(action)) {
      emitStartRecord();
      return;
    }

    if (bridge?.canRecord()) {
      emitStartRecord();
      return;
    }

    void startPtt();
  }, [
    currentMessage,
    emitPronunciationRecordBlocked,
    ptt.listening,
    pttActive,
    routeContext,
    router,
    startPtt,
    stopPtt,
  ]);

  const triggerSecondaryAction = useCallback(
    (actionId: string) => {
      const activeTerm = resolveCaptainActiveTerm(routeContext, lesson);

      if (actionId === "show_hint") {
        const prompt = activeTerm
          ? `I'm stuck on "${activeTerm}". Give me one hint for this screen.`
          : "I'm stuck. Give me one hint for this screen.";
        void replyFromCaptain(prompt, lesson);
        return;
      }
      if (actionId === "give_example") {
        const prompt = activeTerm
          ? `Give me a short ICAO operational example sentence using "${activeTerm}".`
          : "Give me a short ICAO example for this.";
        void replyFromCaptain(prompt, lesson);
        return;
      }
      if (actionId === "slow_audio") {
        if (routeContext === "pronunciation") {
          const handles = pronunciationHandlesRef.current;
          if (handles) {
            void handles.playSlow();
            return;
          }
        }
        emitSecondaryAction("slow_audio");
        return;
      }
      if (actionId === "watch_real_examples") {
        if (routeContext === "pronunciation") {
          pronunciationHandlesRef.current?.openYouGlish?.();
          return;
        }
        return;
      }
      emitSecondaryAction(actionId);
    },
    [lesson, replyFromCaptain, routeContext],
  );

  const quickQuestion = useCallback(() => {
    setOpen(true);
    void startPtt();
  }, [startPtt]);

  useEffect(() => {
    const onLesson = (e: Event) => {
      const patch = (e as CustomEvent<CaptainDeltaLessonContextPatch>).detail;
      if (!patch) return;
      const { eventId: _eventId, ...lessonPatch } = patch;
      setLesson((prev) => mergeLessonContext(prev, lessonPatch));
    };
    window.addEventListener(CAPTAIN_DELTA_LESSON_CONTEXT, onLesson);
    return () => window.removeEventListener(CAPTAIN_DELTA_LESSON_CONTEXT, onLesson);
  }, []);

  useEffect(() => {
    if (routeContext !== "pronunciation") {
      lastPronunciationWordRef.current = null;
      return;
    }
    const word = resolveCaptainActiveTerm(routeContext, lesson);
    if (!word) return;
    if (pronunciationWordChanged(lastPronunciationWordRef.current, word)) {
      voice.stop();
      setCurrentMessage(null);
      dedupStateRef.current = {
        ...dedupStateRef.current,
        lastDeliveredActiveTerm: null,
        lastMessageKey: null,
        lastMessageAt: 0,
      };
    }
    lastPronunciationWordRef.current = word;
  }, [lesson, routeContext, voice]);

  useEffect(() => {
    if (!user || !isCaptainDeltaProactiveEnabled()) return;
    if (routeContext === lastContextRef.current) return;
    lastContextRef.current = routeContext;
    lastPronunciationWordRef.current = null;
    dedupStateRef.current = createCaptainMessageDedupState();

    setCurrentMessage(null);
    setOpen(false);

    if (routeContext !== "pronunciation") {
      clearActivePronunciationWord();
    }

    const freshLesson = lessonContextForRoute(routeContext);
    setLesson(freshLesson);

    const tip = buildContextTip(routeContext);
    if (tip && !TERM_ROUTE_CONTEXTS.includes(routeContext)) {
      deliverMessage(
        buildMessage("context", tip.text, routeContext, freshLesson, {
          speechText: tip.speechText,
        }),
        {
          autoSpeak: true,
          source: "route-entry",
          eventId: `route-tip:${routeContext}`,
        },
      );
    }
  }, [deliverMessage, routeContext, user]);

  useEffect(() => {
    if (!user || !isCaptainDeltaProactiveEnabled()) return;
    if (!TERM_ROUTE_CONTEXTS.includes(routeContext)) return;

    if (routeContext === "pronunciation" && !isPronunciationTermSynced(lesson)) {
      return;
    }

    if (!activeTerm) return;
    if (!shouldDeliverActiveTermSync(dedupStateRef.current, routeContext, activeTerm)) {
      return;
    }

    const eventId = `sync-term:${routeContext}:${activeTerm.toLowerCase()}`;
    const line = buildActiveMissionTermLine(activeTerm, routeContext);
    deliverMessage(
      buildMessage("coaching", line.text, routeContext, lesson, {
        speechText: line.speechText,
      }),
      {
        autoSpeak: true,
        source: "sync-effect",
        eventId,
      },
    );
  }, [activeTerm, deliverMessage, lesson, routeContext, user]);

  useEffect(() => {
    if (!user || pathname !== "/" || briefingTriggeredRef.current) return;
    if (!isCaptainDeltaProactiveEnabled()) return;
    const dateKey = todayKey();
    if (wasBriefingShownToday(dateKey)) return;
    briefingTriggeredRef.current = true;
    const timer = window.setTimeout(() => playBriefing(), 900);
    return () => window.clearTimeout(timer);
  }, [pathname, playBriefing, user]);

  useEffect(() => {
    const onSuggestion = (e: Event) => {
      const detail = (e as CustomEvent<import("@/lib/captainDelta/types").CaptainDeltaSuggestionPayload>)
        .detail;
      if (!detail?.text) return;
      const msg = buildMessage(
        detail.kind ?? "suggestion",
        detail.text,
        routeContext,
        lesson,
        {
          speechText: detail.speechText,
          primaryAction: detail.primaryAction,
          secondaryActions: detail.secondaryActions,
        },
      );
      deliverMessage(msg, {
        autoSpeak: !!(detail.speechText && (detail.kind ?? "suggestion") === "coaching"),
      });
    };
    const onAfterAnswer = (e: Event) => {
      const ctx = routeContextRef.current;
      if (ctx !== "part1" && ctx !== "part2" && ctx !== "dashboard") return;
      const detail = (e as CustomEvent<{ report: import("@/lib/flightInstructor/types").FlightInstructorReport }>)
        .detail;
      if (!detail?.report) return;
      const coaching = buildAfterAnswerCoaching(detail.report);
      const msg = buildMessage("coaching", coaching.text, routeContext, {
        ...lesson,
        hasFeedback: true,
        mode: "debrief",
      }, {
        speechText: coaching.speechText,
      });
      deliverMessage(msg, { avatar: "celebrating" });
    };
    const onDebrief = () => {
      const ctx = routeContextRef.current;
      if (ctx !== "simulation" && ctx !== "part2") return;
      const debrief = buildSimulationDebrief();
      const msg = buildMessage("debrief", debrief.text, routeContext, {
        ...lesson,
        mode: "debrief",
      }, { speechText: debrief.speechText });
      deliverMessage(msg, { avatar: "celebrating" });
    };

    window.addEventListener(CAPTAIN_DELTA_SUGGESTION, onSuggestion);
    window.addEventListener(CAPTAIN_DELTA_AFTER_ANSWER, onAfterAnswer);
    window.addEventListener(CAPTAIN_DELTA_DEBRIEF, onDebrief);
    return () => {
      window.removeEventListener(CAPTAIN_DELTA_SUGGESTION, onSuggestion);
      window.removeEventListener(CAPTAIN_DELTA_AFTER_ANSWER, onAfterAnswer);
      window.removeEventListener(CAPTAIN_DELTA_DEBRIEF, onDebrief);
    };
  }, [deliverMessage, lesson, routeContext]);

  const avatarState: CaptainDeltaAvatarState = useMemo(() => {
    if (pttActive || ptt.listening || pronunciationRecordingActive) return "listening";
    if (thinking) return "thinking";
    if (voice.state === "playing" || voice.state === "loading") return "speaking";
    if (currentMessage?.kind === "coaching") return "correcting";
    if (currentMessage?.kind === "briefing" || currentMessage?.kind === "debrief") {
      return "celebrating";
    }
    return "idle";
  }, [
    pttActive,
    ptt.listening,
    pronunciationRecordingActive,
    thinking,
    voice.state,
    currentMessage?.kind,
  ]);

  const value = useMemo(
    () => ({
      open,
      setOpen,
      context: routeContext,
      contextLabel,
      lesson,
      currentMessage,
      avatarState,
      voice,
      pttActive: pttActive || ptt.listening,
      pttInterim: ptt.interimText,
      pttError: ptt.error,
      voiceStatusLabel,
      thinking,
      pronunciationMicUi,
      pronunciationRecordingActive,
      registerPronunciationRecording,
      triggerPrimaryAction,
      triggerSecondaryAction,
      startPtt,
      stopPtt,
      quickQuestion,
      playBriefing,
    }),
    [
      open,
      routeContext,
      contextLabel,
      lesson,
      currentMessage,
      avatarState,
      voice,
      pttActive,
      ptt.listening,
      ptt.interimText,
      ptt.error,
      voiceStatusLabel,
      thinking,
      pronunciationMicUi,
      pronunciationRecordingActive,
      registerPronunciationRecording,
      triggerPrimaryAction,
      triggerSecondaryAction,
      startPtt,
      stopPtt,
      quickQuestion,
      playBriefing,
    ],
  );

  return <CaptainDeltaCtx.Provider value={value}>{children}</CaptainDeltaCtx.Provider>;
}

export function useCaptainDelta(): CaptainDeltaContextValue {
  const ctx = useContext(CaptainDeltaCtx);
  if (!ctx) throw new Error("useCaptainDelta must be used within CaptainDeltaProvider");
  return ctx;
}
