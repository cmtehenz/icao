import { describe, expect, it } from "vitest";
import { instructorSpeechFromParts } from "@/lib/wordMission/lesson/instructorText";

describe("instructorSpeechFromParts", () => {
  it("joins mission brief and captain teaching for voice", () => {
    const speech = instructorSpeechFromParts(
      "Today you'll learn one of the most important safety instructions in aviation.",
      "Gustavo, imagine you're approaching a railroad crossing.",
    );
    expect(speech).toContain("Today you'll learn");
    expect(speech).toContain("Gustavo, imagine you're approaching a railroad crossing.");
  });

  it("includes step detail such as operational examples", () => {
    const speech = instructorSpeechFromParts(
      "You're taxiing your H130 for departure.",
      'On the radio: "PT-ABC, hold short runway one eight."',
    );
    expect(speech).toContain("taxiing your H130");
    expect(speech).toContain("hold short runway one eight");
  });
});
