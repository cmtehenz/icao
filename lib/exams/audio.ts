import type { ExamVersion } from "./types";
import { EXAM_AUDIO_FILES, EXAM_AUDIO_FOLDERS } from "@/data/exams/audioManifest";

/** Sound check played before Part 2 (TRACK 1 in all exam PDFs). */
export const SOUND_CHECK_TRACK = 1;

/**
 * URL to the original exam MP3 (copied to public/provas/ by setup:audio).
 * Track numbers match the PDF: 1 = sound check, 2/4/6/8/10 = readbacks, 3/5/7/9/11 = ATC follow-ups.
 */
export function examAudioUrl(version: ExamVersion, track: number): string {
  const file = EXAM_AUDIO_FILES[version]?.[track];
  const folder = EXAM_AUDIO_FOLDERS[version];
  if (!file || !folder) return "";

  const segments = ["provas", folder, file].map((s) => encodeURIComponent(s));
  return `/${segments.join("/")}`;
}

export function examAudioLabel(version: ExamVersion, track: number): string {
  const file = EXAM_AUDIO_FILES[version]?.[track];
  return file ? `TRACK ${track} — ${file}` : `TRACK ${track}`;
}

/** Part 2 readback tracks: 2, 4, 6, 8, 10 for situations 1–5 */
export function readbackTrack(situationNumber: number): number {
  return situationNumber * 2;
}

/** Part 2 ATC follow-up tracks: 3, 5, 7, 9, 11 */
export function followUpTrack(situationNumber: number): number {
  return situationNumber * 2 + 1;
}
