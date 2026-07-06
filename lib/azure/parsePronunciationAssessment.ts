import type { AssessmentFailure, AssessmentFailureCode } from "@/lib/azure/assessmentFailure";
import { assessmentFailure } from "@/lib/azure/assessmentFailure";
import type { AzurePronunciationResult, AzureWordScore } from "@/lib/azure/pronunciation";

export type AzureNBestJson = {
  Display?: string;
  Lexical?: string;
  ITN?: string;
  PronunciationAssessment?: {
    AccuracyScore?: number;
    FluencyScore?: number;
    CompletenessScore?: number;
    PronScore?: number;
    ProsodyScore?: number;
  };
  Words?: Array<{
    Word: string;
    AccuracyScore?: number;
    PronunciationAssessment?: { AccuracyScore?: number; ErrorType?: string };
  }>;
};

export type AzureSpeechJsonResult = {
  RecognitionStatus?: string;
  NBest?: AzureNBestJson[];
};

export type ParsedPronunciationAssessment = {
  assessment: AzurePronunciationResult | null;
  failure: AssessmentFailure | null;
  rawJson?: string;
};

export function parseWordScoresFromJson(json: AzureSpeechJsonResult): AzureWordScore[] {
  const words = json.NBest?.[0]?.Words ?? [];
  return words.map((w) => {
    const pa = w.PronunciationAssessment;
    return {
      word: w.Word,
      accuracyScore: Math.round(pa?.AccuracyScore ?? w.AccuracyScore ?? 0),
      errorType: pa?.ErrorType ?? "None",
    };
  });
}

export function parsePronunciationAssessmentJson(
  jsonRaw: string,
  recognizedText = "",
): ParsedPronunciationAssessment {
  const trimmed = jsonRaw?.trim() ?? "";
  if (!trimmed) {
    return {
      assessment: null,
      failure: assessmentFailure(
        "no_pronunciation_json",
        "SpeechServiceResponse_JsonResult empty",
      ),
    };
  }

  let json: AzureSpeechJsonResult;
  try {
    json = JSON.parse(trimmed) as AzureSpeechJsonResult;
  } catch (e) {
    return {
      assessment: null,
      failure: assessmentFailure(
        "parser_failed",
        e instanceof Error ? e.message : String(e),
      ),
      rawJson: trimmed.slice(0, 500),
    };
  }

  const nbest = json.NBest?.[0];
  const pa = nbest?.PronunciationAssessment;
  if (!pa) {
    return {
      assessment: null,
      failure: assessmentFailure(
        "missing_pronunciation_property",
        "NBest[0].PronunciationAssessment absent",
      ),
      rawJson: trimmed.slice(0, 500),
    };
  }

  const text =
    recognizedText ||
    nbest?.Display ||
    nbest?.ITN ||
    nbest?.Lexical ||
    "";

  return {
    assessment: {
      accuracyScore: Math.round(pa.AccuracyScore ?? 0),
      fluencyScore: Math.round(pa.FluencyScore ?? 0),
      completenessScore: Math.round(pa.CompletenessScore ?? 0),
      prosodyScore: Math.round(pa.PronScore ?? pa.ProsodyScore ?? 0),
      recognizedText: text,
      words: parseWordScoresFromJson(json),
    },
    failure: null,
    rawJson: trimmed,
  };
}

export type SdkPronunciationScores = {
  accuracyScore: number;
  fluencyScore: number;
  completenessScore: number;
  prosodyScore: number;
};

export function isNonSpeechTrailingSegment(segment: AzurePronunciationResult): boolean {
  const text = segment.recognizedText?.trim() ?? "";
  if (text === ".") return true;
  if (text.length <= 1) return true;
  if (!/[a-zA-Z]/.test(text)) return true;
  const scores = [
    segment.accuracyScore,
    segment.fluencyScore,
    segment.completenessScore,
    segment.prosodyScore,
  ];
  if (scores.every((n) => n === 0)) return true;
  return false;
}

export function isValidAssessmentSegment(segment: AzurePronunciationResult): boolean {
  if (isNonSpeechTrailingSegment(segment)) return false;
  const scores = [
    segment.accuracyScore,
    segment.fluencyScore,
    segment.completenessScore,
    segment.prosodyScore,
  ];
  return scores.every((n) => typeof n === "number" && Number.isFinite(n));
}

export function hasValidStoredSegments(segments: AzurePronunciationResult[]): boolean {
  return segments.some(isValidAssessmentSegment);
}

/** End-of-session RecognizedSpeech with empty text and no pronunciation scores. */
export function isTerminalRecognizedCallback(input: {
  recognizedText: string;
  jsonRaw: string;
  sdkScores: SdkPronunciationScores | null;
}): boolean {
  if (input.recognizedText.trim()) return false;

  const trimmedJson = input.jsonRaw?.trim() ?? "";
  if (!trimmedJson) return true;

  try {
    const json = JSON.parse(trimmedJson) as AzureSpeechJsonResult;
    if (!json.NBest?.[0]?.PronunciationAssessment) return true;
  } catch {
    return true;
  }

  if (!input.sdkScores) return true;

  return [
    input.sdkScores.accuracyScore,
    input.sdkScores.fluencyScore,
    input.sdkScores.completenessScore,
    input.sdkScores.prosodyScore,
  ].some((n) => Number.isNaN(n));
}

export function parseSdkPronunciationScores(pa: {
  accuracyScore: number;
  fluencyScore: number;
  completenessScore: number;
  prosodyScore?: number;
}): SdkPronunciationScores | null {
  const scores: SdkPronunciationScores = {
    accuracyScore: Math.round(pa.accuracyScore),
    fluencyScore: Math.round(pa.fluencyScore),
    completenessScore: Math.round(pa.completenessScore),
    prosodyScore: Math.round(pa.prosodyScore ?? 0),
  };
  if (
    [scores.accuracyScore, scores.fluencyScore, scores.completenessScore, scores.prosodyScore].some(
      (n) => Number.isNaN(n),
    )
  ) {
    return null;
  }
  return scores;
}

export function mergeSdkAndJsonAssessment(
  sdkScores: SdkPronunciationScores | null,
  jsonParsed: ParsedPronunciationAssessment,
  recognizedText: string,
): ParsedPronunciationAssessment {
  if (jsonParsed.assessment) {
    const assessment = {
      ...jsonParsed.assessment,
      recognizedText: recognizedText || jsonParsed.assessment.recognizedText,
      accuracyScore: sdkScores?.accuracyScore ?? jsonParsed.assessment.accuracyScore,
      fluencyScore: sdkScores?.fluencyScore ?? jsonParsed.assessment.fluencyScore,
      completenessScore:
        sdkScores?.completenessScore ?? jsonParsed.assessment.completenessScore,
      prosodyScore: sdkScores?.prosodyScore ?? jsonParsed.assessment.prosodyScore,
    };
    if (!isValidAssessmentSegment(assessment)) {
      return { assessment: null, failure: jsonParsed.failure };
    }
    return {
      ...jsonParsed,
      assessment,
    };
  }

  if (sdkScores && recognizedText.trim()) {
    const assessment = {
      ...sdkScores,
      recognizedText,
      words: [] as AzureWordScore[],
    };
    if (!isValidAssessmentSegment(assessment)) {
      return jsonParsed;
    }
    return {
      assessment,
      failure: null,
    };
  }

  return jsonParsed;
}

function normalizeRecognizedText(text: string): string {
  return text.trim().toLowerCase().replace(/[.!?,;:]+$/g, "");
}

/** Skip storing the same utterance twice in one session (Azure often duplicates). */
export function isDuplicateAssessmentSegment(
  existing: AzurePronunciationResult[],
  candidate: AzurePronunciationResult,
): boolean {
  const candNorm = normalizeRecognizedText(candidate.recognizedText);
  return existing.some((seg) => {
    if (!isValidAssessmentSegment(seg)) return false;
    return (
      normalizeRecognizedText(seg.recognizedText) === candNorm &&
      seg.accuracyScore === candidate.accuracyScore &&
      seg.fluencyScore === candidate.fluencyScore &&
      seg.completenessScore === candidate.completenessScore
    );
  });
}

/** Pick the best valid segment — never average trailing garbage. */
export function pickBestAssessmentSegment(
  segments: AzurePronunciationResult[],
  referenceText = "",
): AzurePronunciationResult | null {
  const valid = segments.filter(isValidAssessmentSegment);
  if (!valid.length) return null;
  if (valid.length === 1) return valid[0];

  const ref = normalizeRecognizedText(referenceText);

  return [...valid].sort((a, b) => {
    const aText = normalizeRecognizedText(a.recognizedText);
    const bText = normalizeRecognizedText(b.recognizedText);

    const aExactRef = ref && aText === ref ? 1 : 0;
    const bExactRef = ref && bText === ref ? 1 : 0;
    if (bExactRef !== aExactRef) return bExactRef - aExactRef;

    const aContainsRef = ref && aText.includes(ref) ? 1 : 0;
    const bContainsRef = ref && bText.includes(ref) ? 1 : 0;
    if (bContainsRef !== aContainsRef) return bContainsRef - aContainsRef;

    if (b.completenessScore !== a.completenessScore) {
      return b.completenessScore - a.completenessScore;
    }
    if (b.accuracyScore !== a.accuracyScore) {
      return b.accuracyScore - a.accuracyScore;
    }
    if (b.fluencyScore !== a.fluencyScore) {
      return b.fluencyScore - a.fluencyScore;
    }
    return bText.length - aText.length;
  })[0];
}

export function mergeAssessmentSegments(
  segments: AzurePronunciationResult[],
  referenceText = "",
): AzurePronunciationResult | null {
  return pickBestAssessmentSegment(segments, referenceText);
}

export function resolveStopAssessmentFailure(
  merged: AzurePronunciationResult | null,
  context: {
    segmentCount: number;
    staleGeneration: boolean;
    hadRecognizer: boolean;
    sawNoMatch: boolean;
    sawCancellation: boolean;
    configAttached: boolean;
    recognizerMatch: boolean;
    referenceText: string;
    scripted: boolean;
    lifecycle: "idle" | "starting" | "listening" | "stopping";
  },
): AssessmentFailure | null {
  if (merged) return null;

  // Valid segments already stored — terminal empty callbacks must not fail the session.
  if (context.segmentCount > 0) {
    return null;
  }

  let code: AssessmentFailureCode = "no_segments";
  let detail: string | undefined;

  if (context.staleGeneration) {
    code = "stale_generation";
  } else if (context.lifecycle === "starting") {
    code = "recognizer_not_ready";
  } else if (!context.hadRecognizer) {
    code = "no_recognizer";
  } else if (!context.configAttached) {
    code = "pronunciation_config_not_attached";
  } else if (!context.recognizerMatch) {
    code = "recognizer_mismatch";
  } else if (context.sawCancellation) {
    code = "recognition_cancelled";
  } else if (context.sawNoMatch) {
    code = "recognition_no_match";
  } else if (context.scripted && !context.referenceText.trim()) {
    code = "reference_text_missing";
  } else if (context.segmentCount === 0) {
    code = "session_stopped_before_result";
    detail = "recognized callback never produced RecognizedSpeech with scores";
  }

  return assessmentFailure(code, detail);
}

/** Dump all property ids from an SDK result object (for runtime diagnosis). */
export function collectSpeechResultPropertyIds(
  properties: { getProperty: (id: string | number) => string },
  propertyIdEnum: Record<string, unknown>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [name, id] of Object.entries(propertyIdEnum)) {
    if (typeof id !== "number" && typeof id !== "string") continue;
    try {
      const value = properties.getProperty(id);
      if (value) out[name] = value;
    } catch {
      /* skip */
    }
  }
  return out;
}
