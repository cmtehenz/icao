import type { CaptainDeltaMemoryStore, WordJourneyEntry } from "@/lib/captainDelta/memory/types";
import { loadCaptainDeltaMemory, saveCaptainDeltaMemory } from "@/lib/captainDelta/memory/store";
import { todayKey } from "@/lib/studyTime";

function wordKey(word: string): string {
  return word.trim().toLowerCase();
}

export function getWordJourney(
  word: string,
  store?: CaptainDeltaMemoryStore,
): WordJourneyEntry | null {
  const s = store ?? loadCaptainDeltaMemory();
  return s.wordJourney?.[wordKey(word)] ?? null;
}

export function recordWordMentorOutcome(
  word: string,
  outcome: "success" | "struggle",
  focus?: string,
  store?: CaptainDeltaMemoryStore,
): CaptainDeltaMemoryStore {
  const base = store ?? loadCaptainDeltaMemory();
  const key = wordKey(word);
  const today = todayKey();
  const prev = base.wordJourney?.[key];
  const journey: WordJourneyEntry =
    outcome === "success"
      ? {
          lastStruggledDate: prev?.lastStruggledDate,
          lastSuccessDate: today,
          struggleCount: prev?.struggleCount ?? 0,
          lastFocus: focus ?? prev?.lastFocus,
        }
      : {
          lastStruggledDate: today,
          lastSuccessDate: prev?.lastSuccessDate,
          struggleCount: (prev?.struggleCount ?? 0) + 1,
          lastFocus: focus ?? prev?.lastFocus,
        };

  const next: CaptainDeltaMemoryStore = {
    ...base,
    wordJourney: { ...base.wordJourney, [key]: journey },
  };

  if (!store) saveCaptainDeltaMemory(next);
  return next;
}

export function wordImprovedSinceYesterday(
  word: string,
  store?: CaptainDeltaMemoryStore,
): boolean {
  const journey = getWordJourney(word, store);
  if (!journey?.lastSuccessDate || !journey.lastStruggledDate) return false;
  const yesterday = offsetDate(todayKey(), -1);
  return (
    journey.lastStruggledDate <= yesterday &&
    journey.lastSuccessDate >= todayKey()
  );
}

export function wordStruggledYesterday(
  word: string,
  store?: CaptainDeltaMemoryStore,
): boolean {
  const journey = getWordJourney(word, store);
  if (!journey?.lastStruggledDate) return false;
  const yesterday = offsetDate(todayKey(), -1);
  return journey.lastStruggledDate === yesterday || journey.lastStruggledDate < yesterday;
}

function offsetDate(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T12:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function progressRecognitionLine(
  word: string,
  succeeded: boolean,
  store?: CaptainDeltaMemoryStore,
): string | null {
  const key = wordKey(word);
  const journey = getWordJourney(word, store);
  if (!succeeded || !journey) return null;

  const q = `"${word.trim()}"`;
  if (wordImprovedSinceYesterday(word, store)) {
    return `Excellent. Yesterday ${q} was difficult. Today it sounded much more natural.`;
  }
  if (journey.struggleCount >= 0 && journey.lastSuccessDate === todayKey() && journey.struggleCount >= 2) {
    return `You corrected yesterday's mistake on ${q} — that's real progress.`;
  }
  if (journey.lastStruggledDate && journey.lastSuccessDate === todayKey()) {
    return `Nice turnaround on ${q} — you fixed what tripped you up earlier.`;
  }
  return null;
}
