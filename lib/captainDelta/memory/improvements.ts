import { buildAllTrends } from "@/lib/scoreHistory";
import { loadInstructorMemory } from "@/lib/flightInstructor/memory";
import { loadCaptainDeltaMemory } from "@/lib/captainDelta/memory/store";

export function buildImprovementLines(): string[] {
  const lines: string[] = [];
  const trends = buildAllTrends(14);
  const sessions = loadInstructorMemory().sessions;
  const store = loadCaptainDeltaMemory();

  const part1 = trends.find((t) => t.area === "part1");
  if (part1?.direction === "up" && part1.delta != null && part1.delta >= 5) {
    lines.push(`Your Part 1 scores improved by ${part1.delta} points this week.`);
  }

  const pron = trends.find((t) => t.area === "pronunciation");
  if (pron?.direction === "up" && pron.delta != null && pron.delta >= 5) {
    lines.push("Your pronunciation is trending up — keep that slow, clear rhythm.");
  }

  const recent = sessions.slice(-6);
  const naturalCount = recent.filter(
    (s) => s.naturalnessLevel === "natural" || s.naturalnessLevel === "professional_pilot",
  ).length;
  if (naturalCount >= 2) {
    lines.push("You are speaking more naturally — less memorized script.");
  }

  const confEntries = store.confidenceLog.slice(-10);
  const unsure = confEntries.filter((c) => c.level === "unsure").length;
  if (confEntries.length >= 4 && unsure <= 1) {
    lines.push("Today you hesitated much less — confidence is building.");
  }

  const best = store.bestAnswers[store.bestAnswers.length - 1];
  if (best && best.score >= 80) {
    lines.push(`That was a strong answer on ${best.label} — one of your best so far.`);
  }

  const topMistake = Object.entries(store.vocabularyRepeats).sort((a, b) => b[1] - a[1])[0];
  if (topMistake && topMistake[1] >= 3) {
    const prevSessions = sessions.slice(-20, -10);
    const prevHad = prevSessions.some((s) =>
      s.weakAreas.some((w) => w.toLowerCase().includes(topMistake[0])),
    );
    const recentHas = recent.some((s) =>
      s.weakAreas.some((w) => w.toLowerCase().includes(topMistake[0])),
    );
    if (prevHad && !recentHas) {
      lines.push(`Your use of "${topMistake[0]}" is sounding much better.`);
    }
  }

  return lines.slice(0, 4);
}
