import { CATEGORIES, type Category } from "./categories";
import { CARDS } from "./cards";
import type { Card } from "./types";

/** One central ICAO Part 1 question per category — the Essential track. */
export const ESSENTIAL_BY_CATEGORY: Record<Category, string> = {
  helicopter: "31",
  personal: "04",
  safety_crm: "02",
  procedures: "07",
  aircraft_tech: "15",
  airports: "21",
  future: "17",
  general: "16",
};

export const ESSENTIAL_CARD_NUMS = Object.values(ESSENTIAL_BY_CATEGORY);

export function isEssentialCard(num: string): boolean {
  return ESSENTIAL_CARD_NUMS.includes(num);
}

export function getEssentialCards(): Card[] {
  return ESSENTIAL_CARD_NUMS.map(
    (num) => CARDS.find((c) => c.num === num)!,
  ).filter(Boolean);
}

export function essentialLabelFor(num: string): string {
  const entry = (Object.entries(ESSENTIAL_BY_CATEGORY) as [Category, string][]).find(
    ([, n]) => n === num,
  );
  return entry ? CATEGORIES[entry[0]] : "Essential";
}
