import { beforeEach, describe, expect, it, vi } from "vitest";
import { buildMissionRecallItems } from "@/lib/missionRecall/buildMissionRecall";

vi.mock("@/lib/studyTime", () => ({
  todayKey: () => "2026-07-05",
}));

vi.mock("@/lib/dailyExamRotation", () => ({
  getTodayExamVersion: () => "23C",
  getTodayPart1CardNums: () => ["1"],
}));

vi.mock("@/lib/pronunciationDailyMission", () => ({
  getOrCreatePronunciationDailyMission: () => ({
    date: "2026-07-05",
    words: ["turbulence", "clearance", "approach", "mayday", "squawk"],
    completedWords: ["turbulence", "clearance", "approach", "mayday", "squawk"],
  }),
}));

vi.mock("@/lib/vocabDailyMission", () => ({
  getOrCreateVocabDailyMission: () => ({
    date: "2026-07-05",
    examVersion: "23C",
    termIds: ["v-atc-1", "v-emerg-1", "v-gear-1"],
    completedIds: ["v-atc-1", "v-emerg-1", "v-gear-1"],
  }),
}));

vi.mock("@/lib/part1DailyMission", () => ({
  getOrCreatePart1DailyMission: () => ({
    date: "2026-07-05",
    examVersion: "23C",
    cards: [{ cardNum: "1", shadowDone: true, coachDone: true }],
  }),
}));

vi.mock("@/lib/cards", () => ({
  CARDS: [
    {
      num: "1",
      question: "What are the main responsibilities of a first officer?",
      opener: "",
      ideas: [],
      example: "",
      conclusion: "",
      answer: "",
      vocab: [],
      targetWords: 0,
    },
  ],
}));

vi.mock("@/data/icaoVocabulary", () => ({
  ICAO_VOCABULARY: [
    {
      id: "v-atc-1",
      term: "crew coordination",
      meaning: "communication between pilots",
      example: "",
      category: "ATC",
      categoryId: "atc",
      difficulty: 1,
      levels: { 1: "", 2: "", 3: "", 4: "" },
    },
    {
      id: "v-emerg-1",
      term: "mayday",
      meaning: "distress call",
      example: "",
      category: "Emergencies",
      categoryId: "emergencies",
      difficulty: 1,
      levels: { 1: "", 2: "", 3: "", 4: "" },
    },
    {
      id: "v-gear-1",
      term: "gear",
      meaning: "landing gear",
      example: "",
      category: "Landing Gear",
      categoryId: "landing-gear",
      difficulty: 1,
      levels: { 1: "", 2: "", 3: "", 4: "" },
    },
  ],
}));

vi.mock("@/data/exams/part2Data", () => ({
  getSituationsByExam: () => [
    {
      id: "23C-s1",
      title: "Oakland departure",
      readback: { atcMessage: "climb five thousand" },
      interaction: { prompt: "report gear problem" },
      atcFollowUp: { atcMessage: "confirm gear problem" },
    },
    {
      id: "23C-s2",
      title: "Manaus fire",
      readback: { atcMessage: "maintain runway heading" },
      interaction: { prompt: "report fire" },
      atcFollowUp: { atcMessage: "descend flight level zero five zero" },
    },
  ],
}));

describe("buildMissionRecallItems", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("builds items from today's mission material", () => {
    const items = buildMissionRecallItems("2026-07-05");
    expect(items.length).toBeGreaterThan(0);
    expect(items.some((i) => i.stage === "pronunciation")).toBe(true);
    expect(items.some((i) => i.stage === "vocabulary")).toBe(true);
    expect(items.some((i) => i.stage === "part1")).toBe(true);
    expect(items.some((i) => i.stage === "part2")).toBe(true);
    expect(items.some((i) => i.stage === "surprise")).toBe(true);
  });

  it("uses only today mission source refs", () => {
    const items = buildMissionRecallItems("2026-07-05");
    for (const item of items) {
      expect(item.sourceRef).toMatch(/^(pronunciation|vocabulary|part1|part2|surprise):/);
    }
    const pronItems = items.filter((i) => i.stage === "pronunciation");
    for (const item of pronItems) {
      expect(item.prompt.toLowerCase()).toContain(
        item.sourceRef.replace("pronunciation:", ""),
      );
    }
  });

  it("does not include unrelated content ids", () => {
    const items = buildMissionRecallItems("2026-07-05");
    const refs = items.map((i) => i.sourceRef).join(" ");
    expect(refs).not.toContain("unrelated");
    expect(refs).not.toContain("24C-s1");
  });
});
