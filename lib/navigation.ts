export const NAV_ITEMS = [
  {
    href: "/",
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
  {
    href: "/conta",
    label: "Conta",
    shortLabel: "Conta",
    icon: "👤",
    description: "Perfil e histórico de notas",
  },
] as const;

export const PRONUNCIATION_HREF = "/pronunciation";

export function isNavActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}
