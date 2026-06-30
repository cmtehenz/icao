import {
  loadVault,
  pickWarmupWords,
  VAULT_PASS_SCORE,
  type VaultWord,
} from "@/lib/pronunciationVault";
import { todayKey } from "@/lib/studyTime";

const WARMUP_OK_KEY = "icao_part2_warmup_ok_v1";
const LAST_PART2_SCORE_KEY = "icao_part2_last_score_v1";

export const PART2_WARMUP_CHANGE_EVENT = "icao-part2-warmup-change";

const LOW_PART2_SCORE = 50;

function notify(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(PART2_WARMUP_CHANGE_EVENT));
}

export function markWarmupSatisfied(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(WARMUP_OK_KEY, todayKey());
  notify();
}

export function clearWarmupSatisfied(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(WARMUP_OK_KEY);
  notify();
}

export function isWarmupSatisfiedToday(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(WARMUP_OK_KEY) === todayKey();
}

export function recordPart2RecordingScore(accuracy: number): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(LAST_PART2_SCORE_KEY, String(accuracy));
  if (accuracy < LOW_PART2_SCORE) {
    clearWarmupSatisfied();
  }
}

function lastPart2Score(): number | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(LAST_PART2_SCORE_KEY);
  if (raw == null) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export function warmupWords(limit = 3): VaultWord[] {
  return pickWarmupWords(loadVault(), limit);
}

export function isPart2WarmupRequired(): boolean {
  const words = warmupWords(1);
  if (!words.length) return false;
  if (isWarmupSatisfiedToday()) return false;
  return true;
}

export function canUsePart2Coach(): boolean {
  return !isPart2WarmupRequired();
}

export function part2WarmupMessage(): string {
  const words = warmupWords(3);
  const last = lastPart2Score();
  if (last != null && last < LOW_PART2_SCORE) {
    return `Última gravação ${last}% — treine pronúncia antes de gravar de novo.`;
  }
  if (!words.length) return "";
  return `Treine ao menos uma palavra (≥${VAULT_PASS_SCORE}%) antes de gravar no Part 2.`;
}
