export type PilotProfile = {
  role: string;
  aircraft: string;
  hours: number;
  aircraftType: string;
  operationType: string;
};

export const PROFILE_KEY = "icao_profile_v1";

export const DEFAULT_PROFILE: PilotProfile = {
  role: "helicopter pilot",
  aircraft: "H130",
  hours: 4000,
  aircraftType: "helicopter",
  operationType: "helicopter operations",
};

const HOUR_WORDS: Record<number, string> = {
  500: "five hundred",
  1000: "one thousand",
  1500: "one thousand five hundred",
  2000: "two thousand",
  2500: "two thousand five hundred",
  3000: "three thousand",
  3500: "three thousand five hundred",
  4000: "four thousand",
  4500: "four thousand five hundred",
  5000: "five thousand",
  6000: "six thousand",
  8000: "eight thousand",
  10000: "ten thousand",
};

export function formatFlightHours(hours: number): string {
  if (HOUR_WORDS[hours]) return HOUR_WORDS[hours];
  if (hours >= 1000 && hours % 1000 === 0) {
    return `${hours / 1000} thousand`;
  }
  return hours.toLocaleString("en-US");
}

export function loadProfile(): PilotProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: PilotProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function applyProfile(text: string, profile: PilotProfile): string {
  const hours = formatFlightHours(profile.hours);
  const pluralType = profile.aircraftType.endsWith("s")
    ? profile.aircraftType
    : `${profile.aircraftType}s`;

  return text
    .replace(/four thousand/gi, hours)
    .replace(/\bH130\b/g, profile.aircraft)
    .replace(/helicopter pilot/gi, profile.role)
    .replace(/helicopter operations/gi, profile.operationType)
    .replace(/helicopters/gi, pluralType)
    .replace(/helicopter/gi, profile.aircraftType);
}
