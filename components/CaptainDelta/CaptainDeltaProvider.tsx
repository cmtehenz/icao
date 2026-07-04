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
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
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
import type {
  CaptainDeltaContext,
  CaptainDeltaMessage,
  CaptainDeltaMessageKind,
} from "@/lib/captainDelta/types";
import { toSpeechText } from "@/lib/captainDelta/voiceText";
import { buildMemoryContextForPrompt } from "@/lib/flightInstructor/memory";
import { todayKey } from "@/lib/studyTime";
import { useCaptainDeltaVoice } from "@/hooks/useCaptainDeltaVoice";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

type CaptainDeltaContextValue = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  context: CaptainDeltaContext;
  contextLabel: string;
  messages: CaptainDeltaMessage[];
  currentMessage: CaptainDeltaMessage | null;
  voice: ReturnType<typeof useCaptainDeltaVoice>;
  listening: boolean;
  askCaptain: (question: string) => Promise<void>;
  startHoldToTalk: () => void;
  stopHoldToTalk: () => void;
  deliverMessage: (
    text: string,
    kind: CaptainDeltaMessageKind,
    options?: { speechText?: string; autoSpeak?: boolean },
  ) => void;
  playBriefing: () => void;
};

const CaptainDeltaCtx = createContext<CaptainDeltaContextValue | null>(null);

function newMessage(
  kind: CaptainDeltaMessageKind,
  text: string,
  speechText?: string,
): CaptainDeltaMessage {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    kind,
    text,
    speechText,
    at: new Date().toISOString(),
  };
}

export function CaptainDeltaProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const context = getCaptainDeltaContext(pathname);
  const contextLabel = CONTEXT_LABELS[context];
  const voice = useCaptainDeltaVoice();
  const speech = useSpeechRecognition("en-US");
  const speechRef = useRef(speech);
  speechRef.current = speech;
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<CaptainDeltaMessage[]>([]);
  const [listening, setListening] = useState(false);
  const lastContextRef = useRef<CaptainDeltaContext | null>(null);
  const briefingTriggeredRef = useRef(false);

  const firstName =
    user?.name?.split(" ")[0] || user?.email?.split("@")[0] || "pilot";

  const deliverMessage = useCallback(
    (
      text: string,
      kind: CaptainDeltaMessageKind,
      options?: { speechText?: string; autoSpeak?: boolean },
    ) => {
      const msg = newMessage(kind, text, options?.speechText ?? toSpeechText(text));
      setMessages((prev) => [msg, ...prev].slice(0, 12));
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
    deliverMessage(text, "briefing", { speechText });
  }, [deliverMessage, firstName]);

  const askCaptain = useCallback(
    async (question: string) => {
      const trimmed = question.trim();
      if (!trimmed) return;

      deliverMessage(trimmed, "answer", { autoSpeak: false });

      try {
        const memoryContext = buildMemoryContextForPrompt();
        const res = await fetch("/api/captain-delta", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: trimmed,
            pageContext: contextLabel,
            memoryContext,
          }),
        });
        const data = (await res.json()) as { reply: string; followUp?: string | null };
        deliverMessage(data.reply, "coaching", { speechText: toSpeechText(data.reply) });
        if (data.followUp) {
          setTimeout(() => {
            deliverMessage(data.followUp!, "followup", {
              speechText: toSpeechText(data.followUp!),
            });
          }, 1200);
        }
      } catch {
        deliverMessage(
          "Stay with operational language. Explain your decision like a briefing.",
          "coaching",
        );
      }
    },
    [contextLabel, deliverMessage],
  );

  const startHoldToTalk = useCallback(() => {
    setListening(true);
    speech.clear();
    speech.start();
  }, [speech]);

  const stopHoldToTalk = useCallback(() => {
    speech.stop();
    setListening(false);
    window.setTimeout(() => {
      const said = speechRef.current.transcript.trim();
      if (said) void askCaptain(said);
    }, 350);
  }, [askCaptain, speech]);

  useEffect(() => {
    if (!user) return;
    if (context === lastContextRef.current) return;
    lastContextRef.current = context;

    const tip = buildContextTip(context);
    if (tip) {
      deliverMessage(tip.text, "context", { speechText: tip.speechText, autoSpeak: false });
    }

    const memoryLine = buildMemoryLine();
    if (memoryLine && Math.random() < 0.35) {
      deliverMessage(memoryLine, "coaching", { speechText: memoryLine, autoSpeak: false });
    }
  }, [context, deliverMessage, user]);

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
      const detail = (e as CustomEvent<{ text: string; speechText?: string; kind?: CaptainDeltaMessageKind }>)
        .detail;
      if (!detail?.text) return;
      deliverMessage(detail.text, detail.kind ?? "suggestion", {
        speechText: detail.speechText,
      });
    };
    const onAfterAnswer = (e: Event) => {
      const detail = (e as CustomEvent<{ report: import("@/lib/flightInstructor/types").FlightInstructorReport }>)
        .detail;
      if (!detail?.report) return;
      const coaching = buildAfterAnswerCoaching(detail.report);
      deliverMessage(coaching.text, "coaching", { speechText: coaching.speechText });
    };
    const onDebrief = () => {
      const debrief = buildSimulationDebrief();
      deliverMessage(debrief.text, "debrief", { speechText: debrief.speechText });
    };

    window.addEventListener(CAPTAIN_DELTA_SUGGESTION, onSuggestion);
    window.addEventListener(CAPTAIN_DELTA_AFTER_ANSWER, onAfterAnswer);
    window.addEventListener(CAPTAIN_DELTA_DEBRIEF, onDebrief);
    return () => {
      window.removeEventListener(CAPTAIN_DELTA_SUGGESTION, onSuggestion);
      window.removeEventListener(CAPTAIN_DELTA_AFTER_ANSWER, onAfterAnswer);
      window.removeEventListener(CAPTAIN_DELTA_DEBRIEF, onDebrief);
    };
  }, [deliverMessage]);

  const currentMessage = messages[0] ?? null;

  const value = useMemo(
    () => ({
      open,
      setOpen,
      context,
      contextLabel,
      messages,
      currentMessage,
      voice,
      listening,
      askCaptain,
      startHoldToTalk,
      stopHoldToTalk,
      deliverMessage,
      playBriefing,
    }),
    [
      open,
      context,
      contextLabel,
      messages,
      currentMessage,
      voice,
      listening,
      askCaptain,
      startHoldToTalk,
      stopHoldToTalk,
      deliverMessage,
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
