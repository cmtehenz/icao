import type { ConversationState, ConversationTurn } from "@/lib/humanExaminer/types";

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with",
  "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do",
  "does", "did", "will", "would", "could", "should", "may", "might", "must",
  "i", "you", "we", "they", "he", "she", "it", "my", "your", "our", "their",
  "that", "this", "these", "those", "not", "don't", "usually", "normally",
]);

export function extractMemoryPhrases(transcript: string): string[] {
  const phrases: string[] = [];
  const lower = transcript.toLowerCase();

  const negMatch = lower.match(/\b(?:don't|do not|never|not usually)\s+([^.,;]+)/gi);
  if (negMatch) {
    for (const m of negMatch) {
      const cleaned = m.replace(/^(don't|do not|never|not usually)\s+/i, "").trim();
      if (cleaned.length > 4) phrases.push(cleaned);
    }
  }

  const habitMatch = lower.match(/\b(?:i usually|i normally|we usually|we normally)\s+([^.,;]+)/gi);
  if (habitMatch) {
    for (const m of habitMatch) {
      const cleaned = m.replace(/^(i|we)\s+(usually|normally)\s+/i, "").trim();
      if (cleaned.length > 4) phrases.push(cleaned);
    }
  }

  const words = lower
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 4 && !STOP_WORDS.has(w));
  if (words.length >= 2) {
    phrases.push(words.slice(0, 4).join(" "));
  }

  return [...new Set(phrases)].slice(0, 5);
}

export function buildMemoryFollowUp(
  memoryPhrases: string[],
  lastTranscript: string,
  usedTexts: Set<string>,
): string | null {
  const fresh = extractMemoryPhrases(lastTranscript);
  const all = [...fresh, ...memoryPhrases];
  for (const phrase of all) {
    const q = `Earlier you mentioned "${phrase.slice(0, 50)}". Could you expand on that?`;
    if (!usedTexts.has(q.toLowerCase())) return q;
    const q2 = `So why don't you normally ${phrase.slice(0, 40)}?`;
    if (!usedTexts.has(q2.toLowerCase())) return q2;
  }
  return null;
}

export function addStudentTurn(
  state: ConversationState,
  text: string,
  score: number,
): ConversationState {
  const turn: ConversationTurn = {
    role: "student",
    text,
    score,
    at: new Date().toISOString(),
  };
  const newPhrases = extractMemoryPhrases(text);
  return {
    ...state,
    turns: [...state.turns, turn],
    memoryPhrases: [...new Set([...state.memoryPhrases, ...newPhrases])].slice(0, 10),
  };
}

export function addExaminerTurn(
  state: ConversationState,
  text: string,
  category: ConversationTurn["category"],
): ConversationState {
  const turn: ConversationTurn = {
    role: "examiner",
    text,
    category,
    at: new Date().toISOString(),
  };
  const usedCategories = category
    ? [...state.usedCategories, category]
    : state.usedCategories;
  return {
    ...state,
    turns: [...state.turns, turn],
    followUpCount: state.followUpCount + 1,
    usedCategories,
    recoveryCount:
      category === "recovery" ? state.recoveryCount + 1 : state.recoveryCount,
  };
}
