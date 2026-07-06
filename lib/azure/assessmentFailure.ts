export type AssessmentFailureCode =
  | "no_segments"
  | "stale_generation"
  | "no_recognizer"
  | "recognition_no_match"
  | "no_pronunciation_json"
  | "parser_failed"
  | "missing_pronunciation_property"
  | "pronunciation_config_not_attached"
  | "reference_text_missing"
  | "recognition_cancelled"
  | "empty_sdk_result"
  | "recognizer_not_ready"
  | "recognizer_mismatch"
  | "session_stopped_before_result";

const USER_MESSAGES: Record<AssessmentFailureCode, string> = {
  no_segments: "No pronunciation segments were captured before stop.",
  stale_generation: "Recording session expired before assessment could finish.",
  no_recognizer: "Recognizer was not active when stop was requested.",
  recognition_no_match: "Azure did not recognize speech (NoMatch).",
  no_pronunciation_json: "No PronunciationAssessment JSON returned from Azure.",
  parser_failed: "Assessment parser failed on Azure JSON.",
  missing_pronunciation_property: "Azure JSON missing PronunciationAssessment property.",
  pronunciation_config_not_attached: "Pronunciation config not attached to recognizer.",
  reference_text_missing: "Reference text missing for scripted assessment.",
  recognition_cancelled: "Recognition cancelled before assessment completed.",
  empty_sdk_result: "SDK returned empty result.",
  recognizer_not_ready: "Recognizer is still starting — wait until recording is active.",
  recognizer_mismatch: "Wrong recognizer instance — config may not have been applied.",
  session_stopped_before_result: "Session ended before a final recognized result arrived (drain timeout).",
};

export type AssessmentFailure = {
  code: AssessmentFailureCode;
  userMessage: string;
  detail?: string;
};

export function assessmentFailure(
  code: AssessmentFailureCode,
  detail?: string,
): AssessmentFailure {
  const base = USER_MESSAGES[code];
  const userMessage = detail ? `${base} (${detail})` : base;
  return { code, userMessage, detail };
}

export const STUDENT_SAFE_RECORDING_FAILURE =
  "I couldn't get a clear recording that time. Try again with a short phrase and speak a little closer to the mic.";

const TECHNICAL_ERROR_PATTERN =
  /\b(drain\s+timeout|callback|RecognizedSpeech|SDK|Azure|session|no_recognizer|NoMatch|JSON|pronunciation assessment|recognizer|parser failed)\b/i;

export function logAssessmentFailureTechnical(
  failure: AssessmentFailure | null | undefined,
): void {
  if (!failure) return;
  console.warn("[AzureAssessment]", {
    code: failure.code,
    userMessage: failure.userMessage,
    detail: failure.detail,
  });
}

/** Student-facing copy only — technical reason stays in console. */
export function studentSafeAssessmentMessage(
  failure: AssessmentFailure | null | undefined,
  recoveryGuidance?: string,
): string {
  logAssessmentFailureTechnical(failure);
  if (!failure) {
    return recoveryGuidance ?? "Let's try that once more.";
  }
  return recoveryGuidance
    ? `${STUDENT_SAFE_RECORDING_FAILURE} ${recoveryGuidance}`
    : STUDENT_SAFE_RECORDING_FAILURE;
}

export function sanitizeStudentFacingError(text: string | null | undefined): string | null {
  if (!text?.trim()) return null;
  if (TECHNICAL_ERROR_PATTERN.test(text) || FORBIDDEN_TECHNICAL.test(text)) {
    return STUDENT_SAFE_RECORDING_FAILURE;
  }
  return text.trim();
}

const FORBIDDEN_TECHNICAL =
  /\b(Accuracy|Fluency|Completeness|Prosody)\s+\d+/i;

export function formatAssessmentFailureMessage(
  failure: AssessmentFailure | null | undefined,
  recoveryGuidance?: string,
): string {
  return studentSafeAssessmentMessage(failure, recoveryGuidance);
}
