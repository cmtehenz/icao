import type { ExamVersion } from "@/lib/exams/types";

export type Part3Scenario = {
  id: string;
  examVersion: ExamVersion;
  title: string;
  context: string;
  audioSrc?: string;
  examinerPrompt: string;
  modelReport: string;
  followUpQuestion: string;
  modelFollowUp: string;
  keywords: string[];
};

export const PART3_SCENARIOS: Part3Scenario[] = [
  {
    id: "23C-p3",
    examVersion: "23C",
    title: "Bird strike after takeoff",
    context: "Shortly after takeoff you hear a loud impact and notice minor vibrations.",
    examinerPrompt:
      "You have an unexpected situation. Report to ATC what happened and what you intend to do.",
    modelReport:
      "Departure, ANAC 123, we may have had a bird strike after takeoff. We are assessing the situation and would like to level off at five thousand feet while we run the checklist.",
    followUpQuestion: "What information did you give to the controller?",
    modelFollowUp:
      "I reported a possible bird strike, that we were assessing the situation, and that we wanted to level off at five thousand feet while we ran the checklist.",
    keywords: ["bird strike", "assess", "checklist", "level off", "report"],
  },
  {
    id: "24C-p3",
    examVersion: "24C",
    title: "Passenger medical emergency",
    context: "A passenger becomes seriously ill during cruise.",
    examinerPrompt: "Report the unexpected situation to ATC and state your intentions.",
    modelReport:
      "Pan Pan Pan, Control, ANAC 123, medical emergency on board. Request priority handling and vectors for the nearest suitable airport.",
    followUpQuestion: "What did you request from ATC?",
    modelFollowUp:
      "I declared Pan Pan for a medical emergency and requested priority handling and vectors to the nearest suitable airport.",
    keywords: ["medical emergency", "priority", "vectors", "Pan Pan", "nearest airport"],
  },
  {
    id: "25C-p3",
    examVersion: "25C",
    title: "Smoke in cockpit",
    context: "You detect smoke in the cockpit during approach.",
    examinerPrompt: "Inform ATC about the unexpected situation and your intentions.",
    modelReport:
      "Mayday Mayday Mayday, Approach, ANAC 123, smoke in the cockpit. Request immediate vectors to land on the nearest runway.",
    followUpQuestion: "How did you describe the situation?",
    modelFollowUp:
      "I declared Mayday, reported smoke in the cockpit, and requested immediate vectors to land on the nearest runway.",
    keywords: ["smoke", "cockpit", "Mayday", "vectors", "land"],
  },
  {
    id: "26C-p3",
    examVersion: "26C",
    title: "Loss of communication",
    context: "You lose radio contact in controlled airspace.",
    examinerPrompt: "Explain how you would handle this unexpected situation and what you would report when communication is restored.",
    modelReport:
      "If I lost communication, I would squawk seven six zero zero, follow the last assigned clearance, and continue to the destination. When contact was restored, I would report the communication failure and confirm my intentions.",
    followUpQuestion: "What procedures would you follow?",
    modelFollowUp:
      "I would squawk seven six zero zero, comply with the last clearance, and report the communication failure when contact was restored.",
    keywords: ["communication failure", "squawk 7600", "last clearance", "report", "intentions"],
  },
];

export function getPart3Scenario(version: ExamVersion): Part3Scenario {
  return PART3_SCENARIOS.find((s) => s.examVersion === version) ?? PART3_SCENARIOS[0];
}
