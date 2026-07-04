import type { RecommendedNotes } from "@/lib/exams/types";

/** Ideal note-taking reference per Part 2 situation (keyed by scenario id). */
export const PART2_RECOMMENDED_NOTES: Record<string, RecommendedNotes> = {
  "23C-s1": {
    idealNotes: ["SQK IDENT", "RWY HDG", "↑5000", "EXPECT ↑6000", "GEAR STK", "HLD", "CFM"],
    requiredCodes: ["↑5000", "GEAR STK", "HLD", "CFM"],
    optionalCodes: ["SQK IDENT", "RWY HDG", "EXPECT ↑6000"],
    readback: {
      idealNotes: ["SQK IDENT", "RWY HDG", "↑5000", "EXPECT ↑6000"],
      requiredCodes: ["↑5000", "RWY HDG"],
      optionalCodes: ["SQK IDENT", "EXPECT ↑6000"],
    },
  },
  "23C-s2": {
    idealNotes: ["↑3000", "FREQ 119.25", "FIRE", "CAB", "RTN", "↓FL050", "HD060", "NEG"],
    requiredCodes: ["FIRE", "CAB", "RTN", "↓FL050", "HD060", "NEG"],
    optionalCodes: ["FREQ", "↑3000"],
  },
  "23C-s3": {
    idealNotes: ["TAXI R F", "RWY 31R", "CAB", "RTN", "HLD", "SQK 7700", "NEG"],
    requiredCodes: ["CAB", "RTN", "HLD", "NEG"],
    optionalCodes: ["SQK 7700", "RWY 31R"],
  },
  "23C-s4": {
    idealNotes: ["HD190", "↓4000", "RPT 8000", "RWY 35R", "BIRD", "VEC", "NEG", "CFM"],
    requiredCodes: ["HD190", "↓4000", "BIRD", "VEC", "NEG"],
    optionalCodes: ["RWY 35R", "RPT"],
  },
  "23C-s5": {
    idealNotes: ["↑5000", "GPS X", "FREQ 119.45", "AFF", "CFM"],
    requiredCodes: ["↑5000", "GPS X", "AFF"],
    optionalCodes: ["FREQ", "CFM"],
  },
  "24C-s1": {
    idealNotes: ["HD010", "↓FL080", "LF", "LAND 15", "HD135", "ILS 27R", "VEC", "NEG"],
    requiredCodes: ["LF", "LAND", "HD135", "ILS", "NEG"],
    optionalCodes: ["↓FL080", "VEC"],
  },
  "24C-s2": {
    idealNotes: ["↓FL060", "HD160", "HLD", "ENG", "EM LND", "RWY 05L", "NEG"],
    requiredCodes: ["ENG", "EM LND", "RWY 05L", "NEG"],
    optionalCodes: ["↓FL060", "HLD"],
  },
  "24C-s3": {
    idealNotes: ["RWY 24", "PAX↓", "MED", "VACATE C", "AFF", "CFM"],
    requiredCodes: ["PAX↓", "MED", "AFF"],
    optionalCodes: ["RWY 24", "CFM"],
  },
  "24C-s4": {
    idealNotes: ["RWY 18", "RWY 36", "FOD", "MISSED APP", "HD LEFT", "AFF", "CFM"],
    requiredCodes: ["FOD", "AFF", "CFM"],
    optionalCodes: ["RWY 18", "RWY 36"],
  },
  "24C-s5": {
    idealNotes: ["RWY 01R", "TWR 118.85", "DRONE", "HLD", "NEG", "CFM"],
    requiredCodes: ["DRONE", "HLD", "NEG"],
    optionalCodes: ["RWY 01R", "CFM"],
  },
  "25C-s1": {
    idealNotes: ["TAXI H D", "GATE 10", "COLLISION", "TOW", "NEG", "CFM"],
    requiredCodes: ["COLLISION", "TOW", "NEG"],
    optionalCodes: ["GATE 10", "CFM"],
  },
  "25C-s2": {
    idealNotes: ["↓FL140", "HD160", "HOT OIL", "ENG X", "EM LND", "RWY 14", "AFF"],
    requiredCodes: ["HOT OIL", "ENG X", "EM LND", "AFF"],
    optionalCodes: ["↓FL140", "RWY 14"],
  },
  "25C-s3": {
    idealNotes: ["↓5000", "HD270", "VEC", "HD100", "DIV", "NEG"],
    requiredCodes: ["VEC", "HD100", "NEG"],
    optionalCodes: ["↓5000", "HD270"],
  },
  "25C-s4": {
    idealNotes: ["RWY 18", "FOD", "MISSED APP", "HD LEFT", "GEAR STK", "NEG"],
    requiredCodes: ["FOD", "NEG"],
    optionalCodes: ["MISSED APP", "GEAR STK"],
  },
  "25C-s5": {
    idealNotes: ["HD340", "↓5000", "ILS 17L", "BIRD", "HD LEFT 20", "AFF"],
    requiredCodes: ["BIRD", "AFF"],
    optionalCodes: ["ILS 17L", "HD340"],
  },
  "26C-s1": {
    idealNotes: ["↓4000", "BIRD", "HYD↓", "↓2000", "NEG", "CFM"],
    requiredCodes: ["HYD↓", "↓2000", "NEG"],
    optionalCodes: ["BIRD", "↓4000"],
  },
  "26C-s2": {
    idealNotes: ["RWY 24", "PAX↓", "MED", "VACATE B", "NEG", "CFM"],
    requiredCodes: ["PAX↓", "MED", "NEG"],
    optionalCodes: ["RWY 24", "CFM"],
  },
  "26C-s3": {
    idealNotes: ["RWY 05", "↓5000", "RWY 15L", "↓6000", "AFF"],
    requiredCodes: ["RWY 15L", "↓6000", "AFF"],
    optionalCodes: ["RWY 05", "↓5000"],
  },
  "26C-s4": {
    idealNotes: ["↑5000", "GPS X", "GPWS", "NEG"],
    requiredCodes: ["GPS X", "NEG"],
    optionalCodes: ["↑5000", "GPWS"],
  },
  "26C-s5": {
    idealNotes: ["RWY 10", "DOG", "HLD", "AFF"],
    requiredCodes: ["DOG", "HLD", "AFF"],
    optionalCodes: ["RWY 10"],
  },
};

export function getRecommendedNotesForSituation(situationId: string): RecommendedNotes | undefined {
  return PART2_RECOMMENDED_NOTES[situationId];
}
