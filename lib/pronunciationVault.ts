import { errorTypeLabel } from "@/lib/azure/pronunciation";

export type VaultWord = {
  word: string;
  lowestAccuracy: number;
  lastAccuracy: number;
  errorType: string;
  errorLabel: string;
  context: string;
  timesSeen: number;
  practiceCount: number;
  lastSeenAt: string;
  lastPracticedAt?: string;
};

const STORAGE_KEY = "icao_pronunciation_vault_v1";

export function loadVault(): VaultWord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as VaultWord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveVault(words: VaultWord[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
  notifyVaultChange();
}

export const VAULT_CHANGE_EVENT = "icao-pronunciation-vault-change";

function notifyVaultChange(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(VAULT_CHANGE_EVENT));
}

export type WordToSave = {
  word: string;
  accuracyScore: number;
  errorType: string;
  errorLabel: string;
};

export function addWordsToVault(
  incoming: WordToSave[],
  context: string,
): { added: number; updated: number; total: number } {
  if (!incoming.length) return { added: 0, updated: 0, total: loadVault().length };

  const vault = loadVault();
  const map = new Map(vault.map((w) => [w.word.toLowerCase(), w]));
  let added = 0;
  let updated = 0;
  const now = new Date().toISOString();

  for (const item of incoming) {
    const key = item.word.toLowerCase();
    const existing = map.get(key);
    if (existing) {
      existing.timesSeen += 1;
      existing.lastSeenAt = now;
      existing.lastAccuracy = item.accuracyScore;
      existing.lowestAccuracy = Math.min(existing.lowestAccuracy, item.accuracyScore);
      existing.errorType = item.errorType;
      existing.errorLabel = item.errorLabel || errorTypeLabel(item.errorType);
      if (context) existing.context = context;
      updated += 1;
    } else {
      map.set(key, {
        word: item.word,
        lowestAccuracy: item.accuracyScore,
        lastAccuracy: item.accuracyScore,
        errorType: item.errorType,
        errorLabel: item.errorLabel || errorTypeLabel(item.errorType),
        context,
        timesSeen: 1,
        practiceCount: 0,
        lastSeenAt: now,
      });
      added += 1;
    }
  }

  const next = [...map.values()].sort((a, b) => a.lowestAccuracy - b.lowestAccuracy);
  saveVault(next);
  return { added, updated, total: next.length };
}

export function removeVaultWord(word: string): void {
  const key = word.toLowerCase();
  saveVault(loadVault().filter((w) => w.word.toLowerCase() !== key));
}

export function recordWordPractice(word: string, accuracy: number): void {
  const key = word.toLowerCase();
  const vault = loadVault();
  const item = vault.find((w) => w.word.toLowerCase() === key);
  if (!item) return;
  item.practiceCount += 1;
  item.lastPracticedAt = new Date().toISOString();
  item.lastAccuracy = accuracy;
  if (accuracy >= 85) {
    saveVault(vault.filter((w) => w.word.toLowerCase() !== key));
    return;
  }
  item.lowestAccuracy = Math.min(item.lowestAccuracy, accuracy);
  saveVault(vault);
}

export function clearVault(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  notifyVaultChange();
}

export function vaultStats(words: VaultWord[]) {
  return {
    total: words.length,
    critical: words.filter((w) => w.lowestAccuracy < 60).length,
    needsPractice: words.filter((w) => w.lowestAccuracy < 80).length,
  };
}
