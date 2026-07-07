import type { CaptainDeltaMemoryStore } from "@/lib/captainDelta/memory/types";
import { loadCaptainDeltaMemory, saveCaptainDeltaMemory } from "@/lib/captainDelta/memory/store";
import { todayKey } from "@/lib/studyTime";
import type { CaptainMentorProfile } from "@/lib/captainDelta/infinity/mentorProfile";

export type LessonClosingSummary = {
  todayLine: string;
  tomorrowLine: string;
  practiceLine: string;
};

function journalForToday(store: CaptainDeltaMemoryStore) {
  const today = todayKey();
  if (store.sessionJournal?.date === today) return store.sessionJournal;
  return { date: today, wins: [] as string[], struggles: [] as string[], reviewTopics: [] as string[] };
}

export function recordSessionWin(win: string, store?: CaptainDeltaMemoryStore): CaptainDeltaMemoryStore {
  const base = store ?? loadCaptainDeltaMemory();
  const journal = journalForToday(base);
  const wins = journal.wins.includes(win) ? journal.wins : [...journal.wins, win].slice(-6);
  const next = { ...base, sessionJournal: { ...journal, wins } };
  if (!store) saveCaptainDeltaMemory(next);
  return next;
}

export function recordSessionStruggle(struggle: string, store?: CaptainDeltaMemoryStore): CaptainDeltaMemoryStore {
  const base = store ?? loadCaptainDeltaMemory();
  const journal = journalForToday(base);
  const struggles = journal.struggles.includes(struggle)
    ? journal.struggles
    : [...journal.struggles, struggle].slice(-6);
  const next = { ...base, sessionJournal: { ...journal, struggles } };
  if (!store) saveCaptainDeltaMemory(next);
  return next;
}

export function recordReviewTopic(topic: string, store?: CaptainDeltaMemoryStore): CaptainDeltaMemoryStore {
  const base = store ?? loadCaptainDeltaMemory();
  const journal = journalForToday(base);
  const reviewTopics = journal.reviewTopics.includes(topic)
    ? journal.reviewTopics
    : [...journal.reviewTopics, topic].slice(-4);
  const next = { ...base, sessionJournal: { ...journal, reviewTopics } };
  if (!store) saveCaptainDeltaMemory(next);
  return next;
}

/** End-of-lesson mentor summary — never "Lesson complete." */
export function buildLessonClosingSummary(
  profile: CaptainMentorProfile,
  store?: CaptainDeltaMemoryStore,
): LessonClosingSummary {
  const base = store ?? loadCaptainDeltaMemory();
  const journal = journalForToday(base);
  const win = journal.wins[journal.wins.length - 1];
  const struggle = journal.struggles[journal.struggles.length - 1];
  const review = profile.smartReviewWord ?? journal.reviewTopics[0];

  const todayLine = win
    ? `Today you improved: ${win}.`
    : profile.progressTrend === "up"
      ? "Today you moved forward — your trend is heading the right way."
      : "Today you put in honest reps — that builds real pilot English.";

  const tomorrowLine = review
    ? `Tomorrow we'll work on "${review}".`
    : struggle
      ? `Tomorrow we'll tighten "${struggle}".`
      : profile.examMode
        ? "Tomorrow we'll keep exam-style speaking sharp."
        : "Tomorrow we'll keep building one word at a time.";

  const practiceLine = profile.examSimulation
    ? "Keep practicing full answers out loud — examiner pace, no notes."
    : "Keep practicing slow and clear before you speed up.";

  return { todayLine, tomorrowLine, practiceLine };
}

export function lessonClosingToSpeech(summary: LessonClosingSummary): string {
  return [summary.todayLine, summary.tomorrowLine, summary.practiceLine].join(" ");
}
