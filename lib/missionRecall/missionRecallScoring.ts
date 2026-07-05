import type { MissionRecallProgress } from "@/lib/missionRecall/missionRecallTypes";

const SHORT_FEEDBACK = ["Good.", "Correct.", "Almost.", "Excellent.", "Try again."] as const;

export function computeRecallConfidence(done: number, total: number): number {
  if (total <= 0) return 3;
  const ratio = done / total;
  if (ratio >= 0.9) return 5;
  if (ratio >= 0.75) return 4;
  if (ratio >= 0.55) return 3;
  if (ratio >= 0.35) return 2;
  return 1;
}

export function recallConfidenceLabel(stars: number): string {
  if (stars >= 5) return "Most of today's mission is already in long-term memory.";
  if (stars >= 4) return "Strong recall — you are ready to continue.";
  if (stars >= 3) return "Good recall — a quick review of Part 2 communication may help.";
  return "I'd review today's Part 2 communication once more before the Mock Exam.";
}

export function recallConfidenceStars(progress: MissionRecallProgress): string {
  const filled = Math.max(0, Math.min(5, progress.confidenceStars));
  return "⭐".repeat(filled) + "☆".repeat(5 - filled);
}

export function shortRecallFeedback(seed = Date.now()): string {
  return SHORT_FEEDBACK[seed % SHORT_FEEDBACK.length]!;
}
