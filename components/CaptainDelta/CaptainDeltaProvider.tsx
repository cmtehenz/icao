"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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
  buildContextTip,
  buildMemoryLine,
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
  CAPTAIN_DELTA_LESSON_CONTEXT,
  emitSecondaryAction,
  emitStartRecord,
  emitStopRecord,
  getCaptainDeltaRecordBridge,
  lessonContextForRoute,
  mergeLessonContext,
} from "@/lib/captainDelta/lessonContext";
import type {
  CaptainDeltaAction,
  CaptainDeltaAvatarState,
  CaptainDeltaContext,
  CaptainDeltaLessonContext,
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
import { buildMemoryContextForPrompt } from "@/lib/flightInstructor/memory";
import { todayKey } from "@/lib/studyTime";
import { useCaptainDeltaVoice } from "@/hooks/useCaptainDeltaVoice";
import { useCaptainDeltaPtt } from "@/hooks/useCaptainDeltaPtt";

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
  triggerPrimaryAction: () => void;
  triggerSecondaryAction: (actionId: string) => void;
  startPtt: () => void;
  stopPtt: () => void;
  quickQuestion: () => void;
  playBriefing: () => void;
};

const CaptainDeltaCtx = createContext<CaptainDeltaContextValue | null>(null);

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

  const firstName =
    user?.name?.split(" ")[0] || user?.email?.split("@")[0] || "pilot";

  const deliverMessage = useCallback(
    (
      msg: CaptainDeltaMessage,
      options?: { autoSpeak?: boolean; avatar?: CaptainDeltaAvatarState },
    ) => {
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
        if (!result.ok) {
          setVoiceStatusLabel(CAPTAIN_VOICE_TEXT_MODE_LABEL);
          warnCaptain("deliverMessage", result.error ?? "Voice output failed");
        }
      });
    },
    [voice],
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
      setThinking(true);
      try {
        const memoryContext = buildMemoryContextForPrompt();
        const res = await fetch("/api/captain-delta", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question,
            pageContext: contextLabel,
            memoryContext,
            transcript: lessonSnapshot.question,
            modelAnswer: lessonSnapshot.modelAnswer,
            lessonContext: lessonSnapshot,
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
    if (pttActive || ptt.listening) {
      void stopPtt();
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

    if (bridge?.canRecord()) {
      emitStartRecord();
      return;
    }

    void startPtt();
  }, [currentMessage, ptt.listening, pttActive, router, startPtt, stopPtt]);

  const triggerSecondaryAction = useCallback(
    (actionId: string) => {
      if (actionId === "show_hint") {
        void replyFromCaptain("I'm stuck. Give me one hint for this screen.", lesson);
        return;
      }
      if (actionId === "give_example") {
        void replyFromCaptain("Give me a short ICAO example for this.", lesson);
        return;
      }
      if (actionId === "slow_audio") {
        void voice.replay();
        return;
      }
      emitSecondaryAction(actionId);
    },
    [lesson, replyFromCaptain, voice],
  );

  const quickQuestion = useCallback(() => {
    setOpen(true);
    void startPtt();
  }, [startPtt]);

  useEffect(() => {
    const onLesson = (e: Event) => {
      const patch = (e as CustomEvent<Partial<CaptainDeltaLessonContext>>).detail;
      if (!patch) return;
      setLesson((prev) => mergeLessonContext(prev, patch));
    };
    window.addEventListener(CAPTAIN_DELTA_LESSON_CONTEXT, onLesson);
    return () => window.removeEventListener(CAPTAIN_DELTA_LESSON_CONTEXT, onLesson);
  }, []);

  useEffect(() => {
    if (!user || !isCaptainDeltaProactiveEnabled()) return;
    if (routeContext === lastContextRef.current) return;
    lastContextRef.current = routeContext;

    voice.stop();
    setCurrentMessage(null);
    setOpen(false);

    const freshLesson = lessonContextForRoute(routeContext);
    setLesson(freshLesson);

    if (routeContext === "pronunciation") {
      const memoryLine = buildMemoryLine();
      const tip = buildContextTip("pronunciation");
      const text = memoryLine ?? tip?.text;
      const speechText = memoryLine ?? tip?.speechText;
      if (text && speechText) {
        const pronunciationWord = memoryLine?.match(/"([^"]+)"/)?.[1];
        const msg = buildMessage(
          memoryLine ? "coaching" : "context",
          text,
          routeContext,
          pronunciationWord ? { ...freshLesson, pronunciationWord } : freshLesson,
          { speechText },
        );
        deliverMessage(msg, { autoSpeak: true });
      }
      return;
    }

    const tip = buildContextTip(routeContext);
    if (tip) {
      deliverMessage(
        buildMessage("context", tip.text, routeContext, freshLesson, {
          speechText: tip.speechText,
        }),
        { autoSpeak: true },
      );
    }
  }, [deliverMessage, routeContext, user, voice]);

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
      deliverMessage(msg);
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
    if (pttActive || ptt.listening || lesson.recording) return "listening";
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
    lesson.recording,
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
