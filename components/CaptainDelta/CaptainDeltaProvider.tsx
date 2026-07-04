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
} from "@/lib/captainDelta/events";
import {
  CAPTAIN_DELTA_LESSON_CONTEXT,
  emitSecondaryAction,
  emitStartRecord,
  emitStopRecord,
  getCaptainDeltaRecordBridge,
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
import { getNextMissionAction } from "@/lib/dailyMission";
import { buildMemoryContextForPrompt } from "@/lib/flightInstructor/memory";
import { todayKey } from "@/lib/studyTime";
import { useCaptainDeltaVoice } from "@/hooks/useCaptainDeltaVoice";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

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
    missionExpression?: string;
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
    missionExpression: options?.missionExpression,
  };
}

export function CaptainDeltaProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const routeContext = getCaptainDeltaContext(pathname);
  const contextLabel = CONTEXT_LABELS[routeContext];
  const voice = useCaptainDeltaVoice();
  const speech = useSpeechRecognition("en-US");
  const speechRef = useRef(speech);
  speechRef.current = speech;

  const [open, setOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<CaptainDeltaMessage | null>(null);
  const [lesson, setLesson] = useState<CaptainDeltaLessonContext>(DEFAULT_LESSON_CONTEXT);
  const [pttActive, setPttActive] = useState(false);
  const [thinking, setThinking] = useState(false);
  const lastContextRef = useRef<CaptainDeltaContext | null>(null);
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
      if (options?.autoSpeak !== false) {
        void voice.speak(msg.speechText ?? msg.text);
      }
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
        const data = (await res.json()) as { reply: string; followUp?: string | null };
        const msg = buildMessage("coaching", data.reply, routeContext, lessonSnapshot, {
          speechText: toSpeechText(data.reply),
        });
        deliverMessage(msg, { avatar: "correcting" });
        if (data.followUp) {
          window.setTimeout(() => {
            const follow = buildMessage("followup", data.followUp!, routeContext, lessonSnapshot, {
              speechText: toSpeechText(data.followUp!),
            });
            deliverMessage(follow);
          }, 1400);
        }
      } catch {
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

  const startPtt = useCallback(() => {
    voice.stop();
    setPttActive(true);
    speech.clear();
    speech.start();
  }, [speech, voice]);

  const stopPtt = useCallback(() => {
    speech.stop();
    setPttActive(false);
    window.setTimeout(() => {
      const said = speechRef.current.transcript.trim();
      if (said) void replyFromCaptain(said, lesson);
    }, 350);
  }, [lesson, replyFromCaptain, speech]);

  const triggerPrimaryAction = useCallback(() => {
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
    if (action === "ask_captain") {
      startPtt();
      return;
    }

    emitStartRecord();
  }, [currentMessage, router, startPtt]);

  const triggerSecondaryAction = useCallback((actionId: string) => {
    emitSecondaryAction(actionId);
  }, []);

  const quickQuestion = useCallback(() => {
    setOpen(true);
    startPtt();
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
    if (!user) return;
    if (routeContext === lastContextRef.current) return;
    lastContextRef.current = routeContext;

    const tip = buildContextTip(routeContext);
    if (tip) {
      const msg = buildMessage("context", tip.text, routeContext, lesson, {
        speechText: tip.speechText,
      });
      deliverMessage(msg, { autoSpeak: false });
    }

    const memoryLine = buildMemoryLine();
    if (memoryLine && routeContext === "pronunciation") {
      const msg = buildMessage("coaching", memoryLine, routeContext, {
        ...lesson,
        pronunciationWord: memoryLine.match(/"([^"]+)"/)?.[1],
        mode: "pronunciation",
      }, { speechText: memoryLine });
      deliverMessage(msg);
    }
  }, [deliverMessage, lesson, routeContext, user]);

  useEffect(() => {
    if (!user || pathname !== "/" || briefingTriggeredRef.current) return;
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
        missionExpression: coaching.missionExpression,
      });
      deliverMessage(msg, { avatar: "celebrating" });
    };
    const onDebrief = () => {
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
    if (pttActive || speech.listening || lesson.recording) return "listening";
    if (thinking) return "thinking";
    if (voice.state === "playing" || voice.state === "loading") return "speaking";
    if (currentMessage?.kind === "coaching") return "correcting";
    if (currentMessage?.kind === "briefing" || currentMessage?.kind === "debrief") {
      return "celebrating";
    }
    return "idle";
  }, [
    pttActive,
    speech.listening,
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
      pttActive,
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
