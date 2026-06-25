import type { VocabularyTerm } from "@/lib/part2/types";

/** Key Part 2 terms from the 4 real SDEA exams (23C–26C). */
export const VOCABULARY_TERMS: VocabularyTerm[] = [
  {
    id: "v01",
    term: "squawk ident",
    definition: "Transponder identification — ATC asks you to activate ident on your transponder.",
    example: "Squawk ident, maintain runway heading, ANAC 123.",
  },
  {
    id: "v02",
    term: "maintain runway heading",
    definition: "Continue flying on the runway's magnetic heading after takeoff.",
    example: "Maintain runway heading until passing three thousand feet.",
  },
  {
    id: "v03",
    term: "hold short",
    definition: "Stop before entering a runway or taxiway intersection.",
    example: "Taxi via Romeo, Foxtrot and hold short of Bravo.",
  },
  {
    id: "v04",
    term: "line up and wait",
    definition: "Position on the runway and wait for takeoff clearance.",
    example: "Cleared to backtrack, line up and wait runway two four.",
  },
  {
    id: "v05",
    term: "flight level",
    definition: "Altitude expressed in hundreds of feet based on standard pressure (1013 hPa).",
    example: "Descend to flight level zero five zero.",
  },
  {
    id: "v06",
    term: "Mayday",
    definition: "Distress call indicating grave and imminent danger.",
    example: "Mayday Mayday Mayday, Manaus Approach, ANAC 123. Fire in the cabin.",
  },
  {
    id: "v07",
    term: "NEGATIVE",
    definition: "Standard phraseology to correct a misunderstanding — 'no' or 'that is not correct'.",
    example: "NEGATIVE, we have fire in the cabin, not engine fire.",
  },
  {
    id: "v08",
    term: "AFFIRM",
    definition: "Standard phraseology to confirm — 'yes, that is correct'.",
    example: "AFFIRM. The minor needs medical assistance, ANAC 123.",
  },
  {
    id: "v09",
    term: "say again",
    definition: "Request repetition — allowed only once per clearance in the SDEA exam.",
    example: "Can you say again, please?",
  },
  {
    id: "v10",
    term: "missed approach / going around",
    definition: "Discontinue the landing and climb away from the runway.",
    example: "Recife Tower, there is a truck on the runway. Missed approach, ANAC 123.",
  },
  {
    id: "v11",
    term: "runway incursion",
    definition: "Unauthorized presence on a runway — vehicle, person or aircraft.",
    example: "We are going around because of a runway incursion.",
  },
  {
    id: "v12",
    term: "hydraulic failure",
    definition: "Loss of hydraulic system pressure affecting flight controls or landing gear.",
    example: "We lost our left hydraulic system and need the emergency hydraulic system.",
  },
  {
    id: "v13",
    term: "engine high vibration",
    definition: "Abnormal vibration indicating possible engine damage.",
    example: "We have an engine high vibration. We need to land as soon as possible.",
  },
  {
    id: "v14",
    term: "low fuel",
    definition: "Fuel quantity below planned reserves requiring priority landing.",
    example: "We are running low on fuel and need to land within one five minutes.",
  },
  {
    id: "v15",
    term: "circling approach",
    definition: "Visual maneuver after an instrument approach to land on a different runway.",
    example: "Continue approach runway one eight, followed by circling to runway three six.",
  },
  {
    id: "v16",
    term: "reported speech",
    definition: "Telling the examiner what ATC said, using past tense.",
    example: "The controller instructed me to turn right heading one six zero.",
  },
  {
    id: "v17",
    term: "hold position",
    definition: "Stop immediately and remain in place on the ground.",
    example: "Holding position, ANAC 123.",
  },
  {
    id: "v18",
    term: "vectors",
    definition: "ATC-provided headings to guide the aircraft to a point or approach.",
    example: "Request vectors to Galeao.",
  },
  {
    id: "v19",
    term: "cabin pressure loss",
    definition: "Depressurization requiring descent and possible emergency landing.",
    example: "We are losing cabin pressure. We need to return to Bogota.",
  },
  {
    id: "v20",
    term: "GPS failure",
    definition: "Loss of GPS navigation requiring conventional navigation.",
    example: "Miami Tower, we lost our GPS, ANAC 123.",
  },
];
