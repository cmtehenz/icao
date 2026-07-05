"use client";

import { useEffect } from "react";
import { emitCaptainDeltaSuggestion } from "@/lib/captainDelta/events";
import { DAILY_MISSION_LOG_EVENT } from "@/lib/dailyMissionLog";
import { isDailyMissionComplete } from "@/lib/dailyMission";
import {
  FLIGHT_DEBRIEF_AVAILABLE_EVENT,
  FLIGHT_DEBRIEF_COMPLETE_EVENT,
} from "@/lib/flightDebrief/events";
import {
  MISSION_RECALL_COMPLETE_EVENT,
  MISSION_RECALL_START_EVENT,
} from "@/lib/missionRecall/events";

/** Captain reactions to mission flow events — read-only, no state mutation (ADR-009). */
export default function MissionFlowCaptainBridge() {
  useEffect(() => {
    const onRecallStart = () => {
      emitCaptainDeltaSuggestion({
        text: "Mission Recall — keep it fast. Answer from memory.",
        kind: "mission",
      });
    };

    const onRecallComplete = (ev: Event) => {
      const stars = (ev as CustomEvent<{ confidenceStars: number }>).detail?.confidenceStars ?? 3;
      emitCaptainDeltaSuggestion({
        text:
          stars >= 4
            ? "Excellent recall. Continue when ready."
            : "Recall complete. One more look at Part 2 may help before the Mock Exam.",
        kind: "mission",
      });
    };

    const onDebriefAvailable = () => {
      emitCaptainDeltaSuggestion({
        text: "Flight Debrief is ready. One priority improvement — then we close today's flight.",
        kind: "debrief",
      });
    };

    const onDebriefComplete = () => {
      emitCaptainDeltaSuggestion({
        text: "Today's flight is complete. Well done, pilot.",
        kind: "debrief",
      });
    };

    const onMissionLog = () => {
      if (isDailyMissionComplete()) {
        emitCaptainDeltaSuggestion({
          text: "Mission complete. See you tomorrow for the next flight.",
          kind: "mission",
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
