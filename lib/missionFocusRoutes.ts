/** Routes that use Mission Focus Layout (no sidebar / bottom nav). */

const MISSION_FOCUS_PREFIXES = [
  "/checkride",
  "/word-mission",
  "/part1",
  "/part2",
  "/mission-recall",
  "/flight-debrief",
  "/simulado",
] as const;

export function isMissionFocusRoute(pathname: string): boolean {
  if (pathname === "/") return true;
  return MISSION_FOCUS_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function isMissionFocusHome(pathname: string): boolean {
  return pathname === "/";
}
