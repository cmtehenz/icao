/** Curated brief-step media aligned with FAA, SKYbrary OGHFA, and CRM practice. */
import {
  PART1_BRIEF_META,
  getVideosForPart1Card,
  type Part1BriefMeta,
} from "@/data/icaoFlix/catalog";

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
  /** Context line shown above the media for this exam question. */
  lead: string;
  videos: Part1BriefResource[];
  links: Part1BriefLink[];
};

const ALL_PART1_CARD_NUMS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));

const DEFAULT_META: Part1BriefMeta = {
  lead: "Watch a reference before you build your answer — operational context, not a script.",
  links: [],
};

export function getPart1BriefPack(cardNum: string): Part1BriefPack {
  const key = cardNum.padStart(2, "0");
  const meta = PART1_BRIEF_META[key] ?? DEFAULT_META;
  const videos = getVideosForPart1Card(key).map((v) => ({
    title: v.title,
    source: v.source,
    youtubeId: v.youtubeId,
    why: v.why,
  }));

  return {
    lead: meta.lead,
    videos,
    links: meta.links,
  };
}

/** @deprecated Use PART1_BRIEF_META + ICAO_FLIX_VIDEOS — kept for tests importing legacy shape. */
export const PART1_BRIEF_RESOURCES: Record<string, Part1BriefPack> = Object.fromEntries(
  ALL_PART1_CARD_NUMS.map((num) => [num, getPart1BriefPack(num)]),
);

/** Ensures every Part 1 bank card has at least one curated brief resource. */
export function assertPart1BriefResourcesComplete(): void {
  for (const num of ALL_PART1_CARD_NUMS) {
    const pack = getPart1BriefPack(num);
    if (pack.videos.length + pack.links.length === 0) {
      throw new Error(`Part 1 brief resources empty for card ${num}`);
    }
    if (!pack.lead.trim()) {
      throw new Error(`Part 1 brief lead missing for card ${num}`);
    }
  }
}
