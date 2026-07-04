import { loadCaptainDeltaMemory } from "@/lib/captainDelta/memory/store";
import { loadPart2Progress } from "@/lib/part2/progress";
import { todayKey } from "@/lib/studyTime";

export function buildSmartReminders(): string[] {
  const reminders: string[] = [];
  const today = todayKey();
  const store = loadCaptainDeltaMemory();
  const part2 = loadPart2Progress();

  let lastPart2At: string | null = null;
  for (const item of Object.values(part2.items)) {
    if ("lastAt" in item && typeof item.lastAt === "string" && (!lastPart2At || item.lastAt > lastPart2At)) {
      lastPart2At = item.lastAt;
    }
  }

  if (lastPart2At) {
    const days = Math.floor(
      (new Date(`${today}T12:00:00`).getTime() - new Date(lastPart2At).getTime()) / 86400000,
    );
    if (days >= 3) {
      reminders.push(`You haven't practiced Part 2 for ${days} days.`);
    }
  }

  const dueReview = Object.values(store.questionHistory).find(
    (q) => q.nextReviewAt && q.nextReviewAt <= today,
  );
  if (dueReview) {
    reminders.push(`Time to review ${dueReview.label}.`);
  }

  if (Object.values(store.connectorUsage).reduce((s, v) => s + v, 0) < 2) {
    reminders.push("You haven't used structure connectors recently.");
  }

  return reminders.slice(0, 2);
}
