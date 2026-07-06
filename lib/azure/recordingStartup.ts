export type AzureRecordingPhase =
  | "idle"
  | "preparing"
  | "permission"
  | "connecting"
  | "recording"
  | "assessing";

export const RECORD_STARTUP_TIMEOUTS = {
  waitIdle: 2000,
  acquire: 2000,
  getUserMedia: 10000,
} as const;

export const MIC_START_FAILED = "Microphone did not start. Please try again.";

export const MIC_PERMISSION_GUIDANCE =
  "Microphone permission denied — allow mic access in browser settings.";

export const RECORDING_PHASE_LABELS: Record<
  Exclude<AzureRecordingPhase, "idle">,
  string
> = {
  preparing: "Preparing microphone…",
  permission: "Requesting microphone permission…",
  connecting: "Connecting to Azure Speech…",
  recording: "Recording — speak clearly…",
  assessing: "Assessing your pronunciation…",
};

export function recordingPhaseLabel(
  phase: AzureRecordingPhase,
): string | null {
  if (phase === "idle") return null;
  return RECORDING_PHASE_LABELS[phase];
}

export class StartupTimeoutError extends Error {
  readonly stage: string;

  constructor(stage: string) {
    super(`${stage} timeout`);
    this.name = "StartupTimeoutError";
    this.stage = stage;
  }
}

export function withStartupTimeout<T>(
  promise: Promise<T>,
  ms: number,
  stage: string,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new StartupTimeoutError(stage));
    }, ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      },
    );
  });
}
