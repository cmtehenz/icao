import type { ExamVersion } from "@/lib/exams/types";

export type Part4Picture = {
  id: string;
  examVersion: ExamVersion;
  title: string;
  imageSrc: string;
  imageAlt: string;
  describePrompt: string;
  modelDescription: string;
  followUpQuestions: Array<{ question: string; modelAnswer: string }>;
  structureHints: string[];
};

/** Placeholder aviation scenes — replace with real SDEA pictures when available. */
export const PART4_PICTURES: Part4Picture[] = [
  {
    id: "23C-p4",
    examVersion: "23C",
    title: "Airport apron scene",
    imageSrc: "/simulado/pictures/apron.svg",
    imageAlt: "Aircraft on apron with ground vehicles",
    describePrompt: "Please describe the picture in as much detail as you can.",
    modelDescription:
      "In the foreground there is a white commercial aircraft parked on the apron. To the left, a fuel truck is positioned near the wing. In the background, I can see the terminal building and the control tower. The weather appears to be clear with good visibility, and it looks like daytime. I think the aircraft is preparing for departure because ground equipment is around it.",
    followUpQuestions: [
      {
        question: "Where is the fuel truck?",
        modelAnswer: "The fuel truck is on the left side of the aircraft, near the wing.",
      },
      {
        question: "What is the weather like?",
        modelAnswer: "The weather looks clear with good visibility and daylight conditions.",
      },
    ],
    structureHints: ["main topic", "scenario", "position", "weather/time", "hypothesis"],
  },
  {
    id: "24C-p4",
    examVersion: "24C",
    title: "Runway and traffic",
    imageSrc: "/simulado/pictures/runway.svg",
    imageAlt: "Runway with aircraft on final approach",
    describePrompt: "Describe what you see in the picture.",
    modelDescription:
      "This picture shows a runway with an aircraft on short final. In the foreground there is grass beside the runway. In the background, there are clouds and a grey sky, so the weather may be changing. On the right, I can see the threshold markings clearly. I believe the aircraft is about to land because it is very low and aligned with the runway.",
    followUpQuestions: [
      {
        question: "What is the aircraft doing?",
        modelAnswer: "The aircraft appears to be on final approach, about to land.",
      },
      {
        question: "How is the weather?",
        modelAnswer: "The sky looks grey with clouds, so visibility may be reduced.",
      },
    ],
    structureHints: ["main topic", "scenario", "position", "weather/time", "hypothesis"],
  },
  {
    id: "25C-p4",
    examVersion: "25C",
    title: "Helicopter operations",
    imageSrc: "/simulado/pictures/helicopter.svg",
    imageAlt: "Helicopter hovering near helipad",
    describePrompt: "Please describe the picture.",
    modelDescription:
      "In the centre of the picture, a helicopter is hovering close to a helipad. In the background, there are buildings and trees. The lighting suggests late afternoon. On the ground, I can see people near the landing area. I think the helicopter is completing an approach to land because it is very low and over the helipad.",
    followUpQuestions: [
      {
        question: "Where is the helicopter?",
        modelAnswer: "The helicopter is hovering over the helipad in the centre of the picture.",
      },
    ],
    structureHints: ["main topic", "scenario", "position", "weather/time", "hypothesis"],
  },
  {
    id: "26C-p4",
    examVersion: "26C",
    title: "Hangar maintenance",
    imageSrc: "/simulado/pictures/hangar.svg",
    imageAlt: "Aircraft inside maintenance hangar",
    describePrompt: "Describe the picture in detail.",
    modelDescription:
      "The main topic is maintenance inside a hangar. In the foreground, an aircraft is parked with open panels and equipment around it. On the right, mechanics are working near the engine. The lighting is artificial because it is indoors. I believe the aircraft is undergoing scheduled maintenance.",
    followUpQuestions: [
      {
        question: "What are the mechanics doing?",
        modelAnswer: "They appear to be working on the engine area on the right side of the aircraft.",
      },
    ],
    structureHints: ["main topic", "scenario", "position", "weather/time", "hypothesis"],
  },
];

export function getPart4Picture(version: ExamVersion): Part4Picture {
  return PART4_PICTURES.find((p) => p.examVersion === version) ?? PART4_PICTURES[0];
}
