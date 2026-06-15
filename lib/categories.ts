export const CATEGORIES = {
  personal: "Personal",
  safety_crm: "Safety & CRM",
  procedures: "Procedures",
  aircraft_tech: "Aircraft & Tech",
  airports: "Airports",
  future: "Future",
  general: "General",
} as const;

export type Category = keyof typeof CATEGORIES;

export const CHECKLIST_ITEMS = [
  { id: "opener", label: "Opener — opening phrase" },
  { id: "idea1", label: "Idea 1 — First of all..." },
  { id: "idea2", label: "Idea 2 — Additionally..." },
  { id: "idea3", label: "Idea 3 — Finally..." },
  { id: "example", label: "For example..." },
  { id: "conclusion", label: "Overall — conclusion" },
] as const;
