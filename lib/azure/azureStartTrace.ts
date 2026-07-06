/** Runtime trace for useAzurePronunciation.startWithReference — instrumentation only. */

export function traceAzureStartStep(
  step: number,
  message: string,
  detail?: unknown,
): void {
  if (detail !== undefined) {
    console.info(`[AzureStart] STEP ${step}: ${message}`, detail);
  } else {
    console.info(`[AzureStart] STEP ${step}: ${message}`);
  }
}

export function traceAzureStartError(
  step: number,
  message: string,
  error: unknown,
): never {
  console.error(`[AzureStart] STEP ${step} ERROR: ${message}`, error);
  if (error instanceof Error) {
    console.error(`[AzureStart] STEP ${step} ERROR stack:`, error.stack);
    console.error(`[AzureStart] STEP ${step} ERROR name:`, error.name);
    console.error(`[AzureStart] STEP ${step} ERROR message:`, error.message);
  }
  throw error;
}
