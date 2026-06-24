import { CARDS } from "./cards";

/** Fixed PEEL question set — same as full bank. */
export const PEEL_CARD_NUMS = CARDS.map((c) => c.num);

export function isPeelCard(num: string): boolean {
  return PEEL_CARD_NUMS.includes(num);
}
