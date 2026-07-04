import type { SimuladoPart } from "@/lib/simulado/types";

export const PART_TARGET_MINUTES: Record<SimuladoPart, { min: number; max: number }> = {
  1: { min: 4, max: 4 },
  2: { min: 15, max: 16 },
  3: { min: 12, max: 14 },
  4: { min: 7, max: 8 },
};

export const PART_ANNOUNCEMENTS: Record<SimuladoPart, string> = {
  1: `Part One. Aviation Topics. I will ask you some questions about your aviation experience. Please answer naturally.`,
  2: `Part Two. Interacting as a Pilot. Listen carefully to the ATC instructions and respond as you would in flight.`,
  3: `Part Three. Unexpected Situations. You may take notes. Report clearly and answer my follow-up questions.`,
  4: `Part Four. Picture Description and Discussion. Describe what you see, then answer my follow-up questions.`,
};

export const EXAMINER_ALLOWED = [
  "Thank you.",
  "Next question.",
  "Please continue.",
  "Can you clarify that?",
  "Can you repeat that?",
  "Do you have any questions before we begin?",
];

export function roleSwitchScript(firstName: string): string {
  return `${firstName}, I will now switch to Examiner Mode. During the exam, I will not help you. I will only ask questions and manage the test. After we finish, I will return as your instructor and give you a debrief.`;
}

export function partTransitionScript(part: SimuladoPart): string {
  if (part === 2) return `Now we will move to Part Two. ${PART_ANNOUNCEMENTS[2]}`;
  if (part === 3) return `Now we will move to Part Three. ${PART_ANNOUNCEMENTS[3]}`;
  if (part === 4) return `Now we will move to Part Four. ${PART_ANNOUNCEMENTS[4]}`;
  return PART_ANNOUNCEMENTS[part];
}

export function examFinishedScript(): string {
  return `Exam finished. I will now return as your instructor. Let's do the debrief.`;
}

export function formatPartTimer(part: SimuladoPart, elapsedSec: number): string {
  const m = Math.floor(elapsedSec / 60);
  const s = elapsedSec % 60;
  const target = PART_TARGET_MINUTES[part];
  return `Part ${part} · ${m}:${s.toString().padStart(2, "0")} / ~${target.max} min`;
}
