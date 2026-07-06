/** Runtime trace for Azure Pronunciation Assessment pipeline. */

export function traceAssessmentStep(
  step: number,
  message: string,
  detail?: unknown,
): void {
  if (detail !== undefined) {
    console.info(`[AzureAssessment] STEP ${step}: ${message}`, detail);
  } else {
    console.info(`[AzureAssessment] STEP ${step}: ${message}`);
  }
}

export function traceAssessmentError(
  step: number,
  message: string,
  error?: unknown,
): void {
  console.error(`[AzureAssessment] STEP ${step} ERROR: ${message}`, error);
}

/** Known SDK version from package.json — verify API compatibility at runtime. */
export const AZURE_SPEECH_SDK_PACKAGE_VERSION = "1.50.0";
