import { sanitizeVaultWord, type VaultWord } from "@/lib/pronunciationVault";
import { normalizeStudyDay, type StudyDaysMap } from "@/lib/studyTimeMerge";

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  }
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`).join(",")}}`;
}

export function hashVaultPayload(words: VaultWord[]): string {
  const normalized = words
    .map(sanitizeVaultWord)
    .sort((a, b) => a.word.localeCompare(b.word, undefined, { sensitivity: "base" }));
  return stableStringify(normalized);
}

export function hashStudyDaysPayload(days: StudyDaysMap): string {
  const normalized: StudyDaysMap = {};
  for (const key of Object.keys(days).sort()) {
    normalized[key] = normalizeStudyDay(days[key]);
  }
  return stableStringify(normalized);
}

export function payloadsEqualByHash(
  previousHash: string | null,
  nextHash: string,
): boolean {
  return previousHash !== null && previousHash === nextHash;
}
