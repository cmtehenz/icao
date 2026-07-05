"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { CAPTAIN_DELTA_DEBRIEF } from "@/lib/captainDelta/events";
import { emitCaptainDeltaSuggestion } from "@/lib/captainDelta/events";
import {
  CAPTAIN_DELTA_SESSION_RECORD,
  type CaptainDeltaSessionRecordPayload,
} from "@/lib/captainDelta/memory/events";
import { recordCaptainDeltaSession } from "@/lib/captainDelta/memory/record";
import {
  buildSessionClosing,
  markSessionClosed,
  sessionCloseToSpeech,
  shouldOfferSessionClose,
} from "@/lib/captainDelta/memory/sessionClose";
import { CAPTAIN_DELTA_MEMORY_EVENT } from "@/lib/captainDelta/memory/store";
import { INSTRUCTOR_MEMORY_EVENT } from "@/lib/flightInstructor/memory";
import { STUDY_ACTIVITY_RECORDED_EVENT } from "@/lib/studyActivityRecord";
import { isCaptainDeltaProactiveEnabled } from "@/lib/captainDelta/voiceConfig";
import { getCaptainDeltaContext } from "@/lib/captainDelta/context";
import type { CaptainDeltaContext } from "@/lib/captainDelta/types";

const SESSION_CLOSE_CONTEXTS: CaptainDeltaContext[] = [
  "dashboard",
  "part1",
  "part2",
  "simulation",
  "recall",
  "debrief",
];

export default function CaptainDeltaMemoryBridge() {
  const { user } = useAuth();
  const pathname = usePathname();
  const sessionCloseSent = useRef(false);
  const closeTimer = useRef<number | null>(null);

  useEffect(() => {
    const onRecord = (e: Event) => {
      const detail = (e as CustomEvent<CaptainDeltaSessionRecordPayload>).detail;
      if (detail) recordCaptainDeltaSession(detail);
    };
    window.addEventListener(CAPTAIN_DELTA_SESSION_RECORD, onRecord);
    return () => window.removeEventListener(CAPTAIN_DELTA_SESSION_RECORD, onRecord);
  }, []);

  useEffect(() => {
    if (!user || pathname === "/login") return;
    const context = getCaptainDeltaContext(pathname);
    if (!SESSION_CLOSE_CONTEXTS.includes(context)) return;

    const maybeCloseSession = () => {
      if (!isCaptainDeltaProactiveEnabled()) return;
      if (sessionCloseSent.current || !shouldOfferSessionClose()) return;
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
      closeTimer.current = window.setTimeout(() => {
        if (sessionCloseSent.current || !shouldOfferSessionClose()) return;
        sessionCloseSent.current = true;
        const firstName = user.name?.split(" ")[0] || user.email.split("@")[0] || "pilot";
        const closing = buildSessionClosing(firstName);
        markSessionClosed();
        emitCaptainDeltaSuggestion({
          text: `${closing.praise}\n\nTomorrow: ${closing.tomorrowItems.join(" · ")}\n\n${closing.signOff}`,
          speechText: sessionCloseToSpeech(closing),
          kind: "coaching",
          primaryAction: { id: "ready", label: "👍 Got it", primary: true },
          secondaryActions: [],
        });
      }, 90_000);
    };

    const events = [
      STUDY_ACTIVITY_RECORDED_EVENT,
      CAPTAIN_DELTA_MEMORY_EVENT,
      INSTRUCTOR_MEMORY_EVENT,
      CAPTAIN_DELTA_DEBRIEF,
      CAPTAIN_DELTA_SESSION_RECORD,
    ];
    for (const ev of events) window.addEventListener(ev, maybeCloseSession);

    return () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
      for (const ev of events) window.removeEventListener(ev, maybeCloseSession);
    };
  }, [user, pathname]);

  return null;
}
