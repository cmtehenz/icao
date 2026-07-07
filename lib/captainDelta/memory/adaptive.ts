import { buildDifficultyInsights } from "@/lib/difficultyInsights";
import { loadCaptainDeltaMemory } from "@/lib/captainDelta/memory/store";

export function computeAdaptivePriorities(): {
  area: string;
  reason: string;
  href: string;
}[] {
  const insights = buildDifficultyInsights(4);
  const priorities: { area: string; reason: string; href: string; score: number }[] = [];

  for (const ins of insights) {
    if (ins.score == null) continue;
    if (ins.area === "pronunciation" && ins.score < 65) {
      priorities.push({
        area: "Word Mission",
        reason: "Weak pronunciation — more Word Mission practice",
        href: "/word-mission",
        score: ins.score,
      });
    }
    if (ins.area === "part2" && ins.score < 60) {
      priorities.push({
        area: "Part 2",
        reason: "Weak readback & interaction",
        href: "/part2",
        score: ins.score,
      });
    }
    if (ins.area === "part1" && ins.score < 65) {
      priorities.push({
        area: "Part 1",
        reason: "Speaking structure needs work",
        href: "/part1",
        score: ins.score,
      });
    }
    if (ins.area === "vocabulary" && ins.score < 60) {
      priorities.push({
        area: "Word Mission",
        reason: "Aviation phrases need reinforcement",
        href: "/word-mission",
        score: ins.score,
      });
    }
  }

  const store = loadCaptainDeltaMemory();
  const unsure = store.confidenceLog.slice(-8).filter((c) => c.level === "unsure").length;
  if (unsure >= 3) {
    priorities.push({
      area: "Confidence",
      reason: "Recent answers felt unsure — slow down and use keywords",
      href: "/part1",
      score: 40,
    });
  }

  return priorities
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map(({ area, reason, href }) => ({ area, reason, href }));
}
