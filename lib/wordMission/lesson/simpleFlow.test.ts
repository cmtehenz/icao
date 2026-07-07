import { describe, expect, it } from "vitest";
import { buildWordMissionLesson } from "@/lib/wordMission/lesson/lessonEngine";
import {
  buildStepCaptainCoaching,
  wordMissionStepActionHint,
} from "@/lib/wordMission/lesson/simpleFlow";

describe("wordMissionStepActionHint", () => {
  it("tells student not to record on operational use", () => {
    const hint = wordMissionStepActionHint(
      "operational_use",
      "Holding short runway one eight, PT-ABC.",
    );
    expect(hint).toMatch(/no recording/i);
    expect(hint).toMatch(/Say It/i);
    expect(hint).toMatch(/full pilot readback/i);
  });

  it("names the full readback on Say It", () => {
    const phrase = "Holding short runway one eight, PT-ABC.";
    const hint = wordMissionStepActionHint("say_it", phrase);
    expect(hint).toMatch(/Record this complete pilot readback/i);
    expect(hint).toContain(phrase);
  });
});

describe("buildStepCaptainCoaching", () => {
  it("includes action hint in floating captain speech", () => {
    const lesson = buildWordMissionLesson("hold short");
    const step = lesson.steps[1]!;
    const speak = lesson.steps[2]!.speakText!;
    const coaching = buildStepCaptainCoaching(step, speak);
    expect(coaching.text).toMatch(/no recording/i);
    expect(coaching.speechText).toMatch(/Say It/i);
  });
});
