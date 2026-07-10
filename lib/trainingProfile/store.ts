import {
  DEFAULT_TRAINING_PROFILE,
  type CheckrideProbeResult,
  type StudentTrainingProfile,
  type TrainingPhase,
  type WeakArea,
} from "@/lib/trainingProfile/types";

const STORAGE_KEY = "icao_student_training_profile_v1";
export const TRAINING_PROFILE_EVENT = "icao-training-profile";

function emit(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(TRAINING_PROFILE_EVENT));
}

function readRaw(): StudentTrainingProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StudentTrainingProfile;
    if (parsed?.version !== 1) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function getTrainingProfile(): StudentTrainingProfile {
  return readRaw() ?? { ...DEFAULT_TRAINING_PROFILE };
}

export function needsCheckride(profile: StudentTrainingProfile = getTrainingProfile()): boolean {
  if (profile.checkrideStatus === "pending") return true;
  if (profile.nextCheckrideAt) {
    return Date.now() >= new Date(profile.nextCheckrideAt).getTime();
  }
  return false;
}

export function saveTrainingProfile(profile: StudentTrainingProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  emit();
}

export function skipCheckrideToFoundation(): StudentTrainingProfile {
  const profile: StudentTrainingProfile = {
    ...DEFAULT_TRAINING_PROFILE,
    checkrideStatus: "skipped",
    phase: "foundation",
    skippedAt: new Date().toISOString(),
    completedAt: null,
    estimatedScore: null,
    weakAreas: ["pronunciation", "confidence"],
    focusSounds: [],
    probeResults: [],
    nextCheckrideAt: null,
  };
  saveTrainingProfile(profile);
  return profile;
}

export function completeCheckride(
  probes: CheckrideProbeResult[],
  focusSounds: string[] = [],
): StudentTrainingProfile {
  const scored = probes.filter((p) => p.attempted && p.accuracyScore != null);
  const avg =
    scored.length > 0
      ? Math.round(
          scored.reduce((sum, p) => sum + (p.accuracyScore ?? 0), 0) / scored.length,
        )
      : 45;

  const phase = phaseFromScore(avg);
  const weakAreas = deriveWeakAreas(probes, avg);

  const profile: StudentTrainingProfile = {
    version: 1,
    checkrideStatus: "completed",
    phase,
    completedAt: new Date().toISOString(),
    skippedAt: null,
    estimatedScore: avg,
    weakAreas,
    focusSounds,
    probeResults: probes,
    nextCheckrideAt: daysFromNow(21),
  };
  saveTrainingProfile(profile);
  return profile;
}

export function phaseFromScore(score: number): TrainingPhase {
  if (score >= 78) return "exam";
  if (score >= 58) return "operational";
  return "foundation";
}

function deriveWeakAreas(probes: CheckrideProbeResult[], avg: number): WeakArea[] {
  const areas: WeakArea[] = [];
  const words = probes.filter((p) => p.kind === "word" && p.accuracyScore != null);
  const readbacks = probes.filter((p) => p.kind === "readback" && p.accuracyScore != null);
  const orals = probes.filter((p) => p.kind === "oral");

  const wordAvg =
    words.length > 0
      ? words.reduce((s, p) => s + (p.accuracyScore ?? 0), 0) / words.length
      : avg;
  const readAvg =
    readbacks.length > 0
      ? readbacks.reduce((s, p) => s + (p.accuracyScore ?? 0), 0) / readbacks.length
      : avg;
  const fluencyAvg =
    probes
      .filter((p) => p.fluencyScore != null)
      .reduce((s, p, _, arr) => s + (p.fluencyScore ?? 0) / arr.length, 0) || avg;

  if (wordAvg < 65) areas.push("pronunciation");
  if (fluencyAvg < 65 || readAvg < 65) areas.push("rhythm");
  if (readAvg < 60) areas.push("vocabulary");
  if (orals.some((p) => !p.attempted || (p.accuracyScore != null && p.accuracyScore < 55))) {
    areas.push("structure");
  }
  if (avg < 55) areas.push("confidence");

  return areas.length ? [...new Set(areas)] : ["pronunciation"];
}

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}
