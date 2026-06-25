export const NAV_ITEMS = [
  {
    href: "/",
    label: "ICAO 5",
    shortLabel: "Part 1",
    icon: "✈",
    description: "PEEL answers & exam training",
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
    label: "SDEA Part 2",
    shortLabel: "Part 2",
    icon: "📡",
    description: "Pilot interaction & readback",
  },
] as const;

export function isNavActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}
