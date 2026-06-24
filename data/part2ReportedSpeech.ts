import type { ReportedSpeechScenario } from "@/lib/part2/types";

export const REPORTED_SPEECH_SCENARIOS: ReportedSpeechScenario[] = [
  {
    id: "rs01",
    title: "Altitude instruction",
    atcMessage: "Helicol One Two Three, climb and maintain four thousand feet.",
    speechType: "instructed",
    template: "The controller instructed me to...",
    modelAnswer:
      "The controller instructed me to climb and maintain four thousand feet.",
  },
  {
    id: "rs02",
    title: "Landing clearance",
    atcMessage: "Helicol Four Five Six, wind two four zero at one zero knots, cleared to land runway three four left.",
    speechType: "cleared",
    template: "The controller cleared me to...",
    modelAnswer:
      "The controller cleared me to land runway three four left with wind two four zero at one zero knots.",
  },
  {
    id: "rs03",
    title: "Fuel confirmation",
    atcMessage: "Helicol Seven Eight Nine, confirm you have enough fuel to divert to alternate.",
    speechType: "asked",
    template: "The controller asked me to confirm if...",
    modelAnswer:
      "The controller asked me to confirm if I had enough fuel to divert to the alternate.",
  },
  {
    id: "rs04",
    title: "Traffic information",
    atcMessage: "Helicol Two Two Two, be advised, traffic is a helicopter at your one o'clock, two miles, same altitude.",
    speechType: "informed",
    template: "The controller informed me that...",
    modelAnswer:
      "The controller informed me that there was a helicopter at my one o'clock, two miles, same altitude.",
  },
  {
    id: "rs05",
    title: "Heading change",
    atcMessage: "Helicol Three Three Three, turn right heading three six zero, vectors to final.",
    speechType: "instructed",
    template: "The controller instructed me to...",
    modelAnswer:
      "The controller instructed me to turn right heading three six zero for vectors to final.",
  },
  {
    id: "rs06",
    title: "Hold short",
    atcMessage: "Helicol Five Five Five, hold short runway one six, landing traffic on short final.",
    speechType: "instructed",
    template: "The controller instructed me to...",
    modelAnswer:
      "The controller instructed me to hold short runway one six because there was landing traffic on short final.",
  },
  {
    id: "rs07",
    title: "Squawk ident",
    atcMessage: "Helicol Six Six Six, squawk ident.",
    speechType: "instructed",
    template: "The controller instructed me to...",
    modelAnswer: "The controller instructed me to squawk ident.",
  },
  {
    id: "rs08",
    title: "Weather update",
    atcMessage: "Helicol Eight Eight Eight, be advised, windshear reported on final runway two seven.",
    speechType: "informed",
    template: "The controller informed me that...",
    modelAnswer:
      "The controller informed me that windshear had been reported on final runway two seven.",
  },
];
