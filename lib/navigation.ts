export const NAV_ITEMS = [
  {
    href: "/",
    label: "Início",
    shortLabel: "Início",
    icon: "🏠",
    description: "Meta de hoje e próximo passo",
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
    href: "/vocabulario",
    label: "Vocabulary",
    shortLabel: "Vocab",
    icon: "📚",
    description: "ICAO vocabulary — Azure TTS & SRS",
  },
  {
    href: "/pronunciation",
    label: "Pronúncia",
    shortLabel: "Pronúncia",
    icon: "🎤",
    description: "Palavras com erro para treinar",
  },
] as const;

export const PRONUNCIATION_HREF = "/pronunciation";
export const PART1_HREF = "/part1";
export const HOME_HREF = "/";

export function isNavActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
