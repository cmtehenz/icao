import type { IcaoVocabularyItem } from "@/data/icaoVocabulary";
import { ICAO_VOCABULARY } from "@/data/icaoVocabulary";
import { clampSentences } from "@/lib/captainDelta/infinity/qualityGate";
import type { AviationKnowledgeEnrichment, CuratedWordContent, SyncKnowledgeProvider } from "@/lib/wordMission/lesson/enrichment";
import { enrichFromSyncProviders, noopKnowledgeProvider } from "@/lib/wordMission/lesson/enrichment";
import { getCuratedContent } from "@/lib/wordMission/lesson/curatedContent";
import {
  WORD_MISSION_PHASE_ORDER,
  WORD_MISSION_PHASE_LABELS,
  type WordMissionLesson,
  type WordMissionPhaseContent,
  type WordMissionPhaseId,
} from "@/lib/wordMission/lesson/types";

const DEFAULT_CALLSIGN = "PT-ABC";

function mergeContent(base: CuratedWordContent, patch: AviationKnowledgeEnrichment): CuratedWordContent {
  return {
    ...base,
    missionBrief: patch.missionBrief ?? base.missionBrief,
    meaningEn: patch.meaningEn ?? base.meaningEn,
    meaningPt: patch.meaningPt ?? base.meaningPt,
    operationalContext: patch.operationalContext ?? base.operationalContext,
    whoSaysIt: patch.whoSaysIt ?? base.whoSaysIt,
    whenUsed: patch.whenUsed ?? base.whenUsed,
    whyUsed: patch.whyUsed ?? base.whyUsed,
    towerLine: patch.towerLine ?? base.towerLine,
    towerExplanation: patch.towerExplanation ?? base.towerExplanation,
    pronunciationChunks: patch.pronunciationChunks ?? base.pronunciationChunks,
    commonMistakes: patch.commonMistakes ?? base.commonMistakes,
    didYouKnow: patch.didYouKnow ?? base.didYouKnow,
    comparePairs: patch.comparePairs ?? base.comparePairs,
    captainStory: patch.captainStory ?? base.captainStory,
    icaoConnection: patch.icaoConnection ?? base.icaoConnection,
    conversationPrompts: patch.conversationPrompts ?? base.conversationPrompts,
    microChallenges: patch.microChallenges ?? base.microChallenges,
  };
}

function phase(
  id: WordMissionPhaseId,
  message: string,
  options?: { studentTurn?: boolean; recordHere?: boolean; speechLimit?: number },
): WordMissionPhaseContent {
  const limit = options?.speechLimit ?? (id === "mission_brief" ? 2 : 3);
  return {
    id,
    label: WORD_MISSION_PHASE_LABELS[id],
    message,
    speechText: clampSentences(message, limit),
    studentTurn: options?.studentTurn,
    recordHere: options?.recordHere,
  };
}

function buildPhases(content: CuratedWordContent, term: string): WordMissionPhaseContent[] {
  const compareText =
    content.comparePairs.length > 0
      ? content.comparePairs.map((p) => `${p.a} vs ${p.b} — ${p.note}`).join(" ")
      : "Compare with similar phraseology in your operator manual.";

  const pronunciationDemo = [
    "Listen carefully.",
    ...content.pronunciationChunks,
    "Now together.",
    content.pronunciationChunks[content.pronunciationChunks.length - 1] ?? term,
  ].join(" ");

  const storyText = content.captainStory
    ? content.captainStory
    : "Every word you learn on radio builds the calm voice you'll use on a real sortie.";

  const completeText = [
    "Today you learned:",
    "Meaning, operational use, pronunciation, and ICAO application.",
    `You'll hear "${term}" many times during your flying career — not just in an exam.`,
  ].join(" ");

  return [
    phase("mission_brief", content.missionBrief, { speechLimit: 2 }),
    phase("meaning", `Meaning: ${content.meaningEn} Portuguese: ${content.meaningPt}.`),
    phase(
      "operational_context",
      `${content.operationalContext} Who says it? ${content.whoSaysIt} When? ${content.whenUsed} Why? ${content.whyUsed}`,
    ),
    phase(
      "real_example",
      `Tower: "${content.towerLine}" ${content.towerExplanation}`,
    ),
    phase("pronunciation", pronunciationDemo, { recordHere: true }),
    phase("common_mistakes", content.commonMistakes.join(" ")),
    phase("did_you_know", `Did you know? ${content.didYouKnow}`),
    phase("compare", compareText),
    phase("captain_story", storyText, { speechLimit: 3 }),
    phase("icao_connection", content.icaoConnection),
    phase(
      "micro_conversation",
      `${content.conversationPrompts[0] ?? "What would you say as pilot?"} Your turn — answer out loud.`,
      { studentTurn: true },
    ),
    phase(
      "micro_challenge",
      `${content.microChallenges[0] ?? `Use "${term}" in your own sentence.`}`,
      { studentTurn: true, recordHere: true },
    ),
    phase("mission_complete", completeText),
  ];
}

export function findVocabItemForTerm(term: string): IcaoVocabularyItem | undefined {
  const key = term.trim().toLowerCase();
  return ICAO_VOCABULARY.find((v) => v.term.toLowerCase() === key);
}

export function findVocabItemById(id: string): IcaoVocabularyItem | undefined {
  return ICAO_VOCABULARY.find((v) => v.id === id);
}

/** Word Mission 2.0 — build the full 13-phase micro-flight lesson. */
export function buildWordMissionLesson(
  termOrItem: string | IcaoVocabularyItem,
  options?: {
    callsign?: string;
    providers?: SyncKnowledgeProvider[];
  },
): WordMissionLesson {
  const item = typeof termOrItem === "string" ? findVocabItemForTerm(termOrItem) : termOrItem;
  const term = typeof termOrItem === "string" ? termOrItem.trim() : termOrItem.term;
  const base = getCuratedContent(term, item);
  const patch = enrichFromSyncProviders(term, options?.providers ?? [noopKnowledgeProvider], item);
  const content = mergeContent(base, patch);

  return {
    term,
    termId: item?.id ?? null,
    category: item?.category ?? "Operational",
    phases: buildPhases(content, term),
    callsign: options?.callsign ?? DEFAULT_CALLSIGN,
  };
}

export function buildWordMissionBrief(termOrItem: string | IcaoVocabularyItem): {
  message: string;
  speechText: string;
} {
  const lesson = buildWordMissionLesson(termOrItem);
  const brief = lesson.phases[0]!;
  return { message: brief.message, speechText: brief.speechText };
}

export function lessonPhaseById(
  lesson: WordMissionLesson,
  id: WordMissionPhaseId,
): WordMissionPhaseContent | undefined {
  return lesson.phases.find((p) => p.id === id);
}

export function totalLessonPhases(): number {
  return WORD_MISSION_PHASE_ORDER.length;
}
