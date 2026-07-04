import type { EvaluateType } from "@/lib/evaluate/types";
import type { FlightInstructorReport } from "@/lib/flightInstructor/types";
import { loadCaptainDeltaMemory, saveCaptainDeltaMemory } from "@/lib/captainDelta/memory/store";
import type { ConfidenceLevel, QuestionMemoryEntry } from "@/lib/captainDelta/memory/types";
import { todayKey } from "@/lib/studyTime";
import { loadProfile } from "@/lib/profile";

function questionId(type: EvaluateType, cardNum?: string, situationId?: string): string {
  if (cardNum) return `part1-${cardNum}`;
  if (situationId) return `${type}-${situationId}`;
  return type;
}

function confidenceScore(level: ConfidenceLevel): number {
  if (level === "very_confident") return 100;
  if (level === "confident") return 70;
  return 35;
}

function avgConfidence(entries: { level: ConfidenceLevel }[]): number | null {
  if (!entries.length) return null;
  return Math.round(
    entries.reduce((s, e) => s + confidenceScore(e.level), 0) / entries.length,
  );
}

function reviewDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function recordCaptainDeltaSession(input: {
  type: EvaluateType;
  cardNum?: string;
  situationId?: string;
  question: string;
  label: string;
  transcript: string;
  overallScore: number;
  icaoLevel: number;
  durationSeconds?: number;
  report: FlightInstructorReport;
  confidence?: ConfidenceLevel;
}): void {
  const store = loadCaptainDeltaMemory();
  const qid = questionId(input.type, input.cardNum, input.situationId);
  const date = todayKey();
  const prev = store.questionHistory[qid];

  const qConfidence = input.confidence
    ? [...store.confidenceLog, { questionId: qid, level: input.confidence, at: new Date().toISOString() }]
    : store.confidenceLog;

  const qConfForQuestion = qConfidence.filter((c) => c.questionId === qid);
  const mastered = input.overallScore >= 75 && input.icaoLevel >= 4;

  const entry: QuestionMemoryEntry = {
    questionId: qid,
    label: input.label,
    timesPracticed: (prev?.timesPracticed ?? 0) + 1,
    timesMastered: (prev?.timesMastered ?? 0) + (mastered ? 1 : 0),
    averageScore: prev
      ? Math.round(
          (prev.averageScore * prev.timesPracticed + input.overallScore) /
            (prev.timesPracticed + 1),
        )
      : input.overallScore,
    averageSeconds:
      input.durationSeconds != null
        ? prev?.averageSeconds != null
          ? Math.round(
              (prev.averageSeconds * prev.timesPracticed + input.durationSeconds) /
                (prev.timesPracticed + 1),
            )
          : input.durationSeconds
        : prev?.averageSeconds ?? null,
    naturalness: input.report.naturalnessReview.level,
    confidenceAvg: avgConfidence(qConfForQuestion),
    lastConfidence: input.confidence ?? prev?.lastConfidence ?? null,
    lastAt: new Date().toISOString(),
    nextReviewAt: mastered ? reviewDate(3) : reviewDate(1),
    weakAreas: input.report.pilotVocabulary.nextToLearn.slice(0, 4),
  };

  let connectorUsage = { ...store.connectorUsage };
  for (const expr of input.report.mission.expressions) {
    const lower = expr.toLowerCase();
    if (/first of all|additionally|for example|finally|however|therefore/.test(lower)) {
      const match = lower.match(
        /first of all|additionally|for example|finally|however|therefore/,
      )?.[0];
      if (match) connectorUsage = { ...connectorUsage, [match]: (connectorUsage[match] ?? 0) + 1 };
    }
  }

  let vocabularyRepeats = { ...store.vocabularyRepeats };
  for (const w of input.report.pilotVocabulary.nextToLearn) {
    vocabularyRepeats = { ...vocabularyRepeats, [w.toLowerCase()]: (vocabularyRepeats[w.toLowerCase()] ?? 0) + 1 };
  }

  let grammarMistakes = { ...store.grammarMistakes };
  for (const s of input.report.naturalnessReview.suggestions) {
    grammarMistakes = {
      ...grammarMistakes,
      [s.studentPhrase.slice(0, 60).toLowerCase()]:
        (grammarMistakes[s.studentPhrase.slice(0, 60).toLowerCase()] ?? 0) + 1,
    };
  }

  const profile = loadProfile();
  const aircraftMention = profile.aircraft.toLowerCase();
  let aviationStories = store.aviationStories;
  if (
    input.transcript.toLowerCase().includes(aircraftMention) ||
    input.transcript.toLowerCase().includes("flew") ||
    input.transcript.toLowerCase().includes("flight")
  ) {
    aviationStories = [
      ...aviationStories,
      {
        id: `${Date.now()}`,
        text: input.transcript.slice(0, 200),
        aircraft: profile.aircraft,
        at: new Date().toISOString(),
      },
    ];
  }

  let bestAnswers = store.bestAnswers;
  const bestPrev = bestAnswers.find((b) => b.questionId === qid);
  if (!bestPrev || input.overallScore > bestPrev.score) {
    bestAnswers = [
      ...bestAnswers.filter((b) => b.questionId !== qid),
      { questionId: qid, label: input.label, score: input.overallScore, at: new Date().toISOString() },
    ];
  }

  const estimatedIcaoHistory = [
    ...store.estimatedIcaoHistory.filter((h) => h.date !== date),
    { date, level: input.icaoLevel },
  ];

  saveCaptainDeltaMemory({
    ...store,
    questionHistory: { ...store.questionHistory, [qid]: entry },
    confidenceLog: qConfidence,
    connectorUsage,
    vocabularyRepeats,
    grammarMistakes,
    aviationStories,
    bestAnswers,
    estimatedIcaoHistory,
    sessionDates: [...store.sessionDates, date],
    learningStyle: {
      ...store.learningStyle,
      speaking: store.learningStyle.speaking + 1,
    },
  });
}

export function recordConfidence(questionId: string, level: ConfidenceLevel): void {
  const store = loadCaptainDeltaMemory();
  const log = [
    ...store.confidenceLog,
    { questionId, level, at: new Date().toISOString() },
  ];
  const prev = store.questionHistory[questionId];
  const qConf = log.filter((c) => c.questionId === questionId);
  saveCaptainDeltaMemory({
    ...store,
    confidenceLog: log,
    questionHistory: prev
      ? {
          ...store.questionHistory,
          [questionId]: {
            ...prev,
            lastConfidence: level,
            confidenceAvg: avgConfidence(qConf),
          },
        }
      : store.questionHistory,
  });
}

export function bumpActivityStyle(
  activity: "shadowing" | "listening" | "pictures" | "keywords",
): void {
  const store = loadCaptainDeltaMemory();
  saveCaptainDeltaMemory({
    ...store,
    learningStyle: {
      ...store.learningStyle,
      [activity]: store.learningStyle[activity] + 1,
    },
    preferredMode: activity,
  });
}
