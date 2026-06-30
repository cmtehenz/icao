import { errorTypeLabel } from "@/lib/azure/pronunciation";
import { shouldSkipPronunciationVaultWord } from "@/lib/aviationSpeechTerms";

export type VaultWord = {
  word: string;
  lowestAccuracy: number;
  lastAccuracy: number;
  errorType: string;
  errorLabel: string;
  context: string;
  timesSeen: number;
  practiceCount: number;
  /** Approved practices with accuracy above VAULT_PASS_SCORE */
  passCount: number;
  /** How often the word came back to training (failed practice or re-added after graduation). */
  returnCount: number;
  lastSeenAt: string;
  lastPracticedAt?: string;
};

const STORAGE_KEY = "icao_pronunciation_vault_v1";
const REMOVED_STORAGE_KEY = "icao_vault_removed_v1";
const VAULT_COUNT_RESET_KEY = "icao_vault_counts_reset_v2";
const MAX_VAULT_COUNT = 99;
const CORRUPT_COUNT_THRESHOLD = 10;

export const VAULT_PASS_SCORE = 80;
export const VAULT_PASSES_TO_GRADUATE = 5;

/** Evita concatenação de strings e valores inflados por sync duplicado. */
export function normalizeVaultCount(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.min(Math.max(0, Math.floor(value)), MAX_VAULT_COUNT);
  }
  if (typeof value === "string" && value.trim()) {
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed)) {
      return Math.min(Math.max(0, parsed), MAX_VAULT_COUNT);
    }
  }
  return Math.min(Math.max(0, fallback), MAX_VAULT_COUNT);
}

export function vaultCountLooksCorrupt(value: unknown): boolean {
  const raw =
    typeof value === "string" && value.trim() ? Number.parseInt(value, 10) : Number(value);
  return !Number.isFinite(raw) || raw > CORRUPT_COUNT_THRESHOLD || raw < 0;
}

function normalizeTimesSeen(value: unknown): number {
  if (vaultCountLooksCorrupt(value)) return 1;
  return normalizeVaultCount(value, 1) || 1;
}

function normalizePracticeCount(value: unknown): number {
  if (vaultCountLooksCorrupt(value)) return 1;
  const n = normalizeVaultCount(value, 0);
  return n === 0 ? 0 : n;
}

export function resetVaultWordCounts(word: VaultWord): VaultWord {
  return {
    ...sanitizeVaultWord(word),
    timesSeen: 1,
    practiceCount: 1,
  };
}

export function sanitizeVaultWord(word: VaultWord): VaultWord {
  return {
    ...word,
    lowestAccuracy: normalizeVaultCount(word.lowestAccuracy, 0),
    lastAccuracy: normalizeVaultCount(word.lastAccuracy, 0),
    timesSeen: normalizeTimesSeen(word.timesSeen),
    practiceCount: normalizePracticeCount(word.practiceCount),
    passCount: normalizeVaultCount(word.passCount, 0),
    returnCount: normalizeVaultCount(word.returnCount, 0),
  };
}

export function loadVault(): VaultWord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as VaultWord[];
    if (!Array.isArray(parsed)) return [];

    let words = parsed.map(sanitizeVaultWord).filter((w) => !shouldSkipPronunciationVaultWord(w.word));
    if (words.length !== parsed.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
      notifyVaultChange();
    }
    if (!localStorage.getItem(VAULT_COUNT_RESET_KEY)) {
      words = words.map(resetVaultWordCounts);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
      localStorage.setItem(VAULT_COUNT_RESET_KEY, "1");
      notifyVaultChange();
    }
    return words;
  } catch {
    return [];
  }
}

export function saveVault(words: VaultWord[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(words.map(sanitizeVaultWord)));
  notifyVaultChange();
}

export const VAULT_CHANGE_EVENT = "icao-pronunciation-vault-change";

function notifyVaultChange(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(VAULT_CHANGE_EVENT));
}

export function loadRemovedVaultKeys(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(REMOVED_STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as string[];
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.map((k) => k.toLowerCase()));
  } catch {
    return new Set();
  }
}

function saveRemovedVaultKeys(keys: Set<string>): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(REMOVED_STORAGE_KEY, JSON.stringify([...keys]));
}

export function markVaultWordRemoved(word: string): void {
  const keys = loadRemovedVaultKeys();
  keys.add(word.toLowerCase());
  saveRemovedVaultKeys(keys);
}

export function clearVaultWordRemoved(word: string): void {
  const keys = loadRemovedVaultKeys();
  keys.delete(word.toLowerCase());
  saveRemovedVaultKeys(keys);
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
    if (shouldSkipPronunciationVaultWord(item.word)) continue;
    const key = item.word.toLowerCase();
    const wasRemoved = loadRemovedVaultKeys().has(key);
    clearVaultWordRemoved(key);
    const existing = map.get(key);
    if (existing) {
      existing.timesSeen = normalizeVaultCount(existing.timesSeen, 1) + 1;
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
        passCount: 0,
        returnCount: wasRemoved ? 1 : 0,
        lastSeenAt: now,
      });
      added += 1;
    }
  }

  const next = [...map.values()].sort((a, b) => a.lowestAccuracy - b.lowestAccuracy);
  saveVault(next);
  return { added, updated, total: next.length };
}

const MANUAL_VAULT_CONTEXT = "Adicionada manualmente";

/** Parse one or more words from a text field (comma, semicolon, or newline separated). */
export function parseManualVaultInput(input: string): string[] {
  const parts = input.split(/[,;\n]+/).map((s) => s.trim()).filter(Boolean);
  const seen = new Set<string>();
  const result: string[] = [];

  for (const part of parts) {
    const key = part.toLowerCase();
    if (key.length < 2 || key.length > 60) continue;
    if (!/[a-z]/i.test(part)) continue;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(part);
  }

  return result;
}

export function addManualWordsToVault(
  input: string,
  context = MANUAL_VAULT_CONTEXT,
): { added: number; updated: number; skipped: number; total: number } {
  const words = parseManualVaultInput(input);
  if (!words.length) {
    return { added: 0, updated: 0, skipped: 0, total: loadVault().length };
  }

  const { added, updated, total } = addWordsToVault(
    words.map((word) => ({
      word,
      accuracyScore: 0,
      errorType: "Manual",
      errorLabel: "adicionada manualmente",
    })),
    context.trim() || MANUAL_VAULT_CONTEXT,
  );

  return { added, updated, skipped: 0, total };
}

export function removeVaultWord(word: string): void {
  const key = word.toLowerCase();
  markVaultWordRemoved(key);
  saveVault(loadVault().filter((w) => w.word.toLowerCase() !== key));
}

export type VaultPracticeResult = {
  removed: boolean;
  passCount: number;
};

export function recordWordPractice(word: string, accuracy: number): VaultPracticeResult {
  const key = word.toLowerCase();
  const vault = loadVault();
  const item = vault.find((w) => w.word.toLowerCase() === key);
  if (!item) return { removed: false, passCount: 0 };

  item.practiceCount = normalizeVaultCount(item.practiceCount, 0) + 1;
  item.lastPracticedAt = new Date().toISOString();
  item.lastAccuracy = accuracy;

  if (accuracy >= VAULT_PASS_SCORE) {
    item.passCount = normalizeVaultCount(item.passCount, 0) + 1;
    if (item.passCount >= VAULT_PASSES_TO_GRADUATE) {
      markVaultWordRemoved(key);
      saveVault(vault.filter((w) => w.word.toLowerCase() !== key));
      return { removed: true, passCount: item.passCount };
    }
    saveVault(vault);
    return { removed: false, passCount: item.passCount };
  }

  item.lowestAccuracy = Math.min(item.lowestAccuracy, accuracy);
  item.returnCount = normalizeVaultCount(item.returnCount, 0) + 1;
  saveVault(vault);
  return { removed: false, passCount: item.passCount };
}

export function clearVault(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(REMOVED_STORAGE_KEY);
  notifyVaultChange();
}

export function vaultStats(words: VaultWord[]) {
  return {
    total: words.length,
    critical: words.filter((w) => w.lowestAccuracy < 60).length,
    needsPractice: words.filter((w) => w.lowestAccuracy < 80).length,
  };
}

/** Palavras críticas para warm-up antes de gravar no Part 2. */
export function pickWarmupWords(words: VaultWord[] = loadVault(), limit = 3): VaultWord[] {
  const ranked = [...words].sort((a, b) => {
    const aWeight = a.returnCount * 10 + (100 - a.lastAccuracy);
    const bWeight = b.returnCount * 10 + (100 - b.lastAccuracy);
    return bWeight - aWeight;
  });
  return ranked.slice(0, limit);
}
