import type { ReadbackScenario } from "@/lib/part2/types";

export const READBACK_SCENARIOS: ReadbackScenario[] = [
  {
    id: "rb01",
    title: "Departure clearance",
    instruction:
      "Helicol One Two Three, cleared to offshore platform via DELTA transition, climb and maintain three thousand feet, squawk four five two one, departure frequency one two four point three five.",
    chunks: [
      { type: "callsign", text: "Helicol One Two Three" },
      { type: "clearance", text: "cleared to offshore platform via DELTA transition" },
      { type: "altitude", text: "climb and maintain three thousand feet" },
      { type: "clearance", text: "squawk four five two one" },
      { type: "frequency", text: "departure frequency one two four point three five" },
    ],
    modelReadback:
      "Cleared to offshore platform via DELTA transition, climb and maintain three thousand feet, squawk four five two one, departure one two four point three five, Helicol One Two Three.",
  },
  {
    id: "rb02",
    title: "Approach vectors",
    instruction:
      "Helicol Four Five Six, turn left heading two seven zero, descend two thousand five hundred feet, reduce speed to eighty knots, expect ILS approach runway three four left.",
    chunks: [
      { type: "callsign", text: "Helicol Four Five Six" },
      { type: "heading", text: "turn left heading two seven zero" },
      { type: "altitude", text: "descend two thousand five hundred feet" },
      { type: "clearance", text: "reduce speed to eighty knots" },
      { type: "runway", text: "expect ILS approach runway three four left" },
    ],
    modelReadback:
      "Turn left heading two seven zero, descend two thousand five hundred feet, reduce speed to eighty knots, expect ILS runway three four left, Helicol Four Five Six.",
  },
  {
    id: "rb03",
    title: "Helipad landing clearance",
    instruction:
      "Helicol Seven Eight Nine, wind calm, cleared to land helipad Hotel Alpha, report final.",
    chunks: [
      { type: "callsign", text: "Helicol Seven Eight Nine" },
      { type: "clearance", text: "wind calm" },
      { type: "clearance", text: "cleared to land helipad Hotel Alpha" },
      { type: "clearance", text: "report final" },
    ],
    modelReadback:
      "Wind calm, cleared to land helipad Hotel Alpha, wilco, Helicol Seven Eight Nine.",
  },
  {
    id: "rb04",
    title: "Frequency change",
    instruction:
      "Helicol Two Two Two, contact approach on one one niner point two five, squawk ident.",
    chunks: [
      { type: "callsign", text: "Helicol Two Two Two" },
      { type: "frequency", text: "contact approach on one one niner point two five" },
      { type: "clearance", text: "squawk ident" },
    ],
    modelReadback:
      "Contact approach one one niner point two five, squawk ident, Helicol Two Two Two.",
  },
  {
    id: "rb05",
    title: "Hold short instruction",
    instruction:
      "Helicol Three Three Three, hold short runway one six, traffic on short final.",
    chunks: [
      { type: "callsign", text: "Helicol Three Three Three" },
      { type: "runway", text: "hold short runway one six" },
      { type: "clearance", text: "traffic on short final" },
    ],
    modelReadback:
      "Hold short runway one six, Helicol Three Three Three.",
  },
  {
    id: "rb06",
    title: "Route amendment",
    instruction:
      "Helicol Five Five Five, proceed direct WHISKEY, maintain four thousand feet, expect further vectors.",
    chunks: [
      { type: "callsign", text: "Helicol Five Five Five" },
      { type: "route", text: "proceed direct WHISKEY" },
      { type: "altitude", text: "maintain four thousand feet" },
      { type: "clearance", text: "expect further vectors" },
    ],
    modelReadback:
      "Proceed direct WHISKEY, maintain four thousand feet, expect further vectors, Helicol Five Five Five.",
  },
];
