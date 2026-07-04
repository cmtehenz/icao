import type { SimuladoPart } from "@/lib/simulado/types";

/** Parts currently available in the Simulado flow (Part 3 & 4 disabled for now). */
export const SIMULADO_ACTIVE_PARTS: readonly SimuladoPart[] = [1, 2];

export const SIMULADO_PARTS_COMING_SOON: readonly SimuladoPart[] = [3, 4];

export type SimuladoPart1Item = {
  cardNum: string;
  question: string;
};

/** Fixed Part 1 script for all Simulado sessions (prova 23C — cards 01, 02, 03). */
export const SIMULADO_PART1_QUESTIONS: readonly SimuladoPart1Item[] = [
  {
    cardNum: "01",
    question: "In your opinion, what makes a briefing effective?",
  },
  {
    cardNum: "02",
    question: "What was the most difficult situation you have had in a flight?",
  },
  {
    cardNum: "03",
    question: "Could you describe the airport you operate at the most?",
  },
];

export function isSimuladoPartEnabled(part: SimuladoPart): boolean {
  return SIMULADO_ACTIVE_PARTS.includes(part);
}
