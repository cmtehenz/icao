import { ICAO_FLIX_VIDEOS, type IcaoFlixVideo } from "@/data/icaoFlix/catalog";
import type { DifficultyArea, DifficultyInsight, DifficultyItem } from "@/lib/difficultyInsights";
import { isVideoWatched, type IcaoFlixProgress } from "@/lib/icaoFlix/progress";

export type IcaoFlixRecommendation = {
  video: IcaoFlixVideo;
  reason: string;
  pinned: boolean;
};

const PART2_SITUATION_TAGS: Record<string, string[]> = {
  "23C-s1": ["performance", "decision-making"],
  "23C-s2": ["crm", "emergency", "part2-interaction"],
  "23C-s3": ["phraseology", "part2-phraseology"],
  "23C-s4": ["decision-making", "weather"],
  "23C-s5": ["phraseology", "technology"],
  "24C-s1": ["decision-making", "go-around"],
  "24C-s2": ["emergency", "crm"],
  "24C-s3": ["crm", "emergency"],
  "24C-s4": ["go-around", "procedures"],
  "24C-s5": ["phraseology", "decision-making"],
  "25C-s1": ["crm", "decision-making"],
  "25C-s2": ["emergency", "performance"],
  "25C-s3": ["decision-making", "phraseology"],
  "25C-s4": ["go-around", "procedures"],
  "25C-s5": ["decision-making", "weather"],
  "26C-s1": ["emergency", "performance"],
  "26C-s2": ["crm", "emergency"],
  "26C-s3": ["phraseology", "procedures"],
  "26C-s4": ["phraseology", "technology"],
  "26C-s5": ["phraseology", "decision-making"],
};

const AREA_TAGS: Record<DifficultyArea, string[]> = {
  part1: [],
  part2: ["phraseology", "part2-phraseology", "part2-interaction", "crm"],
  vocabulary: ["vocabulary", "briefing", "phraseology"],
  pronunciation: ["pronunciation", "exam-tips", "phraseology"],
};

function parsePart1CardId(item: DifficultyItem): string | null {
  if (/^Q\d+/i.test(item.label)) {
    return item.label.replace(/^Q/i, "").padStart(2, "0");
  }
  if (/^\d{2}$/.test(item.id)) return item.id;
  return null;
}

function parsePart2SituationId(item: DifficultyItem): string | null {
  const match = item.id.match(/^(2[3-6]C-s\d+)/);
  return match?.[1] ?? null;
}

function scoreVideoForItem(video: IcaoFlixVideo, item: DifficultyItem, area: DifficultyArea): number {
  let score = 0;

  if (area === "part1") {
    const card = parsePart1CardId(item);
    if (card && video.links.part1Cards?.includes(card)) score += 100;
  }

  if (area === "part2") {
    const situation = parsePart2SituationId(item);
    if (situation && video.links.part2Situations?.includes(situation)) score += 100;
    const tags = situation ? PART2_SITUATION_TAGS[situation] ?? [] : [];
    for (const tag of tags) {
      if (video.tags.includes(tag)) score += 20;
    }
  }

  if (video.links.difficultyAreas?.includes(area)) score += 15;

  for (const tag of AREA_TAGS[area]) {
    if (video.tags.includes(tag)) score += 10;
  }

  return score;
}

function reasonForMatch(video: IcaoFlixVideo, item: DifficultyItem, area: DifficultyArea): string {
  if (area === "part1") {
    const card = parsePart1CardId(item);
    if (card && video.links.part1Cards?.includes(card)) {
      return `Captain recommends this for ${item.label} — one of your weaker Part 1 questions.`;
    }
  }
  if (area === "part2") {
    const situation = parsePart2SituationId(item);
    if (situation) {
      return `Captain recommends this for Part 2 · ${item.label.split(" · ").pop() ?? situation}.`;
    }
  }
  if (area === "vocabulary") {
    return `Captain recommends this to build operational vocabulary — you flagged ${item.label} as weak.`;
  }
  if (area === "pronunciation") {
    return `Captain recommends this for clearer English under exam pressure.`;
  }
  return `Captain recommends this for ${area}.`;
}

export function buildIcaoFlixRecommendations(
  insights: DifficultyInsight[],
  progress: IcaoFlixProgress,
  limit = 6,
): IcaoFlixRecommendation[] {
  const scored = new Map<string, { video: IcaoFlixVideo; score: number; reason: string }>();

  for (const insight of insights) {
    if (insight.score == null || !insight.items.length) continue;

    for (const item of insight.items.slice(0, 3)) {
      for (const video of ICAO_FLIX_VIDEOS) {
        const score = scoreVideoForItem(video, item, insight.area);
        if (score <= 0) continue;

        const existing = scored.get(video.id);
        const reason = reasonForMatch(video, item, insight.area);
        if (!existing || score > existing.score) {
          scored.set(video.id, { video, score, reason });
        }
      }
    }
  }

  const ranked = [...scored.values()].sort((a, b) => b.score - a.score);

  const out: IcaoFlixRecommendation[] = [];
  for (const entry of ranked) {
    if (out.length >= limit) break;
    const pinned = !isVideoWatched(entry.video.id, progress);
    out.push({
      video: entry.video,
      reason: entry.reason,
      pinned,
    });
  }

  return out;
}

export function pinnedRecommendations(recommendations: IcaoFlixRecommendation[]): IcaoFlixRecommendation[] {
  return recommendations.filter((r) => r.pinned);
}
