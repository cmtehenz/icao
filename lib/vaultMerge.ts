import type { VaultWord } from "@/lib/pronunciationVault";
import { shouldSkipPronunciationVaultWord } from "@/lib/aviationSpeechTerms";
import {
  loadRemovedVaultKeys,
  normalizeVaultCount,
  sanitizeVaultWord,
  vaultCountLooksCorrupt,
} from "@/lib/pronunciationVault";

function safeDate(value: string | undefined, fallback = new Date()): Date {
  if (!value) return fallback;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? fallback : d;
}

function normalizeVaultWordKey(word: string): string {
  return word.trim().toLowerCase().replace(/\s+/g, " ").slice(0, 120);
}

function pickLatest(a: string, b: string): string {
  return new Date(a) >= new Date(b) ? a : b;
}

function mergeCount(a: unknown, b: unknown, fallback = 0): number {
  const leftCorrupt = vaultCountLooksCorrupt(a);
  const rightCorrupt = vaultCountLooksCorrupt(b);
  const left = normalizeVaultCount(a, fallback);
  const right = normalizeVaultCount(b, fallback);

  if (leftCorrupt && rightCorrupt) return fallback || 1;
  if (leftCorrupt) return right;
  if (rightCorrupt) return left;
  return Math.max(left, right);
}

export function mergeVaultWords(local: VaultWord[], remote: VaultWord[]): VaultWord[] {
  const removed = loadRemovedVaultKeys();
  const map = new Map<string, VaultWord>();

  for (const item of [...remote, ...local].map(sanitizeVaultWord)) {
    if (shouldSkipPronunciationVaultWord(item.word)) continue;
    const key = item.word.toLowerCase();
    if (removed.has(key)) continue;
    const existing = map.get(key);
    if (!existing) {
      map.set(key, { ...item });
      continue;
    }

    map.set(key, sanitizeVaultWord({
      word: existing.word || item.word,
      lowestAccuracy: Math.min(existing.lowestAccuracy, item.lowestAccuracy),
      lastAccuracy:
        new Date(existing.lastSeenAt) >= new Date(item.lastSeenAt)
          ? existing.lastAccuracy
          : item.lastAccuracy,
      errorType:
        new Date(existing.lastSeenAt) >= new Date(item.lastSeenAt)
          ? existing.errorType
          : item.errorType,
      errorLabel:
        new Date(existing.lastSeenAt) >= new Date(item.lastSeenAt)
          ? existing.errorLabel
          : item.errorLabel,
      context:
        new Date(existing.lastSeenAt) >= new Date(item.lastSeenAt)
          ? existing.context || item.context
          : item.context || existing.context,
      timesSeen: mergeCount(existing.timesSeen, item.timesSeen, 1),
      practiceCount: mergeCount(existing.practiceCount, item.practiceCount, 0),
      passCount: mergeCount(existing.passCount, item.passCount, 0),
      returnCount: mergeCount(existing.returnCount, item.returnCount, 0),
      lastSeenAt: pickLatest(existing.lastSeenAt, item.lastSeenAt),
      lastPracticedAt:
        existing.lastPracticedAt && item.lastPracticedAt
          ? pickLatest(existing.lastPracticedAt, item.lastPracticedAt)
          : existing.lastPracticedAt ?? item.lastPracticedAt,
    }));
  }

  return [...map.values()].sort((a, b) => a.lowestAccuracy - b.lowestAccuracy);
}

export function vaultWordToDb(word: VaultWord, userId: string) {
  const w = sanitizeVaultWord(word);
  const normalizedWord = normalizeVaultWordKey(w.word);
  if (normalizedWord.length < 2) {
    throw new Error(`Invalid vault word: "${w.word}"`);
  }

  return {
    userId,
    word: normalizedWord,
    lowestAccuracy: w.lowestAccuracy,
    lastAccuracy: w.lastAccuracy,
    errorType: w.errorType || "Manual",
    errorLabel: w.errorLabel || "adicionada manualmente",
    context: (w.context || "").slice(0, 500),
    timesSeen: w.timesSeen,
    practiceCount: w.practiceCount,
    passCount: w.passCount,
    lastSeenAt: safeDate(w.lastSeenAt),
    lastPracticedAt: w.lastPracticedAt ? safeDate(w.lastPracticedAt) : null,
  };
}

export function dbWordToVault(row: {
  word: string;
  lowestAccuracy: number;
  lastAccuracy: number;
  errorType: string;
  errorLabel: string;
  context: string;
  timesSeen: number;
  practiceCount: number;
  passCount: number;
  lastSeenAt: Date;
  lastPracticedAt: Date | null;
}): VaultWord {
  return sanitizeVaultWord({
    word: row.word,
    lowestAccuracy: row.lowestAccuracy,
    lastAccuracy: row.lastAccuracy,
    errorType: row.errorType,
    errorLabel: row.errorLabel,
    context: row.context,
    timesSeen: row.timesSeen,
    practiceCount: row.practiceCount,
    passCount: row.passCount,
    returnCount: 0,
    lastSeenAt: row.lastSeenAt.toISOString(),
    lastPracticedAt: row.lastPracticedAt?.toISOString(),
  });
}
