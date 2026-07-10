import { describe, expect, it } from "vitest";
import {
  isShortPhraseologyAnswer,
  normalizeConfirmTranscript,
  scoreConfirmResponse,
} from "@/lib/evaluate/confirmTranscript";
import { azureReferenceText, useUnscriptedPronunciation } from "@/lib/azure/pronunciation";

describe("isShortPhraseologyAnswer", () => {
  it("detects AFFIRM model", () => {
    expect(isShortPhraseologyAnswer("AFFIRM, ANAC 123.")).toBe(true);
  });

  it("detects long problem report as not short", () => {
    expect(
      isShortPhraseologyAnswer(
        "NorCal Departure, ANAC 123, my main landing gear does not retract properly. Request to hold.",
      ),
    ).toBe(false);
  });
});

describe("normalizeConfirmTranscript", () => {
  it("fixes common Azure mishearing of AFFIRM + callsign", () => {
    expect(normalizeConfirmTranscript("A firm are not 1-2 dream.")).toMatch(/AFFIRM/i);
    expect(normalizeConfirmTranscript("A firm are not 1-2 dream.")).toMatch(/ANAC 123/i);
  });

  it("keeps clean AFFIRM line", () => {
    expect(normalizeConfirmTranscript("AFFIRM, ANAC 123.")).toBe("AFFIRM, ANAC 123.");
  });
});

describe("scoreConfirmResponse", () => {
  it("scores high when affirm and callsign detected after normalization", () => {
    const score = scoreConfirmResponse(
      "A firm are not 1-2 dream.",
      "AFFIRM, ANAC 123.",
    );
    expect(score).toBeGreaterThanOrEqual(90);
  });
});

describe("Azure reference for short confirm", () => {
  it("uses scripted reference for AFFIRM", () => {
    const model = "AFFIRM, ANAC 123.";
    expect(useUnscriptedPronunciation("part2-interaction", model)).toBe(false);
    expect(azureReferenceText(model, "part2-interaction")).toBe(model);
  });

  it("uses unscripted for long interaction report", () => {
    const model =
      "NorCal Departure, ANAC 123, my main landing gear does not retract properly.";
    expect(useUnscriptedPronunciation("part2-interaction", model)).toBe(true);
    expect(azureReferenceText(model, "part2-interaction")).toBe("");
  });
});
