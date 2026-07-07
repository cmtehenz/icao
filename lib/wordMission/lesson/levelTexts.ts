import type { IcaoVocabularyItem } from "@/data/icaoVocabulary";

const EMERGENCY_TERM = /mayday|pan pan|engine failure|fire on board|emergency|incapacitation|evacuation/i;

export function isEmergencyTerm(item: IcaoVocabularyItem): boolean {
  return item.categoryId === "emergencies" || EMERGENCY_TERM.test(item.term);
}

/** Natural L4 speak target — no Pan Pan unless the term is emergency-related. */
export function naturalIcaoSpeakText(item: IcaoVocabularyItem): string {
  const term = item.term;
  if (isEmergencyTerm(item)) {
    if (/engine failure/i.test(term)) {
      return "Mayday, ANAC 123, we have an engine failure, requesting immediate return.";
    }
    if (/fire/i.test(term)) {
      return "Mayday, ANAC 123, we have fire on board, requesting immediate landing.";
    }
    if (/divert/i.test(term)) {
      return "ANAC 123, we would like to divert due to a technical problem.";
    }
    return `Pan Pan Pan, ANAC 123, we have ${term}, requesting priority.`;
  }

  if (item.categoryId === "atc") {
    return `Recife Tower, ANAC 123, roger, ${term}.`;
  }

  return `In Part 2, I would explain when pilots use ${term} in operations.`;
}

export function naturalSayPhrase(item: IcaoVocabularyItem): string {
  const l2 = item.levels[2]?.trim();
  if (l2 && l2.length < 80 && !/pan pan|mayday|immediate return/i.test(l2)) {
    return l2.replace(/\.$/, "");
  }
  const l3 = item.levels[3]?.trim();
  if (l3 && l3.length < 80 && !/pan pan|mayday|immediate return/i.test(l3)) {
    return l3.replace(/\.$/, "");
  }
  return item.term.charAt(0).toUpperCase() + item.term.slice(1);
}
