import type { FollowUpCategory, QuestionContext, ConversationState } from "@/lib/humanExaminer/types";
import { FOLLOW_UP_PRIORITY } from "@/lib/humanExaminer/types";
import { buildMemoryFollowUp } from "@/lib/humanExaminer/conversationMemory";

export const FOLLOW_UP_PATTERNS: Record<FollowUpCategory, string[]> = {
  clarification: [
    "Could you explain that?",
    "What do you mean by that?",
    "Can you clarify that point?",
  ],
  expansion: [
    "Tell me more.",
    "Could you expand on that?",
    "Why?",
  ],
  personal: [
    "Has that ever happened to you?",
    "How do you normally do that?",
    "What is your usual practice?",
  ],
  operational: [
    "How would you brief the crew?",
    "What is the biggest risk?",
    "Why is that important?",
    "What would you do next operationally?",
  ],
  example: [
    "Can you give an example?",
    "Can you think of an example from a flight?",
    "What happened next?",
  ],
  comparison: [
    "How is this different in helicopters?",
    "Why not the other way?",
    "How would that compare to a fixed-wing operation?",
  ],
  opinion: [
    "Would you make the same decision again?",
    "What is your view on that?",
    "Do you agree with that approach?",
  ],
  hypothetical: [
    "What if the weather deteriorated?",
    "What could have been done differently?",
    "Suppose the passenger refused — what then?",
  ],
  recovery: [
    "Take your time.",
    "Could you explain it another way?",
    "Can you think of an example?",
    "What happened after that?",
    "How would you describe it differently?",
  ],
};

function transcriptSignals(transcript: string): {
  short: boolean;
  vague: boolean;
  personal: boolean;
  operational: boolean;
  negative: boolean;
} {
  const t = transcript.trim();
  const words = t.split(/\s+/).filter(Boolean);
  const lower = t.toLowerCase();
  return {
    short: words.length < 12,
    vague: /\b(i think|maybe|something|kind of|sort of)\b/i.test(t),
    personal: /\b(i|my|we|our|usually|normally|once|when i)\b/i.test(t),
    operational: /\b(brief|crew|passenger|weather|fuel|checklist|procedure|risk|safety)\b/i.test(
      lower,
    ),
    negative: /\b(don't|do not|never|not usually|avoid)\b/i.test(lower),
  };
}

function pickPattern(
  category: FollowUpCategory,
  usedTexts: Set<string>,
  ctx: QuestionContext,
): string {
  const pool = [...FOLLOW_UP_PATTERNS[category]];
  if (category !== "recovery" && ctx.suggestedFollowUps.length > 0) {
    pool.push(...ctx.suggestedFollowUps.slice(0, 2));
  }
  for (const p of pool) {
    if (!usedTexts.has(p.toLowerCase())) return p;
  }
  return pool[pool.length - 1] ?? "Could you tell me more?";
}

function categoryForSignals(
  signals: ReturnType<typeof transcriptSignals>,
  used: FollowUpCategory[],
): FollowUpCategory {
  const available = FOLLOW_UP_PRIORITY.filter((c) => !used.includes(c) || c === "recovery");
  for (const cat of available) {
    if (cat === "recovery") continue;
    if (cat === "clarification" && (signals.short || signals.vague)) return cat;
    if (cat === "expansion" && signals.short) return cat;
    if (cat === "personal" && signals.personal) return cat;
    if (cat === "operational" && signals.operational) return cat;
    if (cat === "example" && !signals.personal) return cat;
    if (cat === "comparison" && ctxNeedsComparison(signals)) return cat;
    if (cat === "opinion" && signals.personal) return cat;
    if (cat === "hypothetical" && signals.operational) return cat;
  }
  return available.find((c) => c !== "recovery") ?? "expansion";
}

function ctxNeedsComparison(signals: ReturnType<typeof transcriptSignals>): boolean {
  return signals.operational;
}

export type FollowUpSelection = {
  question: string;
  category: FollowUpCategory;
};

export function selectFollowUp(
  ctx: QuestionContext,
  state: ConversationState,
  lastTranscript: string,
  lastScore: number,
): FollowUpSelection {
  const usedTexts = new Set(
    state.turns
      .filter((t) => t.role === "examiner")
      .map((t) => t.text.toLowerCase()),
  );

  if (lastScore < 45 || lastTranscript.trim().split(/\s+/).length < 5) {
    const recovery = pickPattern("recovery", usedTexts, ctx);
    return { question: recovery, category: "recovery" };
  }

  const memoryFollowUp = buildMemoryFollowUp(state.memoryPhrases, lastTranscript, usedTexts);
  if (memoryFollowUp) {
    return { question: memoryFollowUp, category: "clarification" };
  }

  const signals = transcriptSignals(lastTranscript);
  if (signals.negative && !state.usedCategories.includes("clarification")) {
    const phrase = extractNegativePhrase(lastTranscript);
    if (phrase) {
      const q = `So why don't you normally ${phrase}?`;
      if (!usedTexts.has(q.toLowerCase())) {
        return { question: q, category: "clarification" };
      }
    }
  }

  const category = categoryForSignals(signals, state.usedCategories);
  const question = pickPattern(category, usedTexts, ctx);
  return { question, category };
}

function extractNegativePhrase(transcript: string): string | null {
  const m = transcript.match(/\b(?:don't|do not|never|not usually)\s+(.+?)(?:\.|$)/i);
  if (!m) return null;
  return m[1].trim().slice(0, 60);
}
