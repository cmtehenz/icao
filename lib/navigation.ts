export const NAV_ITEMS = [
  {
    href: "/",
    label: "Part 1",
    shortLabel: "Part 1",
    icon: "✈",
    description: "Aviation Topics — provas 23C–26C",
  },
  {
    href: "/structure",
    label: "ICAO 4",
    shortLabel: "Structure",
    icon: "📝",
    description: "4-step answer formula",
  },
  {
    href: "/part2",
    label: "Part 2",
    shortLabel: "Part 2",
    icon: "📡",
    description: "Pilot interaction — provas reais",
  },
] as const;

export function isNavActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}
