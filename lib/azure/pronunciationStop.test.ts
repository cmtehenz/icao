import { describe, expect, it } from "vitest";
import { shouldAllowPronunciationStop } from "@/lib/azure/pronunciationStop";

describe("shouldAllowPronunciationStop", () => {
  it("user_click only while listening", () => {
    expect(shouldAllowPronunciationStop("listening", "user_click")).toBe(true);
    expect(shouldAllowPronunciationStop("starting", "user_click")).toBe(false);
    expect(shouldAllowPronunciationStop("idle", "user_click")).toBe(false);
    expect(shouldAllowPronunciationStop("stopping", "user_click")).toBe(false);
  });

  it("blocks word_clear during starting (Record click must not stop)", () => {
    expect(shouldAllowPronunciationStop("starting", "word_clear")).toBe(false);
    expect(shouldAllowPronunciationStop("starting", "unknown")).toBe(false);
    expect(shouldAllowPronunciationStop("starting", "auto_effect")).toBe(false);
    expect(shouldAllowPronunciationStop("starting", "effect_cleanup")).toBe(false);
  });

  it("blocks automated stop while listening", () => {
    expect(shouldAllowPronunciationStop("listening", "word_clear")).toBe(false);
    expect(shouldAllowPronunciationStop("listening", "captain_action")).toBe(false);
  });

  it("allows idle cleanup stops", () => {
    expect(shouldAllowPronunciationStop("idle", "word_clear")).toBe(true);
    expect(shouldAllowPronunciationStop("idle", "effect_cleanup")).toBe(true);
  });
});
