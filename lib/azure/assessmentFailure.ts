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

export function formatAssessmentFailureMessage(
  failure: AssessmentFailure | null | undefined,
  recoveryGuidance?: string,
): string {
  if (!failure) return "Assessment unavailable.";
  return recoveryGuidance
    ? `${failure.userMessage} ${recoveryGuidance}`
    : failure.userMessage;
}
