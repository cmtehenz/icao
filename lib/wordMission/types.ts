/** Unified Word Mission levels — replaces separate PA and VB level codes. */
export type WordMissionLevel = 1 | 2 | 3 | 4;

export const WM_LEVEL_NAMES: Record<WordMissionLevel, string> = {
  1: "Meaning",
  2: "Pilot phrase",
  3: "Sentence",
  4: "ICAO use",
};

export const WM_PASS_SCORE = 75;

export function wmLevelCode(level: WordMissionLevel): string {
  return `WM-${level}`;
}

export function wmLevelLabel(level: WordMissionLevel): string {
  return `${wmLevelCode(level)} — ${WM_LEVEL_NAMES[level]}`;
}
