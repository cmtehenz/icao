"use client";

import { useEffect } from "react";
import { emitCaptainDeltaSuggestion } from "@/lib/captainDelta/events";
import { DAILY_MISSION_LOG_EVENT } from "@/lib/dailyMissionLog";
import { getNextMissionAction, isDailyMissionComplete } from "@/lib/dailyMission";
import {
  FLIGHT_DEBRIEF_AVAILABLE_EVENT,
  FLIGHT_DEBRIEF_COMPLETE_EVENT,
} from "@/lib/flightDebrief/events";
import {
  MISSION_RECALL_COMPLETE_EVENT,
  MISSION_RECALL_START_EVENT,
} from "@/lib/missionRecall/events";
import type { CaptainDeltaAction } from "@/lib/captainDelta/types";

function readyAction(label: string): CaptainDeltaAction {
  return { id: "ready", label, primary: true };
}

function nextReadyLabel(): string {
  const next = getNextMissionAction();
  return next ? `Ready — ${next.title}` : "👍 Got it";
}

/** Captain reactions to mission flow events — read-only, no state mutation (ADR-009). */
export default function MissionFlowCaptainBridge() {
  useEffect(() => {
    const onRecallStart = () => {
      const text = "Mission Recall — keep it fast. Answer from memory.";
      emitCaptainDeltaSuggestion({
        text,
        speechText: text,
        kind: "mission",
        primaryAction: readyAction("🎤 Answer"),
        secondaryActions: [],
        eventId: "mission:recall-start",
        source: "mission-flow",
      });
    };

    const onRecallComplete = (ev: Event) => {
      const stars = (ev as CustomEvent<{ confidenceStars: number }>).detail?.confidenceStars ?? 3;
      const next = getNextMissionAction();
      const text =
        stars >= 4
          ? next
            ? `Excellent recall. Next: ${next.title}.`
            : "Excellent recall. Today's flight is nearly done."
          : next
            ? `Recall complete. Next: ${next.title}. One more look at Part 2 may help before the Mock Exam.`
            : "Recall complete. One more look at Part 2 may help before the Mock Exam.";
      emitCaptainDeltaSuggestion({
        text,
        speechText: text,
        kind: "mission",
        primaryAction: readyAction(nextReadyLabel()),
        secondaryActions: [],
        eventId: "mission:recall-complete",
        source: "mission-flow",
      });
    };

    const onDebriefAvailable = () => {
      const text =
        "Flight Debrief is ready. One priority improvement — then we close today's flight.";
      emitCaptainDeltaSuggestion({
        text,
        speechText: text,
        kind: "debrief",
        primaryAction: readyAction(nextReadyLabel()),
        secondaryActions: [],
        eventId: "mission:debrief-available",
        source: "mission-flow",
      });
    };

    const onDebriefComplete = () => {
      const text = "Today's flight is complete. Well done, pilot.";
      emitCaptainDeltaSuggestion({
        text,
        speechText: text,
        kind: "debrief",
        primaryAction: readyAction("👍 Got it"),
        secondaryActions: [],
        eventId: "mission:debrief-complete",
        source: "mission-flow",
      });
    };

    const onMissionLog = () => {
      if (isDailyMissionComplete()) {
        const text = "Mission complete. See you tomorrow for the next flight.";
        emitCaptainDeltaSuggestion({
          text,
          speechText: text,
          kind: "mission",
          primaryAction: readyAction("👍 Got it"),
          secondaryActions: [],
          eventId: "mission:daily-complete",
          source: "mission-flow",
        });
      }
    };

    window.addEventListener(MISSION_RECALL_START_EVENT, onRecallStart);
    window.addEventListener(MISSION_RECALL_COMPLETE_EVENT, onRecallComplete);
    window.addEventListener(FLIGHT_DEBRIEF_AVAILABLE_EVENT, onDebriefAvailable);
    window.addEventListener(FLIGHT_DEBRIEF_COMPLETE_EVENT, onDebriefComplete);
    window.addEventListener(DAILY_MISSION_LOG_EVENT, onMissionLog);

    return () => {
      window.removeEventListener(MISSION_RECALL_START_EVENT, onRecallStart);
      window.removeEventListener(MISSION_RECALL_COMPLETE_EVENT, onRecallComplete);
      window.removeEventListener(FLIGHT_DEBRIEF_AVAILABLE_EVENT, onDebriefAvailable);
      window.removeEventListener(FLIGHT_DEBRIEF_COMPLETE_EVENT, onDebriefComplete);
      window.removeEventListener(DAILY_MISSION_LOG_EVENT, onMissionLog);
    };
  }, []);

  return null;
}
