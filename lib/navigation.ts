export const WORD_MISSION_HREF = "/word-mission";

export const NAV_ITEMS = [
  {
    href: "/",
    label: "Início",
    shortLabel: "Início",
    icon: "🏠",
    description: "Meta de hoje e próximo passo",
  },
  {
    href: WORD_MISSION_HREF,
    label: "Word Mission",
    shortLabel: "Words",
    icon: "🎤",
    description: "Meaning, pronunciation, and ICAO use",
  },
  {
    href: "/part1",
    label: "Part 1",
    shortLabel: "Part 1",
    icon: "✈",
    description: "Aviation Topics — provas 23C–26C",
  },
  {
    href: "/part2",
    label: "Part 2",
    shortLabel: "Part 2",
    icon: "📡",
    description: "Pilot interaction — provas reais",
  },
  {
    href: "/escutar-prova",
    label: "Escutar Prova",
    shortLabel: "Ouvir",
    icon: "🎧",
    description: "Full exam listening — 23C–26C",
  },
  {
    href: "/icao-flix",
    label: "ICAOFlix",
    shortLabel: "Flix",
    icon: "🎬",
    description: "Curated aviation video library",
  },
  {
    href: "/simulado",
    label: "Simulado ICAO",
    shortLabel: "Simulado",
    icon: "🎯",
    description: "SDEA mock exam — gravação e correção",
  },
] as const;

/** @deprecated Use WORD_MISSION_HREF */
export const PRONUNCIATION_HREF = WORD_MISSION_HREF;
export const PART1_HREF = "/part1";
export const HOME_HREF = "/";

export function isNavActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
