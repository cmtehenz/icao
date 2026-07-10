import type { EvaluateFeedback, EvaluateRequest, EvaluateScores } from "./types";
import { compareTranscriptToModel } from "./compareAnswer";
import { scorePart1Content, keywordMatches } from "./contentScore";
import { estimateIcaoLevel } from "./icaoLevel";
import { peelMissingConnectors, peelStructureFeedbackPt, peelStructureScore } from "./peel";
import { normalizeAviationTranscript } from "./transcriptNormalize";
import { normalizeConfirmTranscript, isShortPhraseologyAnswer, scoreConfirmResponse } from "./confirmTranscript";
import { normalizeReadbackTranscript, scoreReadback } from "./readbackScore";
import { buildSpokenAnswer } from "@/lib/spokenAnswer";

export type Part1AnswerMode = "level4" | "level5" | "peel";

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
}

/** ICAO 4/5: clear story beats — not full PEEL connector bank. */
export function level4StructureScore(transcript: string): number {
  const t = normalize(transcript);
  const sentences = transcript.split(/[.!?]+/).filter((s) => s.trim().length > 8);
  let score = 0;
  if (sentences.length >= 2) score += 25;
  if (sentences.length >= 3) score += 25;
  if (sentences.length >= 4) score += 15;
  if (/because|when|if|may happen|this may/.test(t)) score += 15;
  if (/then|after|overall|finally|follow|procedure|pilot/.test(t)) score += 20;
  return Math.min(100, score);
}

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
  return keywords.filter((kw) => !keywordMatches(transcript, kw));
}

function hasCallsignInReadback(transcript: string): boolean {
  const t = normalize(transcript);
  return /\banac\s*123\b/.test(t) || /\banac\s*wun\s*too\s*tree\b/.test(t);
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function localEvaluate(req: EvaluateRequest): EvaluateFeedback {
  const { transcript, modelAnswer, type, keywords = [], answerMode = "peel" } = req;
  const rawTranscript = transcript.trim();
  const shortConfirm =
    type === "part2-interaction" && isShortPhraseologyAnswer(modelAnswer);
  const trimmed =
    type === "part1"
      ? normalizeAviationTranscript(rawTranscript)
      : type === "part2-readback"
        ? normalizeReadbackTranscript(rawTranscript)
        : shortConfirm
          ? normalizeConfirmTranscript(rawTranscript)
          : rawTranscript;
  const transcriptFixed =
    type === "part1"
      ? trimmed !== rawTranscript
      : type === "part2-readback"
        ? trimmed !== normalizeReadbackTranscript(rawTranscript)
        : shortConfirm
          ? trimmed !== rawTranscript
          : false;

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
  const referenceAnswer = type === "part1" ? buildSpokenAnswer(modelAnswer) : modelAnswer;
  const readbackResult =
    type === "part2-readback" ? scoreReadback(trimmed, modelAnswer) : null;
  const confirmResult = shortConfirm ? scoreConfirmResponse(trimmed, modelAnswer) : null;
  const part1Content =
    type === "part1" ? scorePart1Content(trimmed, modelAnswer, keywords) : null;
  const content =
    type === "part2-readback" && readbackResult
      ? readbackResult.score
      : confirmResult != null
        ? confirmResult
      : type === "part1" && part1Content
        ? part1Content.score
        : overlapScore(trimmed, referenceAnswer);
  const structure =
    type === "part2-readback" && readbackResult
      ? readbackResult.score
      : confirmResult != null
        ? confirmResult
      : type === "part1"
        ? answerMode === "level4" || answerMode === "level5"
          ? level4StructureScore(trimmed)
          : peelStructureScore(trimmed)
        : markerScore(trimmed, PART2_MARKERS);
  const phraseology =
    type === "part2-readback" && readbackResult
      ? readbackResult.score
      : confirmResult != null
        ? confirmResult
      : type.startsWith("part2") || type.startsWith("part3")
        ? markerScore(trimmed, PART2_MARKERS)
        : structure;
  const missingKeywords = findMissingKeywords(trimmed, keywords);

  let lengthBonus = 0;
  if (type === "part1") {
    const shortForm = answerMode === "level4" || answerMode === "level5";
    if (shortForm) {
      if (words >= 35 && words <= 90) lengthBonus = 10;
      else if (words >= 25) lengthBonus = 0;
      else lengthBonus = -5;
    } else if (words >= 70 && words <= 140) lengthBonus = 15;
    else if (words >= 50) lengthBonus = 5;
    else lengthBonus = -10;
  } else {
    if (words >= 8) lengthBonus = 10;
  }

  const keywordPenalty = keywords.length
    ? Math.round((missingKeywords.length / keywords.length) * 15)
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

  if (scores.content >= 70) strengths.push("Boa cobertura das ideias e termos esperados.");
  if (type.startsWith("part3") && scores.content >= 65) {
    strengths.push("Boa organização do reporte de situação inesperada.");
  }
  if (type.startsWith("part4") && scores.structure >= 60) {
    strengths.push("Estrutura de descrição da imagem reconhecível.");
  }
  if (part1Content && part1Content.keywordCoverage >= 70) {
    strengths.push(`Keywords do card cobertas (${part1Content.keywordCoverage}%).`);
  }
  if (scores.structure >= 60) strengths.push("Estrutura reconhecível na resposta.");
  if (type.startsWith("part2") && hasCallsignInReadback(trimmed)) {
    strengths.push("Callsign ANAC 123 presente.");
  }
  if (readbackResult && readbackResult.score >= 75) {
    strengths.push(`Elementos da clearance: ${readbackResult.score}% cobertos.`);
  }
  if (readbackResult) {
    const foundLabels = readbackResult.elements.filter((e) => e.found).map((e) => e.label);
    if (foundLabels.length) {
      strengths.push(`Incluído: ${foundLabels.join(", ")}.`);
    }
  }
  if (words >= 80 && type === "part1") strengths.push("Duração de resposta adequada para Part 1.");

  if (scores.content < 60) {
    improvements.push(
      type === "part1"
        ? "Inclua as ideias do tema e as keywords do card — não precisa repetir a frase modelo."
        : type === "part2-readback"
          ? "Faltam elementos da clearance no readback — veja a lista abaixo."
          : type.startsWith("part3")
            ? "Inclua o problema, intenção e pedido ao ATC com clareza."
            : type.startsWith("part4")
              ? "Cubra tópico principal, cenário, posição, tempo/clima e opinião."
              : "Inclua mais ideias da resposta modelo e keywords.",
    );
  }
  if (scores.structure < 50 && type === "part1" && answerMode === "peel") {
    const missing = peelMissingConnectors(trimmed);
    improvements.push(...peelStructureFeedbackPt(missing));
  } else if (scores.structure < 50 && type === "part1") {
    improvements.push(
      "Organize em frases curtas: quando / por quê / o que fazer / depois (use as keywords do card).",
    );
  }
  if (missingKeywords.length) {
    improvements.push(`Keywords faltando: ${missingKeywords.slice(0, 5).join(", ")}.`);
  }
  if (type.startsWith("part2") && !hasCallsignInReadback(trimmed)) {
    improvements.push("Inclua o callsign ANAC 123 no readback (início ou fim).");
  }
  if (readbackResult?.missing.length) {
    improvements.push(`Elementos para reforçar: ${readbackResult.missing.join(", ")}.`);
  }
  if (words < 50 && type === "part1" && answerMode === "peel") {
    improvements.push("Resposta curta demais — na prova você tem ~45 segundos para falar.");
  }

  if (type === "part1") {
    const compare = compareTranscriptToModel(trimmed, modelAnswer, keywords);
    if (compare.unreliableTranscript) {
      improvements.unshift(
        "A transcrição saiu fraca nas keywords/ideias — pode ser pronúncia ou conteúdo faltando. Revise as keywords abaixo e treine palavras difíceis no banco de pronúncia.",
      );
    }
    if (transcriptFixed) {
      strengths.push(
        type === "part1"
          ? "Termos corrigidos na transcrição (ex.: missed approach, runway) — pronúncia pode estar OK mesmo quando o texto saiu errado."
          : "Números normalizados na transcrição — conteúdo avaliado pelos elementos da clearance.",
      );
    }
  }

  if (type === "part2-readback" && readbackResult) {
    improvements.push(
      "Readback: avaliamos elementos da clearance (altitude, squawk, fix, frequência, callsign), não texto idêntico.",
    );
  }

  improvements.push(
    "Pronúncia Azure vem do áudio; conteúdo/estrutura usam o texto transcrito — por isso podem divergir.",
  );

  return {
    scores,
    transcript: trimmed,
    rawTranscript: rawTranscript !== trimmed ? rawTranscript : undefined,
    summary: `Pontuação local ${scores.overall}/100 (transcrição automática).`,
    strengths,
    improvements,
    missingKeywords,
    source: "local",
    icaoLevel: estimateIcaoLevel(scores, type),
    suggestedAnswer: type === "part1" ? referenceAnswer : undefined,
    readbackElements: readbackResult?.elements,
  };
}
