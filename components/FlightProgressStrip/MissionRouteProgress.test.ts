import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const missionRoutes = [
  { name: "PronunciationTrainerApp", file: "components/PronunciationTrainerApp.tsx" },
  { name: "VocabularyTrainerApp", file: "components/VocabularyTrainer/VocabularyTrainerApp.tsx" },
  { name: "FlashcardApp", file: "components/FlashcardApp.tsx" },
  { name: "Part2TrainerApp", file: "components/Part2Trainer/Part2TrainerApp.tsx" },
  { name: "MissionRecallApp", file: "components/MissionRecall/MissionRecallApp.tsx" },
  { name: "FlightDebriefApp", file: "components/FlightDebrief/FlightDebriefApp.tsx" },
];

describe("Mission progress strip in layout (not duplicated per route)", () => {
  for (const route of missionRoutes) {
    it(`${route.name} does not embed MissionRouteProgress`, () => {
      const source = readFileSync(path.join(process.cwd(), route.file), "utf-8");
      expect(source).not.toMatch(/MissionRouteProgress/);
    });
  }
});
