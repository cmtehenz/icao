import type { VocabularyTerm } from "@/lib/part2/types";

export const VOCABULARY_TERMS: VocabularyTerm[] = [
  {
    id: "v01",
    term: "engine failure",
    definition: "Loss of engine power or complete engine shutdown.",
    example: "We are experiencing a possible engine failure after takeoff.",
  },
  {
    id: "v02",
    term: "hydraulic leak",
    definition: "Loss of hydraulic fluid affecting flight controls or systems.",
    example: "We have a hydraulic leak and low hydraulic pressure.",
  },
  {
    id: "v03",
    term: "low oil pressure",
    definition: "Oil pressure below normal operating limits.",
    example: "We are experiencing low oil pressure on the main gearbox.",
  },
  {
    id: "v04",
    term: "fire on board",
    definition: "Fire detected inside or outside the aircraft.",
    example: "We have a fire on board in the baggage compartment.",
  },
  {
    id: "v05",
    term: "smoke in the cabin",
    definition: "Visible smoke or fumes in the passenger or cockpit area.",
    example: "We are experiencing smoke in the cabin.",
  },
  {
    id: "v06",
    term: "bird strike",
    definition: "Collision between the aircraft and one or more birds.",
    example: "We had a bird strike during departure.",
  },
  {
    id: "v07",
    term: "windshear",
    definition: "Sudden change in wind speed or direction affecting lift.",
    example: "Windshear was reported on final approach.",
  },
  {
    id: "v08",
    term: "severe turbulence",
    definition: "Strong and sudden air movement causing control difficulty.",
    example: "We are encountering severe turbulence at this altitude.",
  },
  {
    id: "v09",
    term: "low fuel",
    definition: "Fuel quantity approaching minimum required reserves.",
    example: "We are experiencing low fuel due to stronger headwinds.",
  },
  {
    id: "v10",
    term: "fuel starvation",
    definition: "Engine stops due to fuel not reaching the engine, though fuel may remain onboard.",
    example: "Fuel starvation may occur if the wrong tank is selected.",
  },
  {
    id: "v11",
    term: "landing gear stuck",
    definition: "Landing gear fails to extend, retract, or lock properly.",
    example: "Our landing gear is stuck in the up position.",
  },
  {
    id: "v12",
    term: "pilot incapacitation",
    definition: "A crew member becomes unable to perform their duties.",
    example: "We are experiencing pilot incapacitation in the right seat.",
  },
  {
    id: "v13",
    term: "medical emergency",
    definition: "Serious illness or injury requiring urgent assistance.",
    example: "We have a medical emergency with a passenger on board.",
  },
  {
    id: "v14",
    term: "total electrical failure",
    definition: "Complete loss of electrical power in the aircraft.",
    example: "We have a total electrical failure and limited avionics.",
  },
  {
    id: "v15",
    term: "squawk ident",
    definition: "ATC instruction to activate the transponder identification feature.",
    example: "The controller instructed me to squawk ident.",
  },
  {
    id: "v16",
    term: "maintain runway heading",
    definition: "Fly the runway centerline heading until further instruction.",
    example: "Maintain runway heading and climb to five hundred feet.",
  },
  {
    id: "v17",
    term: "vectors to final",
    definition: "ATC-provided headings to intercept the final approach course.",
    example: "Turn left heading two seven zero, vectors to final.",
  },
  {
    id: "v18",
    term: "descend at your discretion",
    definition: "Pilot may choose when and how to descend within limits.",
    example: "Descend at your discretion to three thousand feet.",
  },
  {
    id: "v19",
    term: "line up and wait",
    definition: "Taxi onto the runway and wait for takeoff clearance.",
    example: "Line up and wait runway one six.",
  },
];
