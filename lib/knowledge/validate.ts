import {
  APPROVED_SOURCE_IDS,
  VOCABULARY_REQUIRED_FIELDS,
  type VocabularyKnowledgeEntry,
} from "@/knowledge/schema/vocabulary";
import { findForbiddenPhrases } from "@/lib/knowledge/forbiddenPhrases";

export type ValidationIssue = {
  path: string;
  message: string;
};

export type ValidationResult = {
  ok: boolean;
  issues: ValidationIssue[];
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isStringArray(value: unknown, minItems = 0): value is string[] {
  return (
    Array.isArray(value) &&
    value.length >= minItems &&
    value.every((item) => isNonEmptyString(item))
  );
}

export function validateVocabularyEntry(raw: unknown): ValidationResult {
  const issues: ValidationIssue[] = [];

  if (!raw || typeof raw !== "object") {
    return { ok: false, issues: [{ path: "", message: "Entry must be an object" }] };
  }

  const entry = raw as Record<string, unknown>;

  for (const field of VOCABULARY_REQUIRED_FIELDS) {
    if (entry[field] === undefined || entry[field] === null) {
      issues.push({ path: field, message: "Missing required field" });
    }
  }

  if (!isNonEmptyString(entry.id)) issues.push({ path: "id", message: "id must be a non-empty string" });
  if (!isNonEmptyString(entry.term)) issues.push({ path: "term", message: "term must be a non-empty string" });

  const level = entry.level;
  if (typeof level !== "number" || level < 1 || level > 5) {
    issues.push({ path: "level", message: "level must be 1–5" });
  }

  const stringFields = [
    "meaning",
    "simpleMeaning",
    "portugueseMeaning",
    "operationalMeaning",
    "whoUsesIt",
    "whenUsed",
    "whyUsed",
    "lastReviewed",
    "version",
  ] as const;

  for (const field of stringFields) {
    if (!isNonEmptyString(entry[field])) {
      issues.push({ path: field, message: `${field} must be a non-empty string` });
    }
  }

  if (!isStringArray(entry.pilotResponses, 1)) {
    issues.push({ path: "pilotResponses", message: "At least one pilot response required" });
  }
  if (!isStringArray(entry.icaoQuestions, 1)) {
    issues.push({ path: "icaoQuestions", message: "At least one ICAO question required" });
  }

  const examples = entry.realExamples;
  if (!Array.isArray(examples) || examples.length === 0) {
    issues.push({ path: "realExamples", message: "At least one real example required" });
  } else {
    examples.forEach((ex, i) => {
      if (!ex || typeof ex !== "object") {
        issues.push({ path: `realExamples[${i}]`, message: "Example must be an object" });
        return;
      }
      const exObj = ex as Record<string, unknown>;
      if (!isNonEmptyString(exObj.text)) {
        issues.push({ path: `realExamples[${i}].text`, message: "Example text required" });
      }
      if (!isNonEmptyString(exObj.context)) {
        issues.push({ path: `realExamples[${i}].context`, message: "Example context required" });
      }
    });
  }

  const refs = entry.references;
  if (!Array.isArray(refs) || refs.length === 0) {
    issues.push({ path: "references", message: "At least one reference required" });
  } else {
    refs.forEach((ref, i) => {
      if (!ref || typeof ref !== "object") {
        issues.push({ path: `references[${i}]`, message: "Reference must be an object" });
        return;
      }
      const refObj = ref as Record<string, unknown>;
      if (!isNonEmptyString(refObj.title)) {
        issues.push({ path: `references[${i}].title`, message: "Reference title required" });
      }
      if (
        !isNonEmptyString(refObj.source) ||
        !APPROVED_SOURCE_IDS.includes(refObj.source as (typeof APPROVED_SOURCE_IDS)[number])
      ) {
        issues.push({ path: `references[${i}].source`, message: "Reference source must be approved" });
      }
    });
  }

  if (issues.length === 0) {
    const typed = entry as unknown as VocabularyKnowledgeEntry;
    const forbidden = findForbiddenPhrases({
      meaning: typed.meaning,
      simpleMeaning: typed.simpleMeaning,
      operationalMeaning: typed.operationalMeaning,
      captainStory: typed.captainStory,
      pilotResponses: typed.pilotResponses,
      icaoQuestions: typed.icaoQuestions,
      commonMistakes: typed.commonMistakes,
      realExamples: typed.realExamples.map((e) => e.text),
    });
    for (const hit of forbidden) {
      issues.push({
        path: hit.field,
        message: `Forbidden meta phrase in knowledge content: ${hit.text}`,
      });
    }
  }

  return { ok: issues.length === 0, issues };
}

export function assertValidVocabularyEntry(raw: unknown): VocabularyKnowledgeEntry {
  const result = validateVocabularyEntry(raw);
  if (!result.ok) {
    const summary = result.issues.map((i) => `${i.path}: ${i.message}`).join("; ");
    throw new Error(`Invalid vocabulary entry: ${summary}`);
  }
  return raw as VocabularyKnowledgeEntry;
}
