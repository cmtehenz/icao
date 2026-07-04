import { getSituationsByExam } from "@/data/exams/part2Data";
import { getPart3Scenario } from "@/data/simulado/part3Data";
import { getPart4Picture } from "@/data/simulado/part4Data";
import { SIMULADO_ACTIVE_PARTS, SIMULADO_PART1_QUESTIONS } from "@/lib/simulado/config";
import { examAudioUrl } from "@/lib/exams/audio";
import { CARDS } from "@/lib/cards";
import type { ExamVersion } from "@/lib/exams/types";
import type { SimuladoPart, SimuladoSessionConfig, SimuladoStep, SimulationMode } from "@/lib/simulado/types";

function partsForMode(mode: SimulationMode, customParts?: SimuladoPart[]): SimuladoPart[] {
  if (mode === "custom" && customParts?.length) {
    return customParts.filter((p) => SIMULADO_ACTIVE_PARTS.includes(p));
  }
  if (mode === "full") return [...SIMULADO_ACTIVE_PARTS];
  if (mode === "part1") return [1];
  if (mode === "part2") return [2];
  if (mode === "part3") return [3];
  if (mode === "part4") return [4];
  return [1];
}

function cardByNum(num: string) {
  return CARDS.find((c) => c.num === num);
}

export function buildSimuladoSteps(config: SimuladoSessionConfig): SimuladoStep[] {
  const { examVersion, mode, customParts } = config;
  const parts = partsForMode(mode, customParts);
  const steps: SimuladoStep[] = [];

  if (parts.includes(1)) {
    steps.push({
      kind: "instruction",
      id: "p1-intro",
      part: 1,
      label: "Part 1 — Introduction",
      text: "Part One. Aviation Topics. I will ask you three questions. Please answer as fully as you can.",
    });

    SIMULADO_PART1_QUESTIONS.forEach((item, i) => {
      const card = cardByNum(item.cardNum);
      if (!card) return;
      const model = card.answerLevel5 ?? card.answerLevel4 ?? card.answer;
      steps.push({
        kind: "examiner",
        id: `p1-q${item.cardNum}`,
        part: 1,
        label: `Part 1 · Question ${i + 1}`,
        text: item.question,
      });
      steps.push({
        kind: "record",
        id: `p1-a${item.cardNum}`,
        part: 1,
        label: `Your answer · Q${i + 1}`,
        question: item.question,
        modelAnswer: model,
        evaluateType: "part1",
        keywords: card.keywords ?? card.vocab ?? [],
        prepSeconds: 5,
        answerSeconds: 45,
      });
    });
  }

  if (parts.includes(2)) {
    steps.push({
      kind: "instruction",
      id: "p2-intro",
      part: 2,
      label: "Part 2 — Introduction",
      text: "Part Two. Interacting as a Pilot. Listen to the controller and read back. Then respond to the situations. You may take notes.",
    });

    const situations = getSituationsByExam(examVersion);
    for (const s of situations) {
      const sid = s.id;
      steps.push({
        kind: "instruction",
        id: `${sid}-ctx`,
        part: 2,
        label: `Situation ${s.situationNumber}`,
        text: `Situation ${s.situationNumber}. ${s.context}`,
      });
      steps.push({
        kind: "examiner",
        id: `${sid}-rb-inst`,
        part: 2,
        label: "Readback instruction",
        text: `Listen to ${s.readback.atcFacility} and read back.`,
      });
      steps.push({
        kind: "listen",
        id: `${sid}-rb-audio`,
        part: 2,
        label: `ATC clearance · Situation ${s.situationNumber}`,
        audioSrc: examAudioUrl(s.examVersion, s.readback.audioTrack),
      });
      steps.push({
        kind: "record",
        id: `${sid}-rb`,
        part: 2,
        label: "Your readback",
        question: `Read back: ${s.readback.atcMessage}`,
        modelAnswer: s.readback.modelReadback,
        evaluateType: "part2-readback",
      });
      steps.push({
        kind: "notes",
        id: `${sid}-notes`,
        part: 2,
        label: "Notes",
        prompt: "You may take notes if needed before the interaction.",
      });
      steps.push({
        kind: "examiner",
        id: `${sid}-int-prompt`,
        part: 2,
        label: "Interaction prompt",
        text: s.interaction.prompt,
      });
      steps.push({
        kind: "record",
        id: `${sid}-int`,
        part: 2,
        label: "Your report to ATC",
        question: s.interaction.prompt,
        modelAnswer: s.interaction.modelReport,
        evaluateType: "part2-interaction",
      });
      steps.push({
        kind: "listen",
        id: `${sid}-fu-audio`,
        part: 2,
        label: "ATC follow-up",
        audioSrc: examAudioUrl(s.examVersion, s.atcFollowUp.audioTrack),
      });
      steps.push({
        kind: "record",
        id: `${sid}-corr`,
        part: 2,
        label: "AFFIRM / NEGATIVE",
        question: s.atcFollowUp.atcMessage,
        modelAnswer: s.atcFollowUp.modelCorrection,
        evaluateType: "part2-interaction",
      });
      steps.push({
        kind: "examiner",
        id: `${sid}-rep-q`,
        part: 2,
        label: "Reported speech question",
        text: "What did the controller say?",
      });
      steps.push({
        kind: "record",
        id: `${sid}-rep`,
        part: 2,
        label: "Reported speech",
        question: "What did the controller say?",
        modelAnswer: s.reportedSpeech.modelAnswer,
        evaluateType: "part2-reported",
      });
    }
  }

  if (parts.includes(3)) {
    const p3 = getPart3Scenario(examVersion);
    steps.push({
      kind: "instruction",
      id: "p3-intro",
      part: 3,
      label: "Part 3 — Introduction",
      text: "Part Three. Unexpected Situations. Listen to the situation, take notes if you wish, report to ATC, and answer the follow-up question clearly.",
    });
    steps.push({
      kind: "instruction",
      id: "p3-ctx",
      part: 3,
      label: p3.title,
      text: p3.context,
    });
    if (p3.audioSrc) {
      steps.push({
        kind: "listen",
        id: "p3-audio",
        part: 3,
        label: "Situation audio",
        audioSrc: p3.audioSrc,
      });
    }
    steps.push({
      kind: "notes",
      id: "p3-notes",
      part: 3,
      label: "Your notes",
      prompt: "Write down key information before you report.",
    });
    steps.push({
      kind: "examiner",
      id: "p3-prompt",
      part: 3,
      label: "Examiner",
      text: p3.examinerPrompt,
    });
    steps.push({
      kind: "record",
      id: "p3-report",
      part: 3,
      label: "Your report",
      question: p3.examinerPrompt,
      modelAnswer: p3.modelReport,
      evaluateType: "part3-report",
      keywords: p3.keywords,
    });
    steps.push({
      kind: "examiner",
      id: "p3-fu-q",
      part: 3,
      label: "Follow-up",
      text: p3.followUpQuestion,
    });
    steps.push({
      kind: "record",
      id: "p3-fu",
      part: 3,
      label: "Follow-up answer",
      question: p3.followUpQuestion,
      modelAnswer: p3.modelFollowUp,
      evaluateType: "part3-followup",
      keywords: p3.keywords,
    });
  }

  if (parts.includes(4)) {
    const p4 = getPart4Picture(examVersion);
    steps.push({
      kind: "instruction",
      id: "p4-intro",
      part: 4,
      label: "Part 4 — Introduction",
      text: "Part Four. Picture Description. Look at the picture. Describe what you see using position vocabulary, weather, and a short opinion.",
    });
    steps.push({
      kind: "picture",
      id: "p4-pic",
      part: 4,
      label: p4.title,
      imageSrc: p4.imageSrc,
      imageAlt: p4.imageAlt,
      examinerPrompt: p4.describePrompt,
    });
    steps.push({
      kind: "examiner",
      id: "p4-desc-prompt",
      part: 4,
      label: "Describe the picture",
      text: p4.describePrompt,
    });
    steps.push({
      kind: "record",
      id: "p4-desc",
      part: 4,
      label: "Your description",
      question: p4.describePrompt,
      modelAnswer: p4.modelDescription,
      evaluateType: "part4-description",
      keywords: p4.structureHints,
    });
    p4.followUpQuestions.forEach((fq, i) => {
      steps.push({
        kind: "examiner",
        id: `p4-fu-q${i}`,
        part: 4,
        label: `Follow-up ${i + 1}`,
        text: fq.question,
      });
      steps.push({
        kind: "record",
        id: `p4-fu-a${i}`,
        part: 4,
        label: `Answer ${i + 1}`,
        question: fq.question,
        modelAnswer: fq.modelAnswer,
        evaluateType: "part4-question",
      });
    });
  }

  return steps;
}

export function modeLabel(mode: SimulationMode, customParts?: SimuladoPart[]): string {
  if (mode === "full") return "Full Exam · Parts 1–2";
  if (mode === "custom" && customParts?.length) {
    return `Custom · Part ${customParts.join(" + ")}`;
  }
  if (mode === "part1") return "Part 1 only";
  if (mode === "part2") return "Part 2 only";
  if (mode === "part3") return "Part 3 only";
  if (mode === "part4") return "Part 4 only";
  return mode;
}

export function examVersionFromMeta(examId: string): ExamVersion {
  const map: Record<string, ExamVersion> = {
    exam1: "23C",
    exam2: "24C",
    exam3: "25C",
    exam4: "26C",
  };
  return map[examId] ?? "23C";
}
