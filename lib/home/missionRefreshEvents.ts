/** Mission state change events — UI refresh only (not Captain Delta). */
import { DAILY_MISSION_LOG_EVENT } from "@/lib/dailyMissionLog";
import { DAILY_MISSION_SYNC_EVENT } from "@/lib/dailyMissionSync";
import { FLIGHT_DEBRIEF_EVENT } from "@/lib/flightDebrief/flightDebriefProgress";
import { MISSION_RECALL_EVENT } from "@/lib/missionRecall/missionRecallProgress";
import { PART1_DAILY_MISSION_EVENT } from "@/lib/part1DailyMission";
import { PART2_DAILY_MISSION_EVENT } from "@/lib/part2DailyMission";
import { PRONUNCIATION_DAILY_MISSION_EVENT } from "@/lib/pronunciationDailyMission";
import { VOCAB_DAILY_MISSION_EVENT } from "@/lib/vocabDailyMission";
import { STUDY_PLAN_CHANGE_EVENT } from "@/lib/studyTime";

export const MISSION_REFRESH_EVENTS = [
  PRONUNCIATION_DAILY_MISSION_EVENT,
  VOCAB_DAILY_MISSION_EVENT,
  PART1_DAILY_MISSION_EVENT,
  PART2_DAILY_MISSION_EVENT,
  MISSION_RECALL_EVENT,
  FLIGHT_DEBRIEF_EVENT,
  DAILY_MISSION_LOG_EVENT,
  DAILY_MISSION_SYNC_EVENT,
  STUDY_PLAN_CHANGE_EVENT,
] as const;
