import { describe, expect, it } from "vitest";
import {
  canStopRecognizer,
  isRecognizerBusy,
  shouldDrainRecognizerOnStop,
} from "@/lib/azure/recognizerLifecycle";

describe("recognizer lifecycle", () => {
  it("allows stop only when listening or already stopping", () => {
    expect(canStopRecognizer("listening")).toBe(true);
    expect(canStopRecognizer("stopping")).toBe(true);
    expect(canStopRecognizer("idle")).toBe(false);
    expect(canStopRecognizer("starting")).toBe(false);
  });

  it("treats starting as busy but not drainable", () => {
    expect(isRecognizerBusy("starting")).toBe(true);
    expect(shouldDrainRecognizerOnStop("starting")).toBe(false);
  });

  it("drains only when listening or stopping", () => {
    expect(shouldDrainRecognizerOnStop("listening")).toBe(true);
    expect(shouldDrainRecognizerOnStop("stopping")).toBe(true);
    expect(shouldDrainRecognizerOnStop("idle")).toBe(false);
  });
});
