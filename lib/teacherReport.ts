import { CARDS } from "@/lib/cards";
import { buildDifficultyInsights } from "@/lib/difficultyInsights";
import { getPart1CoachHistory } from "@/lib/part1CoachHistory";
import { getWeakPeelBlockIds, peelBlockLabel } from "@/lib/peelBlockHistory";
import { loadVault } from "@/lib/pronunciationVault";
import type { DifficultyItem } from "@/lib/difficultyInsights";

export type TeacherReportLine = {
  label: string;
  score: string;
  note?: string;
};

export type TeacherReport = {
  generatedAt: string;
  studentName?: string;
  pronunciation: TeacherReportLine[];
  part1: TeacherReportLine[];
  part2: TeacherReportLine[];
  vocabulary: TeacherReportLine[];
  focusSummary: string[];
  plainText: string;
};

function formatItemScore(item: DifficultyItem): string {
  if (item.icaoLevel != null) return `${item.score}% · ICAO ${item.icaoLevel}`;
  return `${item.score}%`;
}

function part1Lines(items: DifficultyItem[]): TeacherReportLine[] {
  return items.map((item) => {
    const card = CARDS.find((c) => c.num === item.id);
    const coach = getPart1CoachHistory(item.id);
    const weakPeel = getWeakPeelBlockIds(item.id).map(peelBlockLabel);
    const notes: string[] = [];
    if (item.detail) notes.push(item.detail);
    if (coach && coach.attempts > 1) notes.push(`${coach.attempts} tentativas no Coach`);
    if (weakPeel.length) notes.push(`Shadow PEEL fraco: ${weakPeel.join(", ")}`);
    return {
      label: card ? `Q${item.id} — ${card.question.slice(0, 55)}${card.question.length > 55 ? "…" : ""}` : item.label,
      score: formatItemScore(item),
      note: notes.length ? notes.join(" · ") : undefined,
    };
  });
}

function genericLines(items: DifficultyItem[]): TeacherReportLine[] {
  return items.map((item) => ({
    label: item.label,
    score: formatItemScore(item),
    note: item.detail,
  }));
}

function pronunciationLines(limit: number): TeacherReportLine[] {
  const vault = loadVault();
  return vault
    .filter((w) => w.lastAccuracy > 0)
    .sort((a, b) => {
      const aW = a.lastAccuracy + a.returnCount * 3;
      const bW = b.lastAccuracy + b.returnCount * 3;
      return aW - bW;
    })
    .slice(0, limit)
    .map((w) => {
      const notes: string[] = [];
      if (w.errorLabel) notes.push(w.errorLabel);
      if (w.returnCount > 0) notes.push(`voltou ${w.returnCount}× para treino`);
      if (w.context) notes.push(w.context.slice(0, 80));
      return {
        label: w.word,
        score: `${w.lastAccuracy}%`,
        note: notes.length ? notes.join(" · ") : undefined,
      };
    });
}

function buildFocusSummary(
  pronunciation: TeacherReportLine[],
  part1: TeacherReportLine[],
  part2: TeacherReportLine[],
  vocabulary: TeacherReportLine[],
): string[] {
  const lines: string[] = [];

  const badPron = pronunciation.filter((l) => parseInt(l.score, 10) < 60);
  if (badPron.length) {
    lines.push(
      `Pronúncia: foco em ${badPron
        .slice(0, 4)
        .map((l) => l.label)
        .join(", ")}.`,
    );
  }

  if (part1.length) {
    const weak = part1.slice(0, 3).map((l) => l.label.split(" — ")[0] ?? l.label);
    lines.push(`Part 1: estrutura e fluência nas perguntas ${weak.join(", ")} (Coach Azure).`);
  }

  const part2ByMode = { readback: [] as TeacherReportLine[], interaction: [] as TeacherReportLine[], reported: [] as TeacherReportLine[] };
  for (const line of part2) {
    if (line.label.startsWith("Readback")) part2ByMode.readback.push(line);
    else if (line.label.startsWith("Interaction")) part2ByMode.interaction.push(line);
    else if (line.label.startsWith("Reported")) part2ByMode.reported.push(line);
  }

  const modeAvg = (items: TeacherReportLine[]) =>
    items.length
      ? Math.round(items.reduce((s, i) => s + parseInt(i.score, 10), 0) / items.length)
      : null;

  const rb = modeAvg(part2ByMode.readback);
  const int = modeAvg(part2ByMode.interaction);
  const rep = modeAvg(part2ByMode.reported);
  const modes: string[] = [];
  if (int != null && int < 80) modes.push(`interaction (${int}% média)`);
  if (rep != null && rep < 80) modes.push(`reported speech (${rep}% média)`);
  if (rb != null && rb < 80) modes.push(`readback (${rb}% média)`);
  if (modes.length) {
    lines.push(`Part 2 speaking: reforçar ${modes.join(" e ")}.`);
  } else if (part2.length) {
    lines.push("Part 2: continuar simulações completas por prova (23C–26C).");
  }

  const badVocab = vocabulary.filter((l) => parseInt(l.score, 10) < 60);
  if (badVocab.length) {
    lines.push(
      `Vocabulário técnico: ${badVocab
        .slice(0, 4)
        .map((l) => l.label)
        .join(", ")}.`,
    );
  }

  if (!lines.length) {
    lines.push("Ainda poucos dados de gravação — complete Coach Part 1, simulação Part 2 e pronúncia Azure.");
  }

  return lines;
}

function formatSection(title: string, lines: TeacherReportLine[]): string {
  if (!lines.length) return `${title}\n(nenhum dado de prática ainda)\n`;
  const body = lines
    .map((l, i) => {
      const note = l.note ? `\n   ${l.note}` : "";
      return `${i + 1}. ${l.label} — ${l.score}${note}`;
    })
    .join("\n");
  return `${title}\n${body}\n`;
}

export function formatTeacherReportPlainText(report: TeacherReport): string {
  const date = new Date(report.generatedAt).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const name = report.studentName ? `Aluno: ${report.studentName}\n` : "";

  const summary = report.focusSummary.map((s, i) => `${i + 1}. ${s}`).join("\n");

  return [
    "RELATÓRIO ICAO — SDEA Part 1 & Part 2",
    `Data: ${date}`,
    name.trim(),
    "Baseado em gravações reais (Azure Speech + Coach). Itens não praticados não aparecem.",
    "",
    formatSection("PRONÚNCIA — palavras mais difíceis", report.pronunciation),
    formatSection("PART 1 — perguntas mais fracas (Coach)", report.part1),
    formatSection("PART 2 — speaking (readback / interaction / reported)", report.part2),
    formatSection("VOCABULÁRIO — termos com menor domínio", report.vocabulary),
    "RESUMO PARA O PROFESSOR",
    summary,
    "",
    "— Gerado pelo app ICAO (treino SDEA)",
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildTeacherReport(studentName?: string, itemLimit = 8): TeacherReport {
  const insights = buildDifficultyInsights(itemLimit);
  const pronunciation = pronunciationLines(itemLimit);
  const part1 = part1Lines(insights.find((i) => i.area === "part1")?.items ?? []);
  const part2 = genericLines(insights.find((i) => i.area === "part2")?.items ?? []);
  const vocabulary = genericLines(insights.find((i) => i.area === "vocabulary")?.items ?? []);
  const focusSummary = buildFocusSummary(pronunciation, part1, part2, vocabulary);

  const generatedAt = new Date().toISOString();
  const base = {
    generatedAt,
    studentName,
    pronunciation,
    part1,
    part2,
    vocabulary,
    focusSummary,
    plainText: "",
  };

  return {
    ...base,
    plainText: formatTeacherReportPlainText({ ...base, plainText: "" }),
  };
}
