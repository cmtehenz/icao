import { CARDS } from "@/lib/cards";
import { getPeelBlockHistory } from "@/lib/peelBlockHistory";
import { getPart2ItemProgress, loadPart2Progress } from "@/lib/part2/progress";
import { getCardProgress, loadProgress } from "@/lib/progress";
import { loadVault, type VaultWord } from "@/lib/pronunciationVault";
import { ICAO_VOCABULARY } from "@/data/icaoVocabulary";
import { ALL_EXAM_SITUATIONS } from "@/data/exams/part2Data";
import { getItemProgress, loadVocabProgressStore } from "@/utils/spacedRepetition";

export type DifficultyArea = "part1" | "part2" | "vocabulary" | "pronunciation";

export type DifficultyItem = {
  id: string;
  label: string;
  score: number;
  detail?: string;
};

export type DifficultyInsight = {
  area: DifficultyArea;
  label: string;
  score: number;
  items: DifficultyItem[];
};

function clampScore(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function part1DifficultyItems(): DifficultyItem[] {
  const progress = loadProgress();
  return CARDS.map((card) => {
    const cp = getCardProgress(progress, card.num);
    const history = getPeelBlockHistory(card.num);
    const accuracies = Object.values(history).map((h) => h.lastAccuracy);
    const avgAcc =
      accuracies.length > 0
        ? accuracies.reduce((a, b) => a + b, 0) / accuracies.length
        : cp.status === "mastered"
          ? 90
          : cp.status === "difficult"
            ? 40
            : 60;

    let score = avgAcc;
    if (cp.status === "difficult") score = Math.min(score, 45);
    if (cp.status === "new") score = Math.min(score, 55);

    return {
      id: card.num,
      label: `Q${card.num}`,
      score: clampScore(score),
      detail: card.question.slice(0, 60) + (card.question.length > 60 ? "…" : ""),
    };
  }).sort((a, b) => a.score - b.score);
}

function part2DifficultyItems(): DifficultyItem[] {
  const progress = loadPart2Progress();
  const items: DifficultyItem[] = [];

  for (const scenario of ALL_EXAM_SITUATIONS) {
    for (const suffix of ["rb", "int", "rep"] as const) {
      const key = `${scenario.id}-${suffix}`;
      const p = getPart2ItemProgress(progress, key);
      const mode =
        suffix === "rb" ? "Readback" : suffix === "int" ? "Interaction" : "Reported";
      let score = 70;
      if (p.status === "difficult") score = 35;
      else if (p.status === "new") score = 50;
      else if (p.status === "learning") score = 62;
      else if (p.status === "mastered") score = 88;

      items.push({
        id: key,
        label: `${mode} · ${scenario.title}`,
        score: clampScore(score),
      });
    }
  }

  return items.sort((a, b) => a.score - b.score);
}

function vocabularyDifficultyItems(): DifficultyItem[] {
  const store = loadVocabProgressStore();
  return ICAO_VOCABULARY.map((item) => {
    const p = getItemProgress(store, item.id);
    const masteryPct = (p.masteryLevel / 5) * 100;
    let score = masteryPct;
    if (p.bestScore > 0) score = Math.min(score, p.bestScore);
    if (p.markedDifficult || p.status === "review") score = Math.min(score, 40);
    if (p.status === "new") score = Math.min(score, 45);

    return {
      id: item.id,
      label: item.term,
      score: clampScore(score),
      detail: item.meaning,
    };
  }).sort((a, b) => a.score - b.score);
}

function pronunciationDifficultyItems(): DifficultyItem[] {
  const words = loadVault();
  return words
    .map((w: VaultWord) => ({
      id: w.word,
      label: w.word,
      score: clampScore(w.lastAccuracy),
      detail: w.returnCount > 0 ? `voltou ${w.returnCount}×` : w.errorLabel,
    }))
    .sort((a, b) => {
      const aWeight = a.score + (words.find((w) => w.word === a.id)?.returnCount ?? 0) * 3;
      const bWeight = b.score + (words.find((w) => w.word === b.id)?.returnCount ?? 0) * 3;
      return aWeight - bWeight;
    });
}

function areaScore(items: DifficultyItem[]): number {
  if (!items.length) return 100;
  const weakest = items.slice(0, Math.min(5, items.length));
  const avg = weakest.reduce((s, i) => s + i.score, 0) / weakest.length;
  return clampScore(avg);
}

export function buildDifficultyInsights(limit = 5): DifficultyInsight[] {
  const part1Items = part1DifficultyItems();
  const part2Items = part2DifficultyItems();
  const vocabItems = vocabularyDifficultyItems();
  const pronItems = pronunciationDifficultyItems();

  return [
    {
      area: "part1" as const,
      label: "Part 1",
      score: areaScore(part1Items),
      items: part1Items.slice(0, limit),
    },
    {
      area: "part2" as const,
      label: "Part 2",
      score: areaScore(part2Items),
      items: part2Items.slice(0, limit),
    },
    {
      area: "vocabulary" as const,
      label: "Vocabulário",
      score: areaScore(vocabItems),
      items: vocabItems.slice(0, limit),
    },
    {
      area: "pronunciation" as const,
      label: "Pronúncia",
      score: areaScore(pronItems.length ? pronItems : [{ id: "-", label: "—", score: 100 }]),
      items: pronItems.slice(0, limit),
    },
  ].sort((a, b) => a.score - b.score);
}

export function weakestOverallItems(limit = 8): DifficultyItem[] {
  const all = buildDifficultyInsights(10).flatMap((insight) =>
    insight.items.map((item) => ({
      ...item,
      detail: insight.label + (item.detail ? ` · ${item.detail}` : ""),
    })),
  );
  const seen = new Set<string>();
  const unique: DifficultyItem[] = [];
  for (const item of all.sort((a, b) => a.score - b.score)) {
    const key = `${item.label}-${item.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(item);
    if (unique.length >= limit) break;
  }
  return unique;
}
