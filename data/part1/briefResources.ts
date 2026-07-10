/** Curated brief-step media aligned with FAA, SKYbrary OGHFA, and CRM practice. */
export type Part1BriefResource = {
  title: string;
  source: string;
  youtubeId: string;
  why: string;
};

export type Part1BriefLink = {
  title: string;
  source: string;
  href: string;
  why: string;
};

export type Part1BriefPack = {
  videos: Part1BriefResource[];
  links: Part1BriefLink[];
};

export const PART1_BRIEF_RESOURCES: Record<string, Part1BriefPack> = {
  "01": {
    videos: [
      {
        title: "Preflighting Your Passengers",
        source: "FAA Rotorcraft Collective",
        youtubeId: "xpMQNHvxC7c",
        why: "FAA best practices for a structured, safety-focused helicopter briefing before flight.",
      },
      {
        title: "Communication, CRM & Cockpit Safety",
        source: "Brian Schiff",
        youtubeId: "gnSCpa2weUs",
        why: "Why interactive crew briefings and shared mental models matter (CRM).",
      },
    ],
    links: [
      {
        title: "Flight Preparation and Effective Briefings",
        source: "SKYbrary OGHFA",
        href: "https://skybrary.aero/articles/flight-preparation-and-conducting-effective-briefings-oghfa-bn",
        why: "Industry reference for high-quality preflight briefings and crew synergy.",
      },
    ],
  },
};

export function getPart1BriefPack(cardNum: string): Part1BriefPack {
  return PART1_BRIEF_RESOURCES[cardNum.padStart(2, "0")] ?? { videos: [], links: [] };
}
