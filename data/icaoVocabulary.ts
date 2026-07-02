import type { VocabularyTerm } from "@/lib/part2/types";
import { VOCABULARY_TERMS as PART2_TERMS } from "@/data/part2Vocabulary";

export type IcaoVocabCategoryId = "emergencies" | "landing-gear" | "atc" | "extended";

export type IcaoVocabularyItem = {
  id: string;
  term: string;
  meaning: string;
  example: string;
  category: string;
  categoryId: IcaoVocabCategoryId;
  /** Item difficulty 1 (easy) – 3 (hard) */
  difficulty: 1 | 2 | 3;
  levels: {
    1: string;
    2: string;
    3: string;
    4: string;
  };
};

export const ICAO_VOCAB_CATEGORIES = [
  { id: "emergencies" as const, label: "Emergencies" },
  { id: "landing-gear" as const, label: "Landing Gear" },
  { id: "atc" as const, label: "ATC Instructions" },
  { id: "extended" as const, label: "SDEA Extended" },
];

function article(phrase: string): string {
  const first = phrase.trim().toLowerCase();
  if (/^(a|e|i|o|u)/.test(first)) return "an";
  return "a";
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function core(
  id: string,
  categoryId: Exclude<IcaoVocabCategoryId, "extended">,
  difficulty: 1 | 2 | 3,
  term: string,
  meaning: string,
  example: string,
  levels?: Partial<IcaoVocabularyItem["levels"]>,
): IcaoVocabularyItem {
  const l3 = levels?.[3] ?? `We are experiencing ${article(term)} ${term}.`;
  const category =
    ICAO_VOCAB_CATEGORIES.find((c) => c.id === categoryId)?.label ?? categoryId;
  return {
    id,
    term,
    meaning,
    example,
    category,
    categoryId,
    difficulty,
    levels: {
      1: levels?.[1] ?? term,
      2: levels?.[2] ?? `${cap(term)}.`,
      3: l3,
      4:
        levels?.[4] ??
        `Departure, ANAC 123, Pan Pan Pan, ${l3.charAt(0).toLowerCase()}${l3.slice(1)}, requesting immediate return.`,
    },
  };
}

/** Core ICAO/SDEA emergency & ATC vocabulary from exam prep. */
export const ICAO_CORE_VOCABULARY: IcaoVocabularyItem[] = [
  core("icao-01", "emergencies", 2, "engine failure", "falha de motor", "We are experiencing an engine failure.", {
    2: "Engine failure detected.",
    4: "Departure, ANAC 123, Mayday Mayday Mayday, we have an engine failure and request immediate return.",
  }),
  core("icao-02", "emergencies", 2, "engine stall", "compressor stall", "We experienced an engine stall during climb."),
  core("icao-03", "emergencies", 2, "loss of power", "perda de potência", "We have a loss of power on the right engine."),
  core("icao-04", "emergencies", 2, "loss of thrust", "perda de empuxo", "We are experiencing a loss of thrust."),
  core("icao-05", "emergencies", 2, "low oil pressure", "pressão de óleo baixa", "We have low oil pressure on engine one."),
  core("icao-06", "emergencies", 2, "high oil temperature", "temperatura de óleo alta", "We have high oil temperature on the left engine."),
  core("icao-07", "emergencies", 2, "hydraulic leak", "vazamento hidráulico", "We are experiencing a hydraulic leak.", {
    2: "Hydraulic leak detected.",
  }),
  core("icao-08", "emergencies", 2, "hydraulic pressure dropping", "pressão hidráulica caindo", "Hydraulic pressure is dropping rapidly.", {
    3: "We are experiencing hydraulic pressure dropping.",
  }),
  core("icao-09", "emergencies", 2, "total electrical failure", "falha elétrica total", "We have a total electrical failure."),
  core("icao-10", "emergencies", 2, "battery power", "energia da bateria", "We are on battery power only.", {
    3: "We are operating on battery power only.",
  }),
  core("icao-11", "emergencies", 2, "GPS inoperative", "GPS inoperante", "Our GPS is inoperative, request radar vectors."),
  core("icao-12", "emergencies", 2, "FMS failure", "falha do FMS", "We have an FMS failure."),
  core("icao-13", "emergencies", 2, "smoke in the cabin", "fumaça na cabine", "We have smoke in the cabin."),
  core("icao-14", "emergencies", 2, "fumes in the cabin", "vapores na cabine", "We have fumes in the cabin."),
  core("icao-15", "emergencies", 1, "fire on board", "incêndio a bordo", "Mayday, we have fire on board."),
  core("icao-16", "emergencies", 1, "fire in the hold", "incêndio no porão", "We have fire in the hold."),
  core("icao-17", "emergencies", 2, "bird strike", "colisão com aves", "We had a bird strike on departure."),
  core("icao-18", "emergencies", 2, "windshear", "cisalhamento de vento", "We encountered windshear on final approach."),
  core("icao-19", "emergencies", 2, "microburst", "microexplosão", "We experienced a microburst on approach."),
  core("icao-20", "emergencies", 2, "severe turbulence", "turbulência severa", "We are in severe turbulence."),
  core("icao-21", "emergencies", 2, "moderate turbulence", "turbulência moderada", "We expect moderate turbulence ahead."),
  core("icao-22", "emergencies", 2, "icing conditions", "condições de gelo", "We are entering icing conditions.", {
    3: "We are experiencing icing conditions at this altitude.",
  }),
  core("icao-23", "emergencies", 2, "low fuel", "combustível baixo", "We are low on fuel and need priority."),
  core("icao-24", "emergencies", 2, "fuel starvation", "falta de combustível", "We suspect fuel starvation on engine two."),
  core("icao-25", "emergencies", 2, "fuel dumping", "descarte de combustível", "We need to dump fuel before returning."),
  core("icao-26", "landing-gear", 2, "landing gear stuck", "trem de pouso travado", "Our landing gear is stuck in the up position."),
  core("icao-27", "landing-gear", 2, "main gear collapsed", "trem principal colapsado", "The main gear collapsed on landing."),
  core("icao-28", "landing-gear", 2, "belly landing", "pouso de barriga", "We need to make a belly landing."),
  core("icao-29", "landing-gear", 2, "wheels-up landing", "pouso sem trem", "We are preparing for a wheels-up landing."),
  core("icao-30", "emergencies", 2, "pilot incapacitation", "incapacitação do piloto", "We have pilot incapacitation in the cockpit.", {
    2: "Pilot incapacitation in the cockpit.",
    3: "We have pilot incapacitation in the cockpit.",
    4: "Departure, ANAC 123, Pan Pan Pan, pilot incapacitation in the cockpit, requesting priority to land.",
  }),
  core("icao-31", "emergencies", 2, "passenger passed out", "passageiro desmaiou", "A passenger passed out in row twelve.", {
    2: "Passenger passed out on board.",
    3: "A passenger has passed out on board.",
    4: "Departure, ANAC 123, Pan Pan Pan, a passenger has passed out on board, requesting medical assistance and priority to land.",
  }),
  core("icao-32", "emergencies", 2, "heart attack", "ataque cardíaco", "We have a passenger with a suspected heart attack.", {
    2: "Suspected heart attack on board.",
    3: "We have a passenger with a suspected heart attack on board.",
    4: "Departure, ANAC 123, Pan Pan Pan, medical emergency — passenger with suspected heart attack — requesting priority and immediate return.",
  }),
  core("icao-33", "emergencies", 2, "seizure", "convulsão", "A passenger is having a seizure.", {
    2: "Passenger seizure on board.",
    3: "A passenger is having a seizure on board.",
    4: "Departure, ANAC 123, Pan Pan Pan, a passenger is having a seizure, requesting medical assistance on landing.",
  }),
  core("icao-34", "emergencies", 2, "medical assistance", "assistência médica", "Request medical assistance on landing.", {
    3: "We request medical assistance on arrival.",
    4: "Recife Tower, ANAC 123, we request medical assistance on landing.",
  }),
  core("icao-35", "emergencies", 1, "emergency landing", "pouso de emergência", "We need an emergency landing at the nearest airport."),
  core("icao-36", "emergencies", 1, "emergency evacuation", "evacuação de emergência", "We may need an emergency evacuation on the ground."),
  core("icao-37", "emergencies", 2, "divert", "desviar", "We need to divert to Salvador.", {
    3: "We would like to divert to Salvador.",
    4: "Recife Approach, ANAC 123, we would like to divert to Salvador due to a hydraulic leak.",
  }),
  core("icao-38", "emergencies", 2, "priority to land", "prioridade para pousar", "We request priority to land.", {
    3: "We request priority to land due to low fuel.",
  }),
  core("icao-39", "atc", 2, "vectors to final", "vetoração para o final", "Request vectors to final.", {
    3: "We would like vectors to final for runway one eight.",
    4: "Recife Approach, ANAC 123, request vectors to final runway one eight.",
  }),
  core("icao-40", "atc", 2, "maintain runway heading", "manter proa da pista", "Maintain runway heading until passing three thousand feet.", {
    2: "Maintain runway heading.",
    3: "The controller instructed me to maintain runway heading.",
    4: "Recife Tower, ANAC 123, maintaining runway heading.",
  }),
  core("icao-41", "atc", 2, "descend at your discretion", "descer à sua discrição", "Descend at your discretion to flight level one zero zero.", {
    2: "Descend at your discretion.",
    3: "The controller cleared me to descend at my discretion.",
  }),
  core("icao-42", "atc", 2, "line up and wait", "alinhar e aguardar", "Cleared to line up and wait runway three six.", {
    3: "The controller cleared me to line up and wait.",
    4: "Holding in position runway three six, line up and wait, ANAC 123.",
  }),
  core("icao-43", "atc", 2, "squawk ident", "squawk ident", "Squawk ident, maintain runway heading.", {
    3: "The controller asked me to squawk ident.",
    4: "Squawk ident, ANAC 123.",
  }),
  core("icao-44", "atc", 2, "resume own navigation", "retomar navegação", "Resume own navigation to destination.", {
    3: "The controller cleared me to resume own navigation.",
  }),
  core("icao-45", "atc", 2, "resume conventional navigation", "retomar navegação convencional", "Resume conventional navigation.", {
    3: "The controller instructed me to resume conventional navigation.",
    4: "Recife Approach, ANAC 123, resuming conventional navigation.",
  }),
];

function fromPart2Term(term: VocabularyTerm): IcaoVocabularyItem {
  const l3 = term.example;
  return {
    id: `ext-${term.id}`,
    term: term.term,
    meaning: term.meaning,
    example: term.example,
    category: "SDEA Extended",
    categoryId: "extended",
    difficulty: term.importance >= 5 ? 1 : term.importance >= 4 ? 2 : 3,
    levels: {
      1: term.term,
      2: `${cap(term.term)}.`,
      3: l3,
      4: l3.includes("ANAC")
        ? l3
        : `Departure, ANAC 123, Pan Pan Pan, ${l3.charAt(0).toLowerCase()}${l3.slice(1)}, requesting immediate return.`,
    },
  };
}

const coreTerms = new Set(ICAO_CORE_VOCABULARY.map((v) => v.term.toLowerCase()));

export const ICAO_EXTENDED_VOCABULARY: IcaoVocabularyItem[] = PART2_TERMS.filter(
  (t) => !coreTerms.has(t.term.toLowerCase()),
).map(fromPart2Term);

export const ICAO_VOCABULARY: IcaoVocabularyItem[] = [
  ...ICAO_CORE_VOCABULARY,
  ...ICAO_EXTENDED_VOCABULARY,
];

export function getLevelText(item: IcaoVocabularyItem, level: 1 | 2 | 3 | 4): string {
  return item.levels[level];
}

export function getCategoryLabel(categoryId: IcaoVocabCategoryId): string {
  return ICAO_VOCAB_CATEGORIES.find((c) => c.id === categoryId)?.label ?? categoryId;
}

export function difficultyLabel(level: 1 | 2 | 3): string {
  return `Level ${level}`;
}
