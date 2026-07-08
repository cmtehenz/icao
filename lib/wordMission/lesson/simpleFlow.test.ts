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
    expect(hint).toMatch(/Say It/i);
    expect(hint).toMatch(/full readback/i);
  });

  it("names the recording task on Say It without repeating the phrase in the hint", () => {
    const phrase = "Holding short runway one eight, ANAC123.";
    const hint = wordMissionStepActionHint("say_it", phrase);
    expect(hint).toMatch(/Record/i);
    expect(hint).not.toContain(phrase);
  });
});

describe("buildStepCaptainCoaching", () => {
  it("includes full instructor script in captain speech without UI hints", () => {
    const lesson = buildWordMissionLesson("hold short");
    const step = lesson.steps[1]!;
    const coaching = buildStepCaptainCoaching(step);
    expect(coaching.text).not.toMatch(/Tap Continue/i);
    expect(coaching.speechText).toMatch(/taxiing your H130/i);
  });

  it("caps voice script length for reliable TTS", () => {
    const lesson = buildWordMissionLesson("continue approach");
    const step = lesson.steps[0]!;
    const coaching = buildStepCaptainCoaching(step);
    expect(coaching.text.length).toBeGreaterThan(coaching.speechText.length);
    expect(coaching.speechText.length).toBeLessThanOrEqual(1400);
    expect(coaching.speechText.length).toBeGreaterThan(20);
  });
});
