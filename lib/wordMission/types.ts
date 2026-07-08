/** Unified Word Mission levels — replaces separate PA and VB level codes. */
export type WordMissionLevel = 1 | 2 | 3 | 4;

export const WM_LEVEL_NAMES: Record<WordMissionLevel, string> = {
  1: "Meaning",
  2: "Operational Use",
  3: "Say It",
  4: "ICAO Practice",
};

export const WM_PASS_SCORE = 75;

export function wmLevelCode(level: WordMissionLevel): string {
  return `WM-${level}`;
}

export function wmLevelLabel(level: WordMissionLevel): string {
  return `${wmLevelCode(level)} — ${WM_LEVEL_NAMES[level]}`;
}

/** Captain floating card on Word Mission — feedback only; recording stays on the lesson card. */
export const WORD_MISSION_CAPTAIN_UI = {
  hideMic: true,
  hideSecondaryActions: true,
} as const;
