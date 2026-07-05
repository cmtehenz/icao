export const ACADEMY_SESSION_END = "icao-academy-session-end";

export function emitAcademySessionEnd(detail: {
  durationMinutes: number;
  mission: string;
  score?: number;
}): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(ACADEMY_SESSION_END, { detail }));
}
