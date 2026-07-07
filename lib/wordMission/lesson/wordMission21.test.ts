import { beforeEach, describe, expect, it } from "vitest";
import { ICAO_VOCABULARY } from "@/data/icaoVocabulary";
import {
  buildWordMissionLesson,
  findVocabItemForTerm,
  lessonSpeakTextForLevel,
  totalLessonSteps,
} from "@/lib/wordMission/lesson/lessonEngine";
import { shouldEnableRecording, stepIdForLevel } from "@/lib/wordMission/lesson/simpleFlow";
import { naturalIcaoSpeakText } from "@/lib/wordMission/lesson/levelTexts";
import { handleWordMissionInterrupt } from "@/lib/wordMission/lesson/interruptHandler";
import { createLessonContext } from "@/lib/wordMission/lesson/simpleFlow";
import { resetCaptainLessonMemoryForTests } from "@/lib/captainDelta/infinity/lessonMemory";
import { WORD_MISSION_STEP_ORDER } from "@/lib/wordMission/lesson/types";
import { vaultWordFromVocabTerm } from "@/lib/wordMission/vaultAdapter";

describe("Word Mission 2.1 — simplified lesson", () => {
  it("renders four steps only", () => {
    const lesson = buildWordMissionLesson("fly direct");
    expect(lesson.steps).toHaveLength(4);
    expect(WORD_MISSION_STEP_ORDER).toEqual([
      "meaning",
      "operational_use",
      "say_it",
      "icao_practice",
    ]);
    expect(totalLessonSteps()).toBe(4);
  });

  it("hold short operational previews pilot readback on Say It", () => {
    const lesson = buildWordMissionLesson("hold short");
    const ops = lesson.steps[1]!;
    const sayIt = lesson.steps[2]!;
    expect(ops.detail).toMatch(/pilot readback/i);
    expect(ops.detail).toMatch(/Holding short runway one eight, PT-ABC/i);
    expect(sayIt.speakText).toMatch(/Holding short runway one eight, PT-ABC/i);
    expect(sayIt.captainLine).toMatch(/complete pilot readback/i);
  });

  it("fly direct examples come from premium knowledge", () => {
    const lesson = buildWordMissionLesson("fly direct");
    expect(lesson.knowledgeReview?.curated).toBe(true);
    expect(lesson.steps[0]!.captainLine).toMatch(/waypoint|specified/i);
    expect(lesson.steps[1]!.detail).toMatch(/Say It/i);
    expect(lesson.steps[1]!.detail).toMatch(/NITUX/i);
    expect(lesson.steps[2]!.speakText).toMatch(/direct NITUX/i);
    expect(lesson.steps[3]!.captainLine).toMatch(/fly direct/i);
  });

  it("continue approach uses premium example", () => {
    const lesson = buildWordMissionLesson("continue approach");
    expect(lesson.steps[1]!.detail).toMatch(/Continuing approach/i);
    expect(lesson.steps[3]!.captainLine).toMatch(/continue approach/i);
  });

  it("record enabled only in Say It and ICAO Practice", () => {
    expect(shouldEnableRecording("meaning")).toBe(false);
    expect(shouldEnableRecording("operational_use")).toBe(false);
    expect(shouldEnableRecording("say_it")).toBe(true);
    expect(shouldEnableRecording("icao_practice")).toBe(true);
    expect(stepIdForLevel(3)).toBe("say_it");
    expect(stepIdForLevel(4)).toBe("icao_practice");
  });

  it("normal ATC terms do not generate Pan Pan emergency L4", () => {
    const goAround = findVocabItemForTerm("go around")!;
    const l4 = naturalIcaoSpeakText(goAround);
    expect(l4).not.toMatch(/Pan Pan|Mayday|immediate return/i);
    const vault = vaultWordFromVocabTerm(goAround);
    expect(vault.contextPack.fragment).not.toMatch(/Pan Pan|immediate return/i);
  });

  it("emergency terms may use emergency phraseology in L4", () => {
    const engine = ICAO_VOCABULARY.find((t) => /engine failure/i.test(t.term))!;
    const l4 = naturalIcaoSpeakText(engine);
    expect(l4).toMatch(/Mayday|engine failure/i);
  });

  it("vault adapter uses simple lesson speak texts", () => {
    const item = findVocabItemForTerm("fly direct")!;
    const lesson = buildWordMissionLesson(item);
    const vault = vaultWordFromVocabTerm(item);
    expect(vault.contextPack.sentence).toBe(lessonSpeakTextForLevel(lesson, 3));
    expect(vault.contextPack.fragment).toBe(lessonSpeakTextForLevel(lesson, 4));
  });
});

describe("Word Mission 2.1 — interrupts", () => {
  beforeEach(() => resetCaptainLessonMemoryForTests());

  it("returns to lesson after interrupt", () => {
    const lesson = buildWordMissionLesson("go around");
    const ctx = createLessonContext(lesson);
    const result = handleWordMissionInterrupt("What does divert mean?", ctx);
    expect(result.message).toMatch(/Back to our lesson/i);
    expect(result.resumeStepId).toBe("meaning");
  });
});
