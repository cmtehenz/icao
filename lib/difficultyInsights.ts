import { CARDS } from "@/lib/cards";
import { getPart1CoachHistory } from "@/lib/part1CoachHistory";
import { getPart2ItemProgress, loadPart2Progress } from "@/lib/part2/progress";
import { loadVault, type VaultWord } from "@/lib/pronunciationVault";
import { ICAO_VOCABULARY } from "@/data/icaoVocabulary";
import { getWordMissionVocabulary } from "@/lib/wordMission/wordMissionCatalog";
import { ALL_EXAM_SITUATIONS } from "@/data/exams/part2Data";
import { getItemProgress, loadVocabProgressStore } from "@/utils/spacedRepetition";
import { todayKey } from "@/lib/studyTime";

export type DifficultyArea = "part1" | "part2" | "vocabulary" | "pronunciation";

/** Time window for difficulty items — avoids stale all-time vault words in "today" UI. */
export type InsightScope = "today" | "recent" | "all";

export const RECENT_INSIGHT_DAYS = 7;

export type DifficultyItem = {
  id: string;
  label: string;
  /** 0–100 — usado para ordenar áreas; Part 1 deriva do nível ICAO. */
  score: number;
  /** Part 1 Coach — nível ICAO 1–6 da última gravação. */
  icaoLevel?: number;
  detail?: string;
  /** YYYY-MM-DD of the practice that produced this row. */
  practicedAt?: string;
};

export type DifficultyInsight = {
  area: DifficultyArea;
  label: string;
  /** null = sem prática registrada ainda */
  score: number | null;
  /** Ex.: "ICAO 4" para Part 1 Coach */
  displayScore?: string | null;
  /** Média ICAO das perguntas mais fracas (Part 1). */
  aggregateIcaoLevel?: number | null;
  items: DifficultyItem[];
  hint?: string;
};

function clampScore(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function parseDateKey(value: string | undefined): string | null {
  if (!value) return null;
  const key = value.length >= 10 ? value.slice(0, 10) : value;
  return /^\d{4}-\d{2}-\d{2}$/.test(key) ? key : null;
}

function dateKeysBack(days: number, offset = 0): string[] {
  const keys: string[] = [];
  const base = new Date();
  base.setHours(12, 0, 0, 0);
  for (let i = days - 1 + offset; i >= offset; i -= 1) {
    const d = new Date(base);
    d.setDate(base.getDate() - i);
    keys.push(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
    );
  }
  return keys;
}

export function withinInsightScope(dateKey: string | undefined, scope: InsightScope): boolean {
  if (scope === "all") return true;
  const parsed = parseDateKey(dateKey);
  if (!parsed) return false;
  if (scope === "today") return parsed === todayKey();
  return new Set(dateKeysBack(RECENT_INSIGHT_DAYS)).has(parsed);
}

function part1AggregateLevel(items: DifficultyItem[]): number | null {
  if (!items.length) return null;
  const weakest = items.slice(0, Math.min(5, items.length));
  return Math.round(
    weakest.reduce((sum, item) => sum + (item.icaoLevel ?? 4), 0) / weakest.length,
  );
}

function part1DisplayScore(items: DifficultyItem[], score: number | null): string | null {
  if (score == null) return null;
  const level = part1AggregateLevel(items);
  return level != null ? `${score}% · ICAO ${level}` : `${score}%`;
}

function part1DifficultyItems(scope: InsightScope): DifficultyItem[] {
  const items: DifficultyItem[] = [];

  for (const card of CARDS) {
    const record = getPart1CoachHistory(card.num);
    if (!record) continue;
    const practicedAt = parseDateKey(record.lastAt) ?? undefined;
    if (!withinInsightScope(practicedAt, scope)) continue;

    items.push({
      id: card.num,
      label: `Q${card.num}`,
      icaoLevel: record.lastIcaoLevel,
      score: clampScore(record.lastOverall),
      detail: card.question.slice(0, 60) + (card.question.length > 60 ? "…" : ""),
      practicedAt,
    });
  }

  return items.sort((a, b) => a.score - b.score);
}

function part2DifficultyItems(scope: InsightScope): DifficultyItem[] {
  const progress = loadPart2Progress();
  const items: DifficultyItem[] = [];

  for (const scenario of ALL_EXAM_SITUATIONS) {
    for (const suffix of ["rb", "int", "rep"] as const) {
      const key = `${scenario.id}-${suffix}`;
      const p = getPart2ItemProgress(progress, key);
      const mode =
        suffix === "rb" ? "Readback" : suffix === "int" ? "Interaction" : "Reported";
      const practicedAt = p.lastReviewed;

      if (p.lastScore != null && p.lastScore > 0) {
        if (!withinInsightScope(practicedAt, scope)) continue;
        items.push({
          id: key,
          label: `${mode} · ${scenario.title}`,
          score: clampScore(p.lastScore),
          practicedAt,
        });
        continue;
      }

      // Só mostra status manual se o usuário marcou (reviews > 0), sem score inventado
      if (p.reviews > 0 && (p.status === "difficult" || p.status === "mastered")) {
        if (!withinInsightScope(practicedAt, scope)) continue;
        items.push({
          id: key,
          label: `${mode} · ${scenario.title}`,
          score: clampScore(p.status === "mastered" ? 85 : 40),
          detail: p.status === "difficult" ? "marcado difícil" : undefined,
          practicedAt,
        });
      }
    }
  }

  return items.sort((a, b) => a.score - b.score);
}

function vocabularyDifficultyItems(scope: InsightScope): DifficultyItem[] {
  const store = loadVocabProgressStore();
  const items: DifficultyItem[] = [];
  const catalog = getWordMissionVocabulary();
  const seen = new Set<string>();

  const pushItem = (id: string, term: string, meaning: string, p: ReturnType<typeof getItemProgress>) => {
    if (p.attempts === 0) return;
    const practicedAt = parseDateKey(p.lastAttemptDate) ?? undefined;
    if (!withinInsightScope(practicedAt, scope)) return;

    const masteryPct = (p.masteryLevel / 5) * 100;
    let score = p.bestScore > 0 ? p.bestScore : masteryPct;
    if (p.markedDifficult || p.status === "review") score = Math.min(score, 45);

    items.push({
      id,
      label: term,
      score: clampScore(score),
      detail: meaning,
      practicedAt,
    });
    seen.add(id);
  };

  for (const item of catalog) {
    pushItem(item.id, item.term, item.meaning, getItemProgress(store, item.id));
  }

  for (const item of ICAO_VOCABULARY) {
    if (seen.has(item.id)) continue;
    pushItem(item.id, item.term, item.meaning, getItemProgress(store, item.id));
  }

  return items.sort((a, b) => a.score - b.score);
}

function pronunciationDifficultyItems(scope: InsightScope): DifficultyItem[] {
  const words = loadVault();
  return words
    .filter((w) => w.lastAccuracy > 0)
    .map((w: VaultWord) => {
      const practicedAt =
        parseDateKey(w.lastPracticedAt ?? w.lastSeenAt) ?? undefined;
      return {
        id: w.word,
        label: w.word,
        score: clampScore(w.lastAccuracy),
        detail: w.returnCount > 0 ? `voltou ${w.returnCount}×` : w.errorLabel,
        practicedAt,
      };
    })
    .filter((item) => withinInsightScope(item.practicedAt, scope))
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

export function buildDifficultyInsights(limit = 5, scope: InsightScope = "recent"): DifficultyInsight[] {
  const part1Items = part1DifficultyItems(scope);
  const part2Items = part2DifficultyItems(scope);
  const vocabItems = vocabularyDifficultyItems(scope);
  const pronItems = pronunciationDifficultyItems(scope);
  const part1Score = areaScore(part1Items);
  const scopeHint =
    scope === "today"
      ? "Só gravações de hoje."
      : scope === "recent"
        ? `Últimos ${RECENT_INSIGHT_DAYS} dias — itens antigos não entram.`
        : undefined;

  return [
    {
      area: "part1" as const,
      label: "Part 1",
      score: part1Score,
      displayScore: part1DisplayScore(part1Items, part1Score),
      aggregateIcaoLevel: part1AggregateLevel(part1Items),
      items: part1Items.slice(0, limit),
      hint:
        part1Items.length === 0
          ? scope === "today"
            ? "Nenhuma gravação Part 1 hoje ainda."
            : "Nota % e nível ICAO do Coach — shadow PEEL não entra aqui."
          : scopeHint ?? "Última nota % no Coach + nível ICAO — shadow é só pronúncia.",
    },
    {
      area: "part2" as const,
      label: "Part 2",
      score: areaScore(part2Items),
      items: part2Items.slice(0, limit),
      hint:
        part2Items.length === 0
          ? scope === "today"
            ? "Nenhuma gravação Part 2 hoje ainda."
            : "Notas do Coach com Azure — grave readback/interaction para registrar."
          : scopeHint,
    },
    {
      area: "vocabulary" as const,
      label: "Vocabulário",
      score: areaScore(vocabItems),
      items: vocabItems.slice(0, limit),
      hint:
        vocabItems.length === 0
          ? scope === "today"
            ? "Nenhum termo gravado hoje ainda."
            : "Termos sem tentativa não entram — 0% não significa falha, só não praticou."
          : scopeHint,
    },
    {
      area: "pronunciation" as const,
      label: "Pronúncia",
      score: areaScore(pronItems),
      items: pronItems.slice(0, limit),
      hint:
        pronItems.length === 0
          ? scope === "today"
            ? "Nenhuma palavra no banco de pronúncia hoje ainda."
            : "Palavras salvas no banco após gravações Azure."
          : scopeHint,
    },
  ].sort((a, b) => {
    const as = a.score ?? 101;
    const bs = b.score ?? 101;
    return as - bs;
  });
}

export function weakestOverallItems(limit = 8, scope: InsightScope = "recent"): DifficultyItem[] {
  const all = buildDifficultyInsights(10, scope).flatMap((insight) =>
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
