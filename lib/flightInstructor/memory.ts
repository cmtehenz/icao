import type { EvaluateType } from "@/lib/evaluate/types";
import type {
  FlightInstructorReport,
  InstructorMemoryStore,
  InstructorSessionRecord,
  NaturalnessLevel,
} from "@/lib/flightInstructor/types";
import { todayKey } from "@/lib/studyTime";

const STORAGE_KEY = "icao_flight_instructor_memory_v1";
export const INSTRUCTOR_MEMORY_EVENT = "icao-flight-instructor-memory-change";

const MAX_SESSIONS = 120;

function notify(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(INSTRUCTOR_MEMORY_EVENT));
}

export function loadInstructorMemory(): InstructorMemoryStore {
  if (typeof window === "undefined") {
    return emptyMemory();
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyMemory();
    return { ...emptyMemory(), ...(JSON.parse(raw) as InstructorMemoryStore) };
  } catch {
    return emptyMemory();
  }
}

function emptyMemory(): InstructorMemoryStore {
  return {
    sessions: [],
    pronunciationMistakes: {},
    grammarPatterns: {},
    forgottenWords: {},
    difficultQuestionIds: {},
  };
}

function saveMemory(store: InstructorMemoryStore): void {
  if (typeof window === "undefined") return;
  const trimmed = {
    ...store,
    sessions: store.sessions.slice(-MAX_SESSIONS),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  notify();
}

function bump(map: Record<string, number>, key: string): Record<string, number> {
  const k = key.trim().toLowerCase();
  if (!k) return map;
  return { ...map, [k]: (map[k] ?? 0) + 1 };
}

function questionId(type: EvaluateType, cardNum?: string, situationId?: string): string {
  if (cardNum) return `part1-${cardNum}`;
  if (situationId) return `${type}-${situationId}`;
  return type;
}

export function recordInstructorSession(input: {
  type: EvaluateType;
  cardNum?: string;
  situationId?: string;
  question: string;
  transcript: string;
  overallScore: number;
  icaoLevel: number;
  report: FlightInstructorReport;
}): void {
  const store = loadInstructorMemory();
  const date = todayKey();
  const weakAreas = [
    ...input.report.pilotVocabulary.missingExpressions,
    ...input.report.naturalnessReview.suggestions.map((s) => s.studentPhrase),
  ].slice(0, 6);

  const session: InstructorSessionRecord = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    date,
    at: new Date().toISOString(),
    type: input.type,
    cardNum: input.cardNum,
    situationId: input.situationId,
    question: input.question.slice(0, 120),
    transcript: input.transcript.slice(0, 500),
    overallScore: input.overallScore,
    icaoLevel: input.icaoLevel,
    naturalnessLevel: input.report.naturalnessReview.level,
    weakAreas,
  };

  let pronunciationMistakes = { ...store.pronunciationMistakes };
  for (const expr of input.report.pilotVocabulary.missingExpressions) {
    pronunciationMistakes = bump(pronunciationMistakes, expr);
  }

  let grammarPatterns = { ...store.grammarPatterns };
  for (const item of input.report.improvedAnswer.whatChanged) {
    if (/grammar|tense|structure|connector/i.test(item.change)) {
      grammarPatterns = bump(grammarPatterns, item.change.slice(0, 80));
    }
  }

  const qid = questionId(input.type, input.cardNum, input.situationId);
  const difficultQuestionIds =
    input.overallScore < 60
      ? bump(store.difficultQuestionIds, qid)
      : store.difficultQuestionIds;

  saveMemory({
    ...store,
    sessions: [...store.sessions, session],
    pronunciationMistakes,
    grammarPatterns,
    difficultQuestionIds,
  });
}

export function buildMemoryContextForPrompt(): {
  recentSessions: InstructorSessionRecord[];
  topPronunciationMistakes: string[];
  recurringWeakAreas: string[];
  yesterdaySummary: string | null;
} {
  const store = loadInstructorMemory();
  const today = todayKey();
  const yesterday = new Date(`${today}T12:00:00`);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().slice(0, 10);

  const recentSessions = store.sessions.slice(-8);
  const yesterdaySessions = store.sessions.filter((s) => s.date === yesterdayKey);

  const topPronunciationMistakes = Object.entries(store.pronunciationMistakes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word]) => word);

  const areaCounts = new Map<string, number>();
  for (const s of store.sessions.slice(-20)) {
    for (const area of s.weakAreas) {
      areaCounts.set(area, (areaCounts.get(area) ?? 0) + 1);
    }
  }
  const recurringWeakAreas = [...areaCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([area]) => area);

  let yesterdaySummary: string | null = null;
  if (yesterdaySessions.length) {
    const avg = Math.round(
      yesterdaySessions.reduce((sum, s) => sum + s.overallScore, 0) / yesterdaySessions.length,
    );
    const weak = [...new Set(yesterdaySessions.flatMap((s) => s.weakAreas))].slice(0, 4);
    yesterdaySummary = `Yesterday (${yesterdayKey}): ${yesterdaySessions.length} coach session(s), avg ${avg}%. Weak areas: ${weak.join(", ") || "none noted"}.`;
  }

  return {
    recentSessions,
    topPronunciationMistakes,
    recurringWeakAreas,
    yesterdaySummary,
  };
}

export function sessionsForDate(date = todayKey()): InstructorSessionRecord[] {
  return loadInstructorMemory().sessions.filter((s) => s.date === date);
}
