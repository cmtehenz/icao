/** Highest-priority helicopter ICAO Part 1 questions for exam prep. */
export const HELICOPTER_CORE_NUMS = [
  "01", // effective briefing
  "02", // difficult situation
  "03", // check ride advice
  "04", // medical exams
  "06", // ICAO phraseology
  "08", // missed approach
  "09", // flight simulator emergencies
] as const;

export type CoreQuestionNum = (typeof HELICOPTER_CORE_NUMS)[number];

export function isCoreQuestion(num: string): boolean {
  return (HELICOPTER_CORE_NUMS as readonly string[]).includes(num);
}
