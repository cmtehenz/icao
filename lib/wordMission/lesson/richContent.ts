import type { DevKnowledgeEntry } from "@/lib/knowledge/devKnowledge/types";
import type { WordMissionStepId } from "@/lib/wordMission/lesson/types";

export type WordMissionRichContent = {
  meaningEn: string;
  meaningPt: string;
  operationalMeaning?: string;
  whyAtcUsesIt?: string[];
  atcPhraseology?: string[];
  pilotReadbacks?: string[];
  brazilianMistakes?: string;
  pronunciationCoaching?: string;
  relatedConcepts?: string[];
  references?: DevKnowledgeEntry["references"];
  memoryTrick?: string;
};

export function richContentFromEntry(entry: DevKnowledgeEntry): WordMissionRichContent {
  return {
    meaningEn: entry.meaningEn,
    meaningPt: entry.meaningPt,
    operationalMeaning: entry.operationalMeaning ?? entry.whenUsed,
    whyAtcUsesIt: entry.whyAtcUsesIt,
    atcPhraseology: entry.atcPhraseology,
    pilotReadbacks: entry.pilotReadbacks,
    brazilianMistakes: entry.brazilianMistakes,
    pronunciationCoaching: entry.pronunciationCoaching,
    relatedConcepts: entry.relatedConcepts,
    references: entry.references,
    memoryTrick: entry.memoryTrick,
  };
}

export type RichPanelSection = {
  id: string;
  title: string;
  body?: string;
  bullets?: string[];
  quotes?: string[];
  links?: DevKnowledgeEntry["references"];
  chips?: string[];
};

export function richPanelsForStep(
  stepId: WordMissionStepId,
  rich: WordMissionRichContent | undefined,
): RichPanelSection[] {
  if (!rich) return [];

  switch (stepId) {
    case "meaning":
      return [
        rich.operationalMeaning && {
          id: "operational",
          title: "Operational meaning",
          body: rich.operationalMeaning,
        },
        rich.whyAtcUsesIt?.length && {
          id: "why-atc",
          title: "Why ATC uses it",
          bullets: rich.whyAtcUsesIt,
        },
        rich.memoryTrick && {
          id: "memory",
          title: "Memory trick",
          body: rich.memoryTrick,
        },
        rich.brazilianMistakes && {
          id: "mistakes",
          title: "Common Brazilian mistakes",
          body: rich.brazilianMistakes,
        },
        rich.relatedConcepts?.length && {
          id: "related",
          title: "Related concepts",
          chips: rich.relatedConcepts,
        },
        rich.references?.length && {
          id: "refs",
          title: "References",
          links: rich.references,
        },
      ].filter(Boolean) as RichPanelSection[];

    case "operational_use":
      return [
        rich.atcPhraseology?.length && {
          id: "atc",
          title: "Real ATC phraseology",
          quotes: rich.atcPhraseology,
        },
        rich.pilotReadbacks?.length && {
          id: "readbacks",
          title: "Professional pilot readbacks",
          quotes: rich.pilotReadbacks,
        },
        rich.whyAtcUsesIt?.length && {
          id: "why-atc",
          title: "Why ATC uses it",
          bullets: rich.whyAtcUsesIt,
        },
      ].filter(Boolean) as RichPanelSection[];

    case "say_it":
      return [
        rich.pronunciationCoaching && {
          id: "pronunciation",
          title: "Pronunciation coaching",
          body: rich.pronunciationCoaching,
        },
        rich.brazilianMistakes && {
          id: "mistakes",
          title: "Readback pitfalls",
          body: rich.brazilianMistakes,
        },
      ].filter(Boolean) as RichPanelSection[];

    case "icao_practice":
      return [
        rich.brazilianMistakes && {
          id: "mistakes",
          title: "Speaking exam pitfalls",
          body: rich.brazilianMistakes,
        },
        rich.relatedConcepts?.length && {
          id: "related",
          title: "Related concepts",
          chips: rich.relatedConcepts,
        },
        rich.references?.length && {
          id: "refs",
          title: "References",
          links: rich.references,
        },
      ].filter(Boolean) as RichPanelSection[];

    default:
      return [];
  }
}
