import type { IcaoVocabularyItem } from "@/data/icaoVocabulary";
import { ICAO_VOCABULARY } from "@/data/icaoVocabulary";
import { KnowledgeEngine } from "@/lib/knowledge/engine";
import { buildKnowledgeReviewMeta } from "@/lib/knowledge/review";
import { lessonDefFromVocabularyEntry } from "@/lib/knowledge/wordMissionAdapter";
import { getCuratedContent } from "@/lib/wordMission/lesson/curatedContent";
import type { KnowledgeSource } from "@/lib/wordMission/lesson/knowledgeSource";
import type { SyncKnowledgeProvider } from "@/lib/wordMission/lesson/enrichment";
import { enrichFromSyncProviders, noopKnowledgeProvider } from "@/lib/wordMission/lesson/enrichment";
import { skybraryPatchForTerm } from "@/lib/wordMission/lesson/skybraryProvider";
import { naturalIcaoSpeakText, naturalSayPhrase, isEmergencyTerm } from "@/lib/wordMission/lesson/levelTexts";
import {
  WORD_MISSION_STEP_LABELS,
  type WordMissionLesson,
  type WordMissionStep,
  type WordMissionStepId,
} from "@/lib/wordMission/lesson/types";
import type { KnowledgeReviewMeta } from "@/lib/knowledge/review";

const DEFAULT_CALLSIGN = "PT-ABC";

type SimpleWordDef = {
  meaningEn: string;
  meaningPt: string;
  whenUsed: string;
  example: string;
  sayPhrase: string;
  icaoQuestion: string;
  icaoSpeakText?: string;
  knowledgeSource?: KnowledgeSource;
  review?: KnowledgeReviewMeta;
};

const SIMPLE_CURATED: Record<string, SimpleWordDef> = {
  "fly direct": {
    meaningEn: "Fly straight to a waypoint.",
    meaningPt: "Voar diretamente para um ponto.",
    whenUsed: "ATC may say this to shorten your route.",
    example: "Helicopter PT-ABC, fly direct NITUX.",
    sayPhrase: "Fly direct NITUX.",
    icaoQuestion: "When would ATC ask a pilot to fly direct?",
    icaoSpeakText: "When traffic allows a shorter route to the destination.",
  },
  continue: {
    meaningEn: "Keep doing what you are already doing.",
    meaningPt: "Continuar o que já está fazendo.",
    whenUsed: "ATC may use this when you should keep doing what you are doing.",
    example: "Continue approach runway one eight.",
    sayPhrase: "Continue approach runway one eight.",
    icaoQuestion: "What should a pilot do after receiving 'continue approach'?",
    icaoSpeakText: "Continue the approach as cleared.",
  },
  expect: {
    meaningEn: "Prepare for a future clearance or action.",
    meaningPt: "Preparar-se para uma autorização futura.",
    whenUsed: "ATC uses this to prepare you for a future clearance.",
    example: "Expect descent after passing CHARLIE.",
    sayPhrase: "Expect descent after passing CHARLIE.",
    icaoQuestion: "Why is it important to understand expected clearances?",
    icaoSpeakText: "It helps the crew prepare for the next ATC instruction.",
  },
  heading: {
    meaningEn: "The direction the aircraft nose is pointing, in degrees.",
    meaningPt: "A proa da aeronave, em graus.",
    whenUsed: "Tower often assigns headings right after departure.",
    example: "Helicopter PT-ABC, fly heading zero nine zero.",
    sayPhrase: "Fly heading zero nine zero.",
    icaoQuestion: "What would you read back after a heading assignment?",
    icaoSpeakText: "Heading zero nine zero, PT-ABC.",
  },
};

function splitMeaning(meaning: string): { en: string; pt: string } {
  const isPt = /[áàâãéêíóôõúç]/i.test(meaning);
  if (isPt) return { en: meaning, pt: meaning };
  return { en: meaning, pt: meaning };
}

function fallbackDef(item: IcaoVocabularyItem): SimpleWordDef {
  const curated = getCuratedContent(item.term, item);
  const { en, pt } = splitMeaning(item.meaning);
  const example = curated.towerLine.includes("PT-ABC")
    ? curated.towerLine
    : `${DEFAULT_CALLSIGN}, ${naturalSayPhrase(item)}.`;

  return {
    meaningEn: curated.meaningEn || en,
    meaningPt: curated.meaningPt || pt,
    whenUsed: curated.operationalContext || curated.whenUsed,
    example,
    sayPhrase: naturalSayPhrase(item),
    icaoQuestion:
      curated.conversationPrompts[0] ??
      (item.categoryId === "atc"
        ? `When would ATC use "${item.term}"?`
        : `When would a pilot use "${item.term}"?`),
    icaoSpeakText: naturalIcaoSpeakText(item),
    review: buildKnowledgeReviewMeta(null, { fallbackUsed: true }),
  };
}

function applySkybrary(def: SimpleWordDef, term: string, item?: IcaoVocabularyItem): SimpleWordDef {
  const patch = skybraryPatchForTerm(term, item);
  if (!patch) return def;
  return {
    ...def,
    whenUsed: patch.whenUsed ?? def.whenUsed,
    icaoQuestion: patch.icaoQuestion ?? def.icaoQuestion,
    icaoSpeakText: patch.icaoSpeakText ?? def.icaoSpeakText,
    knowledgeSource: patch.knowledgeSource,
    review: def.review,
  };
}

function resolveDef(term: string, item?: IcaoVocabularyItem): SimpleWordDef {
  const knowledge = KnowledgeEngine.lookupVocabulary(term);
  if (knowledge) {
    return lessonDefFromVocabularyEntry(knowledge.entry);
  }

  const hand = SIMPLE_CURATED[term.trim().toLowerCase()];
  if (hand) {
    return {
      ...hand,
      review: buildKnowledgeReviewMeta(null, { fallbackUsed: true }),
    };
  }
  if (item) return applySkybrary(fallbackDef(item), term, item);
  return applySkybrary(
    {
      meaningEn: `Operational use of "${term}".`,
      meaningPt: `Uso operacional de "${term}".`,
      whenUsed: "Used on radio in real operations.",
      example: `${DEFAULT_CALLSIGN}, ${term}.`,
      sayPhrase: term.charAt(0).toUpperCase() + term.slice(1),
      icaoQuestion: `When would a pilot use "${term}"?`,
      icaoSpeakText: `I would use ${term} in a normal operational call.`,
      review: buildKnowledgeReviewMeta(null, { fallbackUsed: true }),
    },
    term,
    item,
  );
}

function step(
  id: WordMissionStepId,
  captainLine: string,
  options: { detail?: string; speakText?: string; recordHere: boolean },
): WordMissionStep {
  return {
    id,
    label: WORD_MISSION_STEP_LABELS[id],
    captainLine,
    detail: options.detail,
    speakText: options.speakText,
    recordHere: options.recordHere,
  };
}

function buildSteps(def: SimpleWordDef): WordMissionStep[] {
  return [
    step("meaning", def.meaningEn, {
      detail: def.meaningPt,
      recordHere: false,
    }),
    step("operational_use", def.whenUsed, {
      detail: `Example: "${def.example}"`,
      recordHere: false,
    }),
    step("say_it", "Say this line — calm radio pace.", {
      detail: def.sayPhrase,
      speakText: def.sayPhrase,
      recordHere: true,
    }),
    step("icao_practice", def.icaoQuestion, {
      detail: def.icaoSpeakText,
      speakText: def.icaoSpeakText ?? def.sayPhrase,
      recordHere: true,
    }),
  ];
}

export function findVocabItemForTerm(term: string): IcaoVocabularyItem | undefined {
  const key = term.trim().toLowerCase();
  return ICAO_VOCABULARY.find((v) => v.term.toLowerCase() === key);
}

/** Word Mission 2.1 — four-step practical lesson. */
export function buildWordMissionLesson(
  termOrItem: string | IcaoVocabularyItem,
  options?: { callsign?: string; providers?: SyncKnowledgeProvider[] },
): WordMissionLesson {
  const item = typeof termOrItem === "string" ? findVocabItemForTerm(termOrItem) : termOrItem;
  const term = typeof termOrItem === "string" ? termOrItem.trim() : termOrItem.term;
  enrichFromSyncProviders(term, options?.providers ?? [noopKnowledgeProvider], item);
  const def = resolveDef(term, item);

  return {
    term,
    termId: item?.id ?? null,
    category: item?.category ?? "Operational",
    steps: buildSteps(def),
    callsign: options?.callsign ?? DEFAULT_CALLSIGN,
    knowledgeSource: def.knowledgeSource,
    knowledgeReview:
      def.review ?? buildKnowledgeReviewMeta(null, { fallbackUsed: true }),
  };
}

export function buildWordMissionBrief(termOrItem: string | IcaoVocabularyItem): {
  message: string;
  speechText: string;
} {
  const lesson = buildWordMissionLesson(termOrItem);
  const meaning = lesson.steps[0]!;
  const message = `${meaning.captainLine} ${meaning.detail ?? ""}`.trim();
  return { message, speechText: meaning.captainLine };
}

export function lessonSpeakTextForLevel(
  lesson: WordMissionLesson,
  level: 1 | 2 | 3 | 4,
): string {
  const step = lesson.steps[level - 1]!;
  return step.speakText ?? step.detail ?? step.captainLine;
}

export function totalLessonSteps(): number {
  return 4;
}

export { isEmergencyTerm };
