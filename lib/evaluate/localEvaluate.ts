import type { EvaluateFeedback, EvaluateRequest, EvaluateScores } from "./types";
import { estimateIcaoLevel } from "./icaoLevel";

const PEEL_MARKERS = [
  "first of all",
  "additionally",
  "finally",
  "for example",
  "overall",
  "in my opinion",
];

const PART2_MARKERS = [
  "anac 123",
  "request",
  "negative",
  "affirm",
  "mayday",
  "pan pan",
  "roger",
  "wilco",
];

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
}

function wordSet(text: string): Set<string> {
  return new Set(normalize(text).split(" ").filter(Boolean));
}

function overlapScore(a: string, b: string): number {
  const wa = wordSet(a);
  const wb = wordSet(b);
  if (!wb.size) return 0;
  let hit = 0;
  for (const w of wb) {
    if (wa.has(w)) hit++;
  }
  return Math.round((hit / wb.size) * 100);
}

function markerScore(transcript: string, markers: string[]): number {
  const t = normalize(transcript);
  const found = markers.filter((m) => t.includes(m));
  return Math.round((found.length / markers.length) * 100);
}

function findMissingKeywords(transcript: string, keywords: string[]): string[] {
  const t = normalize(transcript);
  return keywords.filter((kw) => {
    const parts = normalize(kw).split(" ");
    return !parts.every((p) => t.includes(p));
  });
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function localEvaluate(req: EvaluateRequest): EvaluateFeedback {
  const { transcript, modelAnswer, type, keywords = [] } = req;
  const trimmed = transcript.trim();

  if (!trimmed) {
    return {
      scores: { overall: 0, structure: 0, content: 0, phraseology: 0, pronunciation: 0 },
      transcript: "",
      summary: "Nenhuma fala detectada. Permita o microfone e tente de novo.",
      strengths: [],
      improvements: ["Fale em voz alta em inglês após clicar em Gravar."],
      missingKeywords: keywords,
      source: "local",
    };
  }

  const words = trimmed.split(/\s+/).length;
  const content = overlapScore(trimmed, modelAnswer);
  const structure =
    type === "part1"
      ? markerScore(trimmed, PEEL_MARKERS)
      : markerScore(trimmed, PART2_MARKERS);
  const phraseology =
    type.startsWith("part2") ? markerScore(trimmed, PART2_MARKERS) : structure;
  const missingKeywords = findMissingKeywords(trimmed, keywords);

  let lengthBonus = 0;
  if (type === "part1") {
    if (words >= 70 && words <= 140) lengthBonus = 15;
    else if (words >= 50) lengthBonus = 5;
    else lengthBonus = -10;
  } else {
    if (words >= 8) lengthBonus = 10;
  }

  const keywordPenalty = keywords.length
    ? Math.round((missingKeywords.length / keywords.length) * 25)
    : 0;

  const pronunciation = clamp(
    55 + (content > 60 ? 15 : 0) - (words < 20 && type === "part1" ? 20 : 0),
  );

  const scores: EvaluateScores = {
    content: clamp(content - keywordPenalty),
    structure: clamp(structure),
    phraseology: clamp(phraseology),
    pronunciation,
    overall: 0,
  };
  scores.overall = clamp(
    scores.content * 0.35 +
      scores.structure * 0.25 +
      scores.phraseology * 0.25 +
      scores.pronunciation * 0.15 +
      lengthBonus,
  );

  const strengths: string[] = [];
  const improvements: string[] = [];

  if (scores.content >= 70) strengths.push("Boa cobertura do conteúdo esperado.");
  if (scores.structure >= 60) strengths.push("Estrutura reconhecível na resposta.");
  if (type.startsWith("part2") && normalize(trimmed).includes("anac 123")) {
    strengths.push("Callsign ANAC 123 presente.");
  }
  if (words >= 80 && type === "part1") strengths.push("Duração de resposta adequada para Part 1.");

  if (scores.content < 60) improvements.push("Inclua mais ideias da resposta modelo e keywords.");
  if (scores.structure < 50 && type === "part1") {
    improvements.push("Use conectores PEEL: First of all, Additionally, Finally, For example, Overall.");
  }
  if (missingKeywords.length) {
    improvements.push(`Keywords faltando: ${missingKeywords.slice(0, 5).join(", ")}.`);
  }
  if (type.startsWith("part2") && !normalize(trimmed).includes("anac 123")) {
    improvements.push("Termine com o callsign: ANAC 123.");
  }
  if (words < 50 && type === "part1") {
    improvements.push("Resposta curta demais — na prova você tem ~45 segundos para falar.");
  }

  improvements.push(
    "Pronúncia: correção fonética precisa de áudio (Azure Speech ou IA com áudio). Aqui avaliamos pelo texto transcrito.",
  );

  return {
    scores,
    transcript: trimmed,
    summary: `Pontuação local ${scores.overall}/100 (transcrição automática).`,
    strengths,
    improvements,
    missingKeywords,
    source: "local",
    icaoLevel: estimateIcaoLevel(scores, type),
  };
}
