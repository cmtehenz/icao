import { PART1_BY_EXAM } from "./part1";
import { getSituationsByExam } from "./part2Data";
import { getPart3Scenario } from "@/data/simulado/part3Data";
import { getPart4Picture } from "@/data/simulado/part4Data";
import type { ExamVersion } from "@/lib/exams/types";
import { CARDS } from "@/lib/cards";
import { examAudioUrl } from "@/lib/exams/audio";

const VERSION: ExamVersion = "23C";

export const EXAM1 = {
  id: "exam1",
  version: VERSION,
  title: "Prova 1 — 23C",
  part1: PART1_BY_EXAM[VERSION].map((num) => {
    const card = CARDS.find((c) => c.num === num)!;
    return {
      num,
      question: card.question,
      modelAnswer: card.answerLevel5 ?? card.answerLevel4 ?? card.answer,
      keywords: card.keywords ?? card.vocab ?? [],
    };
  }),
  part2: getSituationsByExam(VERSION).map((s) => ({
    id: s.id,
    title: s.title,
    context: s.context,
    readbackAudio: examAudioUrl(s.examVersion, s.readback.audioTrack),
    readbackAtc: s.readback.atcMessage,
    modelReadback: s.readback.modelReadback,
    interactionPrompt: s.interaction.prompt,
    modelReport: s.interaction.modelReport,
    followUpAudio: examAudioUrl(s.examVersion, s.atcFollowUp.audioTrack),
    followUpAtc: s.atcFollowUp.atcMessage,
    modelCorrection: s.atcFollowUp.modelCorrection,
    reportedSpeechModel: s.reportedSpeech.modelAnswer,
  })),
  part3: getPart3Scenario(VERSION),
  part4: getPart4Picture(VERSION),
};
