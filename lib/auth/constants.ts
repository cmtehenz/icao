export const SESSION_COOKIE = "icao_session";

export const PUBLIC_PATHS = ["/login"] as const;

export function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname as (typeof PUBLIC_PATHS)[number])) return true;
  if (pathname.startsWith("/api/auth/")) return true;
  if (pathname === "/sw.js" || pathname === "/manifest.webmanifest") return true;
  return false;
}
