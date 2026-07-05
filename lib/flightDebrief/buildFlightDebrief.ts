import { todayExamLabel } from "@/lib/dailyExamRotation";
import { buildDifficultyInsights } from "@/lib/difficultyInsights";
import type { FlightDebriefSummary } from "@/lib/flightDebrief/flightDebriefTypes";
import { missionRecallProgress, loadMissionRecallState } from "@/lib/missionRecall/missionRecallProgress";
import {
  isSimulateMissionDone,
  isSimulateMissionRequired,
  simulateMissionProgress,
} from "@/lib/simulateDailyMission";
import {
  part1DailyMissionProgress,
  getOrCreatePart1DailyMission,
} from "@/lib/part1DailyMission";
import {
  part2DailyMissionProgress,
  getOrCreatePart2DailyMission,
} from "@/lib/part2DailyMission";
import {
  pronunciationDailyMissionProgress,
  getOrCreatePronunciationDailyMission,
} from "@/lib/pronunciationDailyMission";
import {
  vocabDailyMissionProgress,
  getOrCreateVocabDailyMission,
} from "@/lib/vocabDailyMission";
import { buildVocabMissionDebrief } from "@/lib/vocabMission";
import { loadStudyPlanMode, todayKey } from "@/lib/studyTime";
import { loadAllConversationMetrics } from "@/lib/humanExaminer/conversationStore";
import type { Part1ConversationDebrief } from "@/lib/flightDebrief/flightDebriefTypes";

function aggregatePart1Conversation(): Part1ConversationDebrief | null {
  const all = loadAllConversationMetrics();
  if (all.length === 0) return null;
  const n = all.length;
  const avg = (pick: (m: (typeof all)[0]) => number) =>
    Math.round(all.reduce((s, m) => s + pick(m), 0) / n);
  const weakest = [...all].sort(
    (a, b) => a.followUpHandling - b.followUpHandling,
  )[0];
  return {
    conversationQuality: avg((m) => m.conversationQuality),
    followUpHandling: avg((m) => m.followUpHandling),
    naturalness: avg((m) => m.naturalness),
    operationalReasoning: avg((m) => m.operationalReasoning),
    confidence: avg((m) => m.confidence),
    priorityImprovement: weakest?.priorityImprovement ?? all[0].priorityImprovement,
    tomorrowFocus: weakest?.tomorrowFocus ?? all[0].tomorrowFocus,
  };
}

export function buildFlightDebrief(dateKey = todayKey()): FlightDebriefSummary {
  const examLabel = todayExamLabel(dateKey);
  const mode = loadStudyPlanMode();
  const simulateRequired = isSimulateMissionRequired(mode);
  const vocabDebrief = buildVocabMissionDebrief();
  const part1Conversation = aggregatePart1Conversation();

  const pronunciation = pronunciationDailyMissionProgress(getOrCreatePronunciationDailyMission());
  const vocabulary = vocabDailyMissionProgress(getOrCreateVocabDailyMission());
  const part1 = part1DailyMissionProgress(getOrCreatePart1DailyMission());
  const part2 = part2DailyMissionProgress(getOrCreatePart2DailyMission());
  const recall = missionRecallProgress();
  const simulate = simulateMissionProgress(dateKey);

  const legs = [
    { id: "pronunciation", label: "Pronunciation", complete: pronunciation.complete },
    { id: "vocabulary", label: "Vocabulary", complete: vocabulary.complete },
    { id: "part1", label: "Part 1", complete: part1.complete },
    { id: "part2", label: "Part 2", complete: part2.complete },
    { id: "recall", label: "Mission Recall", complete: recall.complete },
  ];
  if (simulateRequired) {
    legs.push({ id: "simulate", label: "Mock Exam", complete: simulate.complete });
  }

  const insights = buildDifficultyInsights(5);
  const scored = insights.filter((i) => i.score != null);
  const strongest =
    [...scored].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))[0] ?? null;
  const weakest =
    [...scored].sort((a, b) => (a.score ?? 0) - (b.score ?? 0))[0] ?? insights[0];
  const priorityImprovement =
    part1Conversation?.priorityImprovement ??
    weakest?.hint ??
    (vocabDebrief.weakTerms.length > 0
      ? `Vocabulary mission: finish VB-1→VB-4 on ${vocabDebrief.weakTerms[0]}.`
      : weakest?.items[0]?.label) ??
    "Keep answers short and operational — one idea at a time.";

  const strongestArea = strongest
    ? `${strongest.label} — ${strongest.displayScore ?? `${strongest.score}%`}`
    : "Consistent effort across today's legs.";

  const weakestArea = weakest
    ? `${weakest.label} — ${weakest.displayScore ?? (weakest.score != null ? `${weakest.score}%` : "needs practice")}`
    : "No weak area flagged yet — keep the same pace tomorrow.";

  const recallState = loadMissionRecallState();
  const speechCount = recallState?.answers
    ? Object.values(recallState.answers).filter((a) => a.method === "speech").length
    : 0;
  const recallResult = recall.complete
    ? `${recall.done}/${recall.total} items recalled · ${recall.confidenceStars}/5 confidence${
        speechCount > 0 ? ` · ${speechCount} spoken` : ""
      }`
    : "Mission Recall not completed.";

  const tomorrowFocus =
    part1Conversation?.tomorrowFocus ??
    (weakest?.label != null
      ? `Tomorrow: ${weakest.label.toLowerCase()} practice from today's exam.`
      : vocabDebrief.nextFocus ?? "Tomorrow: continue today's exam rotation with the same steady pace.");

  const nextAction = simulateRequired && !simulate.complete
    ? "Complete today's Mock Exam, then return for debrief."
    : recall.complete
      ? "Review today's priority improvement once, then rest."
      : "Finish Mission Recall before closing today's flight.";

  const completedCount = legs.filter((l) => l.complete).length;
  const readinessPercent = Math.round((completedCount / Math.max(legs.length, 1)) * 100);

  const positiveOpening =
    pronunciation.complete && vocabulary.complete && part1.complete && part2.complete
      ? vocabDebrief.strongTerms.length > 0
        ? `Today's flight is complete — strong vocabulary on ${vocabDebrief.strongTerms.slice(0, 2).join(", ")}.`
        : "Today's flight is complete — solid work across the mission legs."
      : "Good progress today — keep building consistency one leg at a time.";

  return {
    date: dateKey,
    examLabel,
    positiveOpening,
    legs,
    recallResult,
    recallConfidenceStars: recall.confidenceStars,
    strongestArea,
    weakestArea,
    priorityImprovement,
    nextAction,
    tomorrowFocus,
    readinessPercent,
    part1Conversation,
  };
}

export function isFlightDebriefAvailable(dateKey = todayKey()): boolean {
  const pronunciation = pronunciationDailyMissionProgress(getOrCreatePronunciationDailyMission());
  const vocabulary = vocabDailyMissionProgress(getOrCreateVocabDailyMission());
  const part1 = part1DailyMissionProgress(getOrCreatePart1DailyMission());
  const part2 = part2DailyMissionProgress(getOrCreatePart2DailyMission());
  if (!pronunciation.complete || !vocabulary.complete || !part1.complete || !part2.complete) {
    return false;
  }
  const recall = missionRecallProgress();
  if (!recall.complete) return false;
  if (isSimulateMissionRequired() && !isSimulateMissionDone(dateKey)) return false;
  return true;
}
