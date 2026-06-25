import type { VaultWord } from "@/lib/pronunciationVault";
import { normalizeVaultCount, sanitizeVaultWord, vaultCountLooksCorrupt } from "@/lib/pronunciationVault";

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
  const map = new Map<string, VaultWord>();

  for (const item of [...remote, ...local].map(sanitizeVaultWord)) {
    const key = item.word.toLowerCase();
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
  return {
    userId,
    word: word.word.toLowerCase(),
    lowestAccuracy: word.lowestAccuracy,
    lastAccuracy: word.lastAccuracy,
    errorType: word.errorType,
    errorLabel: word.errorLabel,
    context: word.context,
    timesSeen: word.timesSeen,
    practiceCount: word.practiceCount,
    lastSeenAt: new Date(word.lastSeenAt),
    lastPracticedAt: word.lastPracticedAt ? new Date(word.lastPracticedAt) : null,
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
    lastSeenAt: row.lastSeenAt.toISOString(),
    lastPracticedAt: row.lastPracticedAt?.toISOString(),
  });
}
