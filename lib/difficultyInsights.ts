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
  /** null = sem prática registrada ainda */
  score: number | null;
  items: DifficultyItem[];
  hint?: string;
};

function clampScore(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function part1DifficultyItems(): DifficultyItem[] {
  const progress = loadProgress();
  const items: DifficultyItem[] = [];

  for (const card of CARDS) {
    const history = getPeelBlockHistory(card.num);
    const records = Object.values(history).filter((r) => r && r.attempts > 0);
    if (!records.length) continue;

    const avgAcc = records.reduce((sum, r) => sum + r.lastAccuracy, 0) / records.length;
    const cp = getCardProgress(progress, card.num);
    let score = avgAcc;
    if (cp.status === "difficult") score = Math.min(score, avgAcc);

    items.push({
      id: card.num,
      label: `Q${card.num}`,
      score: clampScore(score),
      detail: card.question.slice(0, 60) + (card.question.length > 60 ? "…" : ""),
    });
  }

  return items.sort((a, b) => a.score - b.score);
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

      if (p.lastScore != null && p.lastScore > 0) {
        items.push({
          id: key,
          label: `${mode} · ${scenario.title}`,
          score: clampScore(p.lastScore),
        });
        continue;
      }

      // Só mostra status manual se o usuário marcou (reviews > 0), sem score inventado
      if (p.reviews > 0 && (p.status === "difficult" || p.status === "mastered")) {
        items.push({
          id: key,
          label: `${mode} · ${scenario.title}`,
          score: clampScore(p.status === "mastered" ? 85 : 40),
          detail: p.status === "difficult" ? "marcado difícil" : undefined,
        });
      }
    }
  }

  return items.sort((a, b) => a.score - b.score);
}

function vocabularyDifficultyItems(): DifficultyItem[] {
  const store = loadVocabProgressStore();
  const items: DifficultyItem[] = [];

  for (const item of ICAO_VOCABULARY) {
    const p = getItemProgress(store, item.id);
    if (p.attempts === 0) continue;

    const masteryPct = (p.masteryLevel / 5) * 100;
    let score = p.bestScore > 0 ? p.bestScore : masteryPct;
    if (p.markedDifficult || p.status === "review") score = Math.min(score, 45);

    items.push({
      id: item.id,
      label: item.term,
      score: clampScore(score),
      detail: item.meaning,
    });
  }

  return items.sort((a, b) => a.score - b.score);
}

function pronunciationDifficultyItems(): DifficultyItem[] {
  const words = loadVault();
  return words
    .filter((w) => w.lastAccuracy > 0)
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

function areaScore(items: DifficultyItem[]): number | null {
  if (!items.length) return null;
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
      hint:
        part1Items.length === 0
          ? "Notas do shadow PEEL / coach — perguntas sem gravação não aparecem."
          : undefined,
    },
    {
      area: "part2" as const,
      label: "Part 2",
      score: areaScore(part2Items),
      items: part2Items.slice(0, limit),
      hint:
        part2Items.length === 0
          ? "Notas do Coach com Azure — grave readback/interaction para registrar."
          : undefined,
    },
    {
      area: "vocabulary" as const,
      label: "Vocabulário",
      score: areaScore(vocabItems),
      items: vocabItems.slice(0, limit),
      hint:
        vocabItems.length === 0
          ? "Termos sem tentativa não entram — 0% não significa falha, só não praticou."
          : undefined,
    },
    {
      area: "pronunciation" as const,
      label: "Pronúncia",
      score: areaScore(pronItems),
      items: pronItems.slice(0, limit),
      hint:
        pronItems.length === 0
          ? "Palavras salvas no banco após gravações Azure."
          : undefined,
    },
  ].sort((a, b) => {
    const as = a.score ?? 101;
    const bs = b.score ?? 101;
    return as - bs;
  });
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
