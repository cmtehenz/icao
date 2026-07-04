import type { CaptainDeltaContext } from "@/lib/captainDelta/types";

export function getCaptainDeltaContext(pathname: string): CaptainDeltaContext {
  if (pathname === "/" || pathname === "") return "dashboard";
  if (pathname.startsWith("/part1")) return "part1";
  if (pathname.startsWith("/part2")) return "part2";
  if (pathname.startsWith("/pronunciation")) return "pronunciation";
  if (pathname.startsWith("/vocabulario")) return "vocabulary";
  if (pathname.startsWith("/simulado")) return "simulation";
  if (pathname.startsWith("/escutar-prova")) return "listen";
  if (pathname.startsWith("/structure")) return "memory";
  if (pathname.startsWith("/conta")) return "account";
  return "other";
}

export const CONTEXT_LABELS: Record<CaptainDeltaContext, string> = {
  dashboard: "Dashboard",
  part1: "Part 1",
  part2: "Part 2",
  pronunciation: "Pronunciation",
  vocabulary: "Vocabulary",
  simulation: "Simulation",
  listen: "Listen Mode",
  memory: "Memory Mode",
  account: "Account",
  other: "Training",
};
