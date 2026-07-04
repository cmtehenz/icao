import { getNextMissionAction } from "@/lib/dailyMission";
import { buildImprovementLines } from "@/lib/captainDelta/memory/improvements";
import { loadCaptainDeltaMemory, saveCaptainDeltaMemory } from "@/lib/captainDelta/memory/store";
import type { SessionClosing } from "@/lib/captainDelta/memory/types";
import { computeAdaptivePriorities } from "@/lib/captainDelta/memory/adaptive";
import { getWeakestQuestions } from "@/lib/captainDelta/memory/aggregate";
import { todayKey } from "@/lib/studyTime";

export function buildSessionClosing(firstName: string): SessionClosing {
  const improvements = buildImprovementLines();
  const priorities = computeAdaptivePriorities();
  const weak = getWeakestQuestions(1)[0];
  const next = getNextMissionAction();

  const praise =
    improvements[0] ??
    "Excellent work today. You are building real pilot speech — not textbook English.";

  const tomorrowItems: string[] = [];
  if (weak) tomorrowItems.push(weak.label);
  if (next) tomorrowItems.push(next.title.replace(/^Continue: /, ""));
  tomorrowItems.push("Five minutes of pronunciation");
  if (priorities[0]?.area === "Part 2") {
    tomorrowItems[1] = "One Part 2 scenario";
  }

  return {
    praise,
    tomorrowItems: [...new Set(tomorrowItems)].slice(0, 3),
    signOff: `Rest well. See you tomorrow, ${firstName}.`,
  };
}

export function markSessionClosed(): void {
  const store = loadCaptainDeltaMemory();
  saveCaptainDeltaMemory({
    ...store,
    lastSessionCloseAt: new Date().toISOString(),
  });
}

export function shouldOfferSessionClose(): boolean {
  const store = loadCaptainDeltaMemory();
  const today = todayKey();
  if (!store.sessionDates.includes(today)) return false;
  if (store.lastSessionCloseAt?.slice(0, 10) === today) return false;
  return true;
}

export function sessionCloseToSpeech(c: SessionClosing): string {
  return [
    c.praise,
    "You are becoming much more natural.",
    `Tomorrow I recommend: ${c.tomorrowItems.join(", ")}.`,
    c.signOff,
  ].join(" ");
}
