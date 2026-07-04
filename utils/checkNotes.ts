import type { RecommendedNotes } from "@/lib/exams/types";
import {
  extractNoteTokens,
  normalizeNoteToken,
  studentNotesContainCode,
  variantsForCode,
} from "./noteNormalization";
import { idealLabelForCode, resolveNotesScope, type NotesComparisonScope } from "./notesScope";

export type { RecommendedNotes } from "@/lib/exams/types";
export type { NotesComparisonScope } from "./notesScope";

export type NoteScore = "Excellent" | "Good" | "Needs Review";

export type NoteCheckResult = {
  score: NoteScore;
  matchedCodes: string[];
  missingCodes: string[];
  extraNotes: string[];
  feedback: string[];
  scope: NotesComparisonScope;
};

function isExtraToken(token: string, knownCodes: string[]): boolean {
  const normToken = normalizeNoteToken(token);
  if (!normToken || normToken.length < 2) return false;

  for (const code of knownCodes) {
    for (const variant of variantsForCode(code)) {
      const normCode = normalizeNoteToken(variant);
      if (normToken === normCode) return false;
      if (normToken.includes(normCode) || normCode.includes(normToken)) return false;
    }
  }
  return true;
}

function buildScore(matched: number, total: number): NoteScore {
  if (total === 0) return "Excellent";
  if (matched === total) return "Excellent";
  if (matched >= Math.ceil(total * 0.7) || (total >= 2 && matched >= total - 1)) return "Good";
  return "Needs Review";
}

function buildFeedback(missing: string[], extra: string[], score: NoteScore): string[] {
  const feedback: string[] = [];

  if (score === "Excellent") {
    feedback.push("You captured all essential codes for this scenario.");
  } else if (score === "Good") {
    feedback.push("Good note-taking — review the missing items below.");
  } else {
    feedback.push("Focus on capturing altitude, heading, problem, and intention codes faster.");
  }

  for (const code of missing) {
    feedback.push(`Missing: ${code}`);
  }
  for (const note of extra.slice(0, 5)) {
    feedback.push(`Extra / unnecessary: ${note}`);
  }

  return feedback;
}

export function checkStudentNotes(
  studentNotes: string,
  recommendedNotes: RecommendedNotes,
  scope: NotesComparisonScope = "full",
): NoteCheckResult {
  const active = resolveNotesScope(recommendedNotes, scope);
  const { requiredCodes, optionalCodes = [], idealNotes } = active;
  const knownCodes = [...requiredCodes, ...optionalCodes, ...idealNotes, ...recommendedNotes.idealNotes];

  const matchedCodes = requiredCodes
    .filter((code) => studentNotesContainCode(studentNotes, code))
    .map((code) => idealLabelForCode(code, idealNotes));

  const missingCodes = requiredCodes
    .filter((code) => !studentNotesContainCode(studentNotes, code))
    .map((code) => idealLabelForCode(code, idealNotes));

  const extraNotes = extractNoteTokens(studentNotes).filter((token) =>
    isExtraToken(token, knownCodes),
  );

  const score = buildScore(
    requiredCodes.filter((code) => studentNotesContainCode(studentNotes, code)).length,
    requiredCodes.length,
  );
  const feedback = buildFeedback(missingCodes, extraNotes, score);

  return {
    score,
    matchedCodes,
    missingCodes,
    extraNotes,
    feedback,
    scope,
  };
}
