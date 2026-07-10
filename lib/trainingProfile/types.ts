/** Student training profile — drives adaptive Mission Engine (RFC-004). */

export type TrainingPhase = "foundation" | "operational" | "exam";

export type CheckrideStatus = "pending" | "completed" | "skipped";

export type WeakArea =
  | "pronunciation"
  | "rhythm"
  | "vocabulary"
  | "structure"
  | "confidence";

export type CheckrideProbeResult = {
  id: string;
  kind: "word" | "readback" | "oral";
  reference: string;
  accuracyScore: number | null;
  fluencyScore: number | null;
  attempted: boolean;
};

export type StudentTrainingProfile = {
  version: 1;
  checkrideStatus: CheckrideStatus;
  phase: TrainingPhase;
  completedAt: string | null;
  skippedAt: string | null;
  /** 0–100 composite from checkride probes */
  estimatedScore: number | null;
  weakAreas: WeakArea[];
  focusSounds: string[];
  probeResults: CheckrideProbeResult[];
  /** Re-checkride after this ISO date (optional) */
  nextCheckrideAt: string | null;
};

export const DEFAULT_TRAINING_PROFILE: StudentTrainingProfile = {
  version: 1,
  checkrideStatus: "pending",
  phase: "foundation",
  completedAt: null,
  skippedAt: null,
  estimatedScore: null,
  weakAreas: [],
  focusSounds: [],
  probeResults: [],
  nextCheckrideAt: null,
};

export function phaseLabel(phase: TrainingPhase): string {
  switch (phase) {
    case "foundation":
      return "Foundation";
    case "operational":
      return "Operational";
    case "exam":
      return "Exam Ready";
  }
}

export function phaseBrief(phase: TrainingPhase): string {
  switch (phase) {
    case "foundation":
      return "We start simple — clear speech first, then build operational language.";
    case "operational":
      return "You can communicate. We tighten structure and exam phraseology.";
    case "exam":
      return "Pressure training — full mission legs toward ICAO Level 4.";
  }
}
