import { describe, expect, it } from "vitest";
import {
  expandAnacCallsign,
  expandPtCallsign,
  expandRadioSpeech,
  spellIcaoLetters,
} from "@/lib/captainDelta/icaoRadioSpeech";
import { toSpeechText } from "@/lib/captainDelta/voiceText";

describe("expandPtCallsign", () => {
  it("spells Brazilian registration PT-ABC", () => {
    expect(expandPtCallsign("PT-ABC")).toBe("Papa Tango Alpha Bravo Charlie");
  });
});

describe("expandAnacCallsign", () => {
  it("spells Part 2 exam callsign ANAC123", () => {
    expect(expandAnacCallsign("ANAC123")).toBe(
      "Alpha November Alpha Charlie one two three",
    );
  });
});

describe("expandRadioSpeech", () => {
  it("spells navaid and fix identifiers", () => {
    expect(spellIcaoLetters("FLL")).toBe("Foxtrot Lima Lima");
    expect(expandRadioSpeech("cleared direct AFA VOR")).toMatch(
      /Alpha Foxtrot Alpha/,
    );
    expect(expandRadioSpeech("fly direct NITUX")).toMatch(
      /November India Tango Uniform X-ray/,
    );
  });

  it("leaves plain phraseology words untouched", () => {
    expect(expandRadioSpeech("hold short runway one eight")).toBe(
      "hold short runway one eight",
    );
  });
});

describe("toSpeechText", () => {
  it("expands callsigns inside instructor coaching", () => {
    const speech = toSpeechText("ANAC123, runway one eight, line up and wait.");
    expect(speech).toContain("Alpha November Alpha Charlie one two three");
    expect(speech).not.toContain("ANAC123");
  });
});
