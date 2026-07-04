import { loadInstructorMemory } from "@/lib/flightInstructor/memory";
import { loadCaptainDeltaMemory } from "@/lib/captainDelta/memory/store";
import type { DetectedPattern } from "@/lib/captainDelta/memory/types";

const OPENING_PATTERNS = [
  { re: /\bi think\b/i, id: "opening-i-think", label: "You often start with \"I think\"", mission: "Try a direct opening: \"In my operation…\"" },
  { re: /\bi believe\b/i, id: "opening-i-believe", label: "You often start with \"I believe\"", mission: "Open with a fact or experience, not opinion." },
  { re: /\bfor me\b/i, id: "opening-for-me", label: "You often say \"For me\"", mission: "Use pilot language: \"In my experience…\"" },
];

export function detectSpeechPatterns(): DetectedPattern[] {
  const sessions = loadInstructorMemory().sessions.slice(-40);
  const store = loadCaptainDeltaMemory();
  const patterns: DetectedPattern[] = [];

  for (const { re, id, label, mission } of OPENING_PATTERNS) {
    const count = sessions.filter((s) => re.test(s.transcript)).length;
    if (count >= 2) {
      patterns.push({ id, label, detail: `${count} recent answers`, count, missionHint: mission });
    }
  }

  const withoutExample = sessions.filter(
    (s) => !/\bfor example\b|\bfor instance\b|\bsuch as\b/i.test(s.transcript),
  ).length;
  if (withoutExample >= 3 && sessions.length >= 3) {
    patterns.push({
      id: "missing-examples",
      label: "You rarely use examples",
      detail: `${withoutExample} answers without an example`,
      count: withoutExample,
      missionHint: "Add one real story — \"For example, last week…\"",
    });
  }

  const withoutConclusion = sessions.filter(
    (s) => !/\b(in conclusion|to conclude|finally|in summary|overall)\b/i.test(s.transcript),
  ).length;
  if (withoutConclusion >= 3 && sessions.length >= 3) {
    patterns.push({
      id: "missing-conclusion",
      label: "You often forget to conclude",
      detail: `${withoutConclusion} answers without a closing line`,
      count: withoutConclusion,
      missionHint: "End with one clear line: \"Overall, safety comes first.\"",
    });
  }

  for (const [connector, count] of Object.entries(store.connectorUsage)) {
    if (count >= 4) continue;
    if (count === 0 && sessions.length >= 5) {
      patterns.push({
        id: `connector-${connector}`,
        label: `You rarely use "${connector}"`,
        detail: "Structure connectors build ICAO 4+ answers",
        count: 0,
        missionHint: `Use "${connector}" in your next answer.`,
      });
      break;
    }
  }

  return patterns.slice(0, 4);
}
