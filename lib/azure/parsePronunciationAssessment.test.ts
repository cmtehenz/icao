import { describe, expect, it } from "vitest";
import {
  assessmentFailure,
  formatAssessmentFailureMessage,
} from "@/lib/azure/assessmentFailure";
import {
  hasValidStoredSegments,
  isDuplicateAssessmentSegment,
  isNonSpeechTrailingSegment,
  isTerminalRecognizedCallback,
  isValidAssessmentSegment,
  mergeAssessmentSegments,
  pickBestAssessmentSegment,
  mergeSdkAndJsonAssessment,
  parsePronunciationAssessmentJson,
  parseSdkPronunciationScores,
  parseWordScoresFromJson,
  resolveStopAssessmentFailure,
} from "@/lib/azure/parsePronunciationAssessment";
import type { AzurePronunciationResult } from "@/lib/azure/pronunciation";

const SAMPLE_JSON = JSON.stringify({
  RecognitionStatus: "Success",
  NBest: [
    {
      Display: "runway",
      Lexical: "runway",
      PronunciationAssessment: {
        AccuracyScore: 82,
        FluencyScore: 88,
        CompletenessScore: 100,
        PronScore: 75,
      },
      Words: [
        {
          Word: "runway",
          PronunciationAssessment: { AccuracyScore: 82, ErrorType: "None" },
        },
      ],
    },
  ],
});

describe("parsePronunciationAssessmentJson", () => {
  it("parses assessment when pronunciation JSON exists", () => {
    const { assessment, failure } = parsePronunciationAssessmentJson(SAMPLE_JSON);
    expect(failure).toBeNull();
    expect(assessment).toMatchObject({
      accuracyScore: 82,
      fluencyScore: 88,
      completenessScore: 100,
      prosodyScore: 75,
      recognizedText: "runway",
    });
    expect(assessment?.words[0]?.word).toBe("runway");
  });

  it("returns null assessment when JSON is empty", () => {
    const { assessment, failure } = parsePronunciationAssessmentJson("");
    expect(assessment).toBeNull();
    expect(failure?.code).toBe("no_pronunciation_json");
  });

  it("returns parser failure for invalid JSON", () => {
    const { assessment, failure } = parsePronunciationAssessmentJson("{not-json");
    expect(assessment).toBeNull();
    expect(failure?.code).toBe("parser_failed");
  });

  it("returns missing pronunciation property when NBest lacks scores", () => {
    const { assessment, failure } = parsePronunciationAssessmentJson(
      JSON.stringify({ NBest: [{ Display: "alpha" }] }),
    );
    expect(assessment).toBeNull();
    expect(failure?.code).toBe("missing_pronunciation_property");
  });
});

describe("parseWordScoresFromJson", () => {
  it("extracts word-level scores", () => {
    const words = parseWordScoresFromJson(JSON.parse(SAMPLE_JSON));
    expect(words).toEqual([{ word: "runway", accuracyScore: 82, errorType: "None" }]);
  });
});

describe("mergeAssessmentSegments", () => {
  it("picks the best segment instead of averaging", () => {
    const segments: AzurePronunciationResult[] = [
      {
        accuracyScore: 80,
        fluencyScore: 70,
        completenessScore: 80,
        prosodyScore: 60,
        recognizedText: "one",
        words: [],
      },
      {
        accuracyScore: 90,
        fluencyScore: 90,
        completenessScore: 100,
        prosodyScore: 80,
        recognizedText: "two",
        words: [],
      },
    ];
    const merged = mergeAssessmentSegments(segments, "two");
    expect(merged?.accuracyScore).toBe(90);
    expect(merged?.recognizedText).toBe("two");
  });

  it("keeps Complete. at 100 when trailing dot segment arrives", () => {
    const good = {
      accuracyScore: 100,
      fluencyScore: 100,
      completenessScore: 100,
      prosodyScore: 90,
      recognizedText: "Complete.",
      words: [],
    };
    const dot = {
      accuracyScore: 0,
      fluencyScore: 0,
      completenessScore: 0,
      prosodyScore: 0,
      recognizedText: ".",
      words: [],
    };
    const merged = mergeAssessmentSegments([good, dot], "Complete.");
    expect(merged?.accuracyScore).toBe(100);
    expect(merged?.recognizedText).toBe("Complete.");
  });

  it("returns null when no segments exist", () => {
    expect(mergeAssessmentSegments([])).toBeNull();
  });

  it("ignores invalid terminal segments when merging", () => {
    const valid = {
      accuracyScore: 90,
      fluencyScore: 88,
      completenessScore: 100,
      prosodyScore: 70,
      recognizedText: "runway",
      words: [],
    };
    const terminal = {
      accuracyScore: NaN,
      fluencyScore: NaN,
      completenessScore: NaN,
      prosodyScore: NaN,
      recognizedText: "",
      words: [],
    };
    const merged = mergeAssessmentSegments([valid, terminal]);
    expect(merged?.accuracyScore).toBe(90);
    expect(merged?.recognizedText).toBe("runway");
  });
});

describe("non-speech trailing segments", () => {
  it("rejects a lone period segment", () => {
    expect(
      isNonSpeechTrailingSegment({
        accuracyScore: 0,
        fluencyScore: 0,
        completenessScore: 0,
        prosodyScore: 0,
        recognizedText: ".",
        words: [],
      }),
    ).toBe(true);
  });

  it("rejects all-zero scores", () => {
    expect(
      isNonSpeechTrailingSegment({
        accuracyScore: 0,
        fluencyScore: 0,
        completenessScore: 0,
        prosodyScore: 0,
        recognizedText: "x",
        words: [],
      }),
    ).toBe(true);
  });

  it("pickBestAssessmentSegment prefers reference match", () => {
    const best = pickBestAssessmentSegment(
      [
        {
          accuracyScore: 0,
          fluencyScore: 0,
          completenessScore: 0,
          prosodyScore: 0,
          recognizedText: ".",
          words: [],
        },
        {
          accuracyScore: 100,
          fluencyScore: 100,
          completenessScore: 100,
          prosodyScore: 90,
          recognizedText: "Complete.",
          words: [],
        },
      ],
      "Complete.",
    );
    expect(best?.recognizedText).toBe("Complete.");
    expect(best?.accuracyScore).toBe(100);
  });

  it("accepts Complete. as meaningful speech", () => {
    expect(
      isValidAssessmentSegment({
        accuracyScore: 100,
        fluencyScore: 100,
        completenessScore: 100,
        prosodyScore: 90,
        recognizedText: "Complete.",
        words: [],
      }),
    ).toBe(true);
  });

  it("detects duplicate Complete. segments", () => {
    const segment = {
      accuracyScore: 100,
      fluencyScore: 100,
      completenessScore: 100,
      prosodyScore: 87,
      recognizedText: "Complete.",
      words: [],
    };
    expect(isDuplicateAssessmentSegment([segment], segment)).toBe(true);
    expect(
      isDuplicateAssessmentSegment([segment], {
        ...segment,
        recognizedText: "complete.",
      }),
    ).toBe(true);
  });
});

describe("terminal recognized callback", () => {
  it("detects empty end-of-session callback without PronunciationAssessment", () => {
    expect(
      isTerminalRecognizedCallback({
        recognizedText: "",
        jsonRaw: JSON.stringify({ NBest: [{ Display: "" }] }),
        sdkScores: null,
      }),
    ).toBe(true);
  });

  it("does not treat a valid utterance as terminal", () => {
    expect(
      isTerminalRecognizedCallback({
        recognizedText: "runway",
        jsonRaw: SAMPLE_JSON,
        sdkScores: {
          accuracyScore: 82,
          fluencyScore: 88,
          completenessScore: 100,
          prosodyScore: 75,
        },
      }),
    ).toBe(false);
  });

  it("parseSdkPronunciationScores rejects NaN", () => {
    expect(
      parseSdkPronunciationScores({
        accuracyScore: NaN,
        fluencyScore: 80,
        completenessScore: 100,
        prosodyScore: 70,
      }),
    ).toBeNull();
  });

  it("mergeSdkAndJsonAssessment does not return invalid empty assessment", () => {
    const merged = mergeSdkAndJsonAssessment(
      null,
      parsePronunciationAssessmentJson(
        JSON.stringify({ NBest: [{ Display: "" }] }),
        "",
      ),
      "",
    );
    expect(merged.assessment).toBeNull();
  });

  it("hasValidStoredSegments is true after a good segment", () => {
    expect(
      hasValidStoredSegments([
        {
          accuracyScore: 100,
          fluencyScore: 90,
          completenessScore: 100,
          prosodyScore: 80,
          recognizedText: "runway",
          words: [],
        },
      ]),
    ).toBe(true);
    expect(isValidAssessmentSegment({
      accuracyScore: NaN,
      fluencyScore: 0,
      completenessScore: 0,
      prosodyScore: 0,
      recognizedText: "",
      words: [],
    })).toBe(false);
  });
});

describe("resolveStopAssessmentFailure", () => {
  it("returns no failure when merged assessment exists", () => {
    expect(
      resolveStopAssessmentFailure(
        {
          accuracyScore: 80,
          fluencyScore: 80,
          completenessScore: 100,
          prosodyScore: 70,
          recognizedText: "runway",
          words: [],
        },
        {
          segmentCount: 1,
          staleGeneration: false,
          hadRecognizer: true,
          sawNoMatch: false,
          sawCancellation: false,
          configAttached: true,
          recognizerMatch: true,
          referenceText: "runway",
          scripted: true,
          lifecycle: "listening",
        },
      ),
    ).toBeNull();
  });

  it("reports cancellation", () => {
    const failure = resolveStopAssessmentFailure(null, {
      segmentCount: 0,
      staleGeneration: false,
      hadRecognizer: true,
      sawNoMatch: false,
      sawCancellation: true,
      configAttached: true,
      recognizerMatch: true,
      referenceText: "runway",
      scripted: true,
      lifecycle: "listening",
    });
    expect(failure?.code).toBe("recognition_cancelled");
  });

  it("reports recognizer mismatch", () => {
    const failure = resolveStopAssessmentFailure(null, {
      segmentCount: 0,
      staleGeneration: false,
      hadRecognizer: true,
      sawNoMatch: false,
      sawCancellation: false,
      configAttached: true,
      recognizerMatch: false,
      referenceText: "runway",
      scripted: true,
      lifecycle: "listening",
    });
    expect(failure?.code).toBe("recognizer_mismatch");
  });

  it("reports stale generation when no segments were stored", () => {
    const failure = resolveStopAssessmentFailure(null, {
      segmentCount: 0,
      staleGeneration: true,
      hadRecognizer: true,
      sawNoMatch: false,
      sawCancellation: false,
      configAttached: true,
      recognizerMatch: true,
      referenceText: "runway",
      scripted: true,
      lifecycle: "listening",
    });
    expect(failure?.code).toBe("stale_generation");
  });

  it("reports recognizer not ready during starting lifecycle", () => {
    const failure = resolveStopAssessmentFailure(null, {
      segmentCount: 0,
      staleGeneration: false,
      hadRecognizer: false,
      sawNoMatch: false,
      sawCancellation: false,
      configAttached: true,
      recognizerMatch: true,
      referenceText: "runway",
      scripted: true,
      lifecycle: "starting",
    });
    expect(failure?.code).toBe("recognizer_not_ready");
  });

  it("does not fail when sawNoMatch but valid segments were stored", () => {
    expect(
      resolveStopAssessmentFailure(null, {
        segmentCount: 1,
        staleGeneration: false,
        hadRecognizer: true,
        sawNoMatch: true,
        sawCancellation: false,
        configAttached: true,
        recognizerMatch: true,
        referenceText: "runway",
        scripted: true,
        lifecycle: "stopping",
      }),
    ).toBeNull();
  });
});

describe("formatAssessmentFailureMessage", () => {
  it("includes the runtime reason instead of a generic message", () => {
    const msg = formatAssessmentFailureMessage(
      assessmentFailure("no_pronunciation_json"),
      "Listen → slow down → retry.",
    );
    expect(msg).toContain("No PronunciationAssessment JSON");
    expect(msg).toContain("Listen → slow down → retry.");
  });
});
