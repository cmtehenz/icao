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
    confirm: {
      idealNotes: ["HLD", "CFM"],
      requiredCodes: ["HLD", "CFM"],
      optionalCodes: [],
    },
  },
  "23C-s2": {
    idealNotes: ["RWY HDG", "↑3000", "FREQ 119.25", "FIRE", "CAB", "RTN", "↓FL050", "HD060", "NEG"],
    requiredCodes: ["FIRE", "CAB", "RTN", "↓FL050", "HD060", "NEG"],
    optionalCodes: ["FREQ", "↑3000", "RWY HDG"],
    readback: {
      idealNotes: ["RWY HDG", "↑3000", "FREQ 119.25"],
      requiredCodes: ["RWY HDG", "↑3000"],
      optionalCodes: ["FREQ 119.25", "FREQ"],
    },
  },
  "23C-s3": {
    idealNotes: [
      "TAXI R F",
      "HOLD SHRT B",
      "RWY 31R",
      "FREQ 118.1",
      "CAB",
      "RTN",
      "HLD",
      "SQK 7700",
      "↓15000",
      "DCT BOG",
      "NEG",
    ],
    requiredCodes: ["CAB", "RTN", "HLD", "SQK 7700", "↓15000", "NEG"],
    optionalCodes: ["RWY 31R", "DCT BOG", "FREQ 118.1"],
    readback: {
      idealNotes: ["TAXI R F", "HOLD SHRT B", "RWY 31R", "FREQ 118.1"],
      requiredCodes: ["TAXI R F", "RWY 31R"],
      optionalCodes: ["HOLD SHRT B", "FREQ 118.1"],
    },
  },
  "23C-s4": {
    idealNotes: ["HD190", "↓4000", "RPT 8000", "RWY 35R", "BIRD", "HD LEFT 30", "NEG"],
    requiredCodes: ["HD190", "↓4000", "BIRD", "HD LEFT 30", "NEG"],
    optionalCodes: ["RWY 35R", "RPT 8000"],
    readback: {
      idealNotes: ["HD190", "↓4000", "RPT 8000", "RWY 35R"],
      requiredCodes: ["HD190", "↓4000"],
      optionalCodes: ["RPT 8000", "RWY 35R"],
    },
  },
  "23C-s5": {
    idealNotes: ["↑5000", "SQK 3432", "DCT FLL", "FREQ 119.45", "GPS X", "AFF", "CFM"],
    requiredCodes: ["↑5000", "GPS X", "AFF", "CFM"],
    optionalCodes: ["SQK 3432", "DCT FLL", "FREQ 119.45"],
    readback: {
      idealNotes: ["↑5000", "SQK 3432", "DCT FLL", "FREQ 119.45"],
      requiredCodes: ["↑5000", "SQK 3432"],
      optionalCodes: ["DCT FLL", "FREQ 119.45"],
    },
  },
  "24C-s1": {
    idealNotes: ["HD010", "↓FL080", "SPD 120", "LF", "LAND 15", "HD135", "ILS 27R", "VEC", "NEG"],
    requiredCodes: ["LF", "LAND 15", "HD135", "ILS 27R", "VEC", "NEG"],
    optionalCodes: ["↓FL080", "HD010", "SPD 120"],
    readback: {
      idealNotes: ["HD010", "↓FL080", "SPD 120"],
      requiredCodes: ["HD010", "↓FL080"],
      optionalCodes: ["SPD 120"],
    },
  },
  "24C-s2": {
    idealNotes: ["↓FL060", "HD160", "HLD WHI", "ENG", "EM LND", "DCT MAN", "RWY 05L", "NEG"],
    requiredCodes: ["ENG", "EM LND", "DCT MAN", "RWY 05L", "NEG"],
    optionalCodes: ["↓FL060", "HD160", "HLD WHI"],
    readback: {
      idealNotes: ["↓FL060", "HD160", "HLD WHI"],
      requiredCodes: ["↓FL060", "HD160"],
      optionalCodes: ["HLD WHI"],
    },
  },
  "24C-s3": {
    idealNotes: ["BACKTRACK", "RWY 24", "LUAW", "RPT READY", "PAX↓", "MED", "VACATE C", "PKT 3", "AFF"],
    requiredCodes: ["PAX↓", "MED", "VACATE C", "PKT 3", "AFF"],
    optionalCodes: ["RWY 24", "BACKTRACK"],
    readback: {
      idealNotes: ["BACKTRACK", "RWY 24", "LUAW", "RPT READY"],
      requiredCodes: ["BACKTRACK", "RWY 24"],
      optionalCodes: ["LUAW", "RPT READY"],
    },
  },
  "24C-s4": {
    idealNotes: ["APP RWY 18", "CIRCL RWY 36", "RPT DOWNWIND", "FOD", "MISSED APP", "HD LEFT", "AFF", "CFM"],
    requiredCodes: ["FOD", "MISSED APP", "HD LEFT", "AFF", "CFM"],
    optionalCodes: ["APP RWY 18", "CIRCL RWY 36"],
    readback: {
      idealNotes: ["APP RWY 18", "CIRCL RWY 36", "RPT DOWNWIND"],
      requiredCodes: ["APP RWY 18", "CIRCL RWY 36"],
      optionalCodes: ["RPT DOWNWIND"],
    },
  },
  "24C-s5": {
    idealNotes: ["TAXI G B A", "RWY 01R", "FREQ 118.85", "DRONE", "HLD", "NEG"],
    requiredCodes: ["DRONE", "HLD", "NEG"],
    optionalCodes: ["RWY 01R", "FREQ 118.85"],
    readback: {
      idealNotes: ["TAXI G B A", "RWY 01R", "FREQ 118.85"],
      requiredCodes: ["TAXI G B A", "RWY 01R"],
      optionalCodes: ["FREQ 118.85"],
    },
  },
  "25C-s1": {
    idealNotes: ["TAXI H D", "GATE 10", "CROSS RWY 17", "RPT VAC", "COLLISION", "TOW", "NEG"],
    requiredCodes: ["COLLISION", "TOW", "NEG"],
    optionalCodes: ["GATE 10", "TAXI H D", "CROSS RWY 17", "RPT VAC"],
    readback: {
      idealNotes: ["TAXI H D", "GATE 10", "CROSS RWY 17", "RPT VAC"],
      requiredCodes: ["TAXI H D", "GATE 10"],
      optionalCodes: ["CROSS RWY 17", "RPT VAC"],
    },
  },
  "25C-s2": {
    idealNotes: ["↓FL140", "HD160", "HLD CG", "HOT OIL", "ENG X", "EM LND", "DCT CG", "RWY 14", "AFF"],
    requiredCodes: ["HOT OIL", "ENG X", "EM LND", "DCT CG", "RWY 14", "AFF"],
    optionalCodes: ["↓FL140", "HD160", "HLD CG"],
    readback: {
      idealNotes: ["↓FL140", "HD160", "HLD CG"],
      requiredCodes: ["↓FL140", "HD160"],
      optionalCodes: ["HLD CG"],
    },
  },
  "25C-s3": {
    idealNotes: ["↓5000", "HD270", "SPD 110", "VEC", "HD100", "DIV", "NEG"],
    requiredCodes: ["VEC", "HD100", "DIV", "NEG"],
    optionalCodes: ["↓5000", "HD270", "SPD 110"],
    readback: {
      idealNotes: ["↓5000", "HD270", "SPD 110"],
      requiredCodes: ["↓5000", "HD270"],
      optionalCodes: ["SPD 110"],
    },
    confirm: {
      idealNotes: ["HD100", "DIV", "NEG"],
      requiredCodes: ["HD100", "DIV", "NEG"],
      optionalCodes: [],
    },
  },
  "25C-s4": {
    idealNotes: ["APP RWY 18", "CIRCL RWY 36", "RPT DOWNWIND", "FOD", "MISSED APP", "HD LEFT", "GEAR STK", "NEG"],
    requiredCodes: ["FOD", "MISSED APP", "HD LEFT", "GEAR STK", "NEG"],
    optionalCodes: ["APP RWY 18", "CIRCL RWY 36"],
    readback: {
      idealNotes: ["APP RWY 18", "CIRCL RWY 36", "RPT DOWNWIND"],
      requiredCodes: ["APP RWY 18", "CIRCL RWY 36"],
      optionalCodes: ["RPT DOWNWIND"],
    },
    confirm: {
      idealNotes: ["HD LEFT", "GEAR STK", "NEG"],
      requiredCodes: ["HD LEFT", "GEAR STK", "NEG"],
      optionalCodes: [],
    },
  },
  "25C-s5": {
    idealNotes: ["HD340", "↓5000", "RPT 9000", "ILS 17L", "BIRD", "HD LEFT 20", "AFF"],
    requiredCodes: ["BIRD", "HD LEFT 20", "AFF"],
    optionalCodes: ["ILS 17L", "HD340", "↓5000", "RPT 9000"],
    readback: {
      idealNotes: ["HD340", "↓5000", "RPT 9000", "ILS 17L"],
      requiredCodes: ["HD340", "↓5000"],
      optionalCodes: ["RPT 9000", "ILS 17L"],
    },
  },
  "26C-s1": {
    idealNotes: ["ARR", "↓4000", "RPT 6000", "QNH 1013", "BIRD", "HYD↓", "↓2000", "SPD", "NEG"],
    requiredCodes: ["HYD↓", "↓2000", "SPD", "NEG"],
    optionalCodes: ["↓4000", "RPT 6000", "QNH 1013", "BIRD"],
    readback: {
      idealNotes: ["ARR", "↓4000", "RPT 6000", "QNH 1013", "BIRD"],
      requiredCodes: ["↓4000", "RPT 6000"],
      optionalCodes: ["ARR", "QNH 1013", "BIRD"],
    },
  },
  "26C-s2": {
    idealNotes: ["BACKTRACK", "RWY 24", "LUAW", "RPT READY", "PAX↓", "MED", "VACATE B", "HLD", "NEG"],
    requiredCodes: ["PAX↓", "MED", "VACATE B", "HLD", "NEG"],
    optionalCodes: ["RWY 24", "BACKTRACK"],
    readback: {
      idealNotes: ["BACKTRACK", "RWY 24", "LUAW", "RPT READY"],
      requiredCodes: ["BACKTRACK", "RWY 24"],
      optionalCodes: ["LUAW", "RPT READY"],
    },
  },
  "26C-s3": {
    idealNotes: ["VIS APP RWY 05", "↓5000", "REQ 15L", "↓6000", "SPD 80", "AFF"],
    requiredCodes: ["RWY 15L", "↓6000", "SPD 80", "AFF"],
    optionalCodes: ["VIS APP RWY 05", "↓5000", "REQ 15L"],
    readback: {
      idealNotes: ["VIS APP RWY 05", "↓5000"],
      requiredCodes: ["VIS APP RWY 05", "↓5000"],
      optionalCodes: [],
    },
    confirm: {
      idealNotes: ["↓6000", "SPD 80", "AFF"],
      requiredCodes: ["↓6000", "SPD 80", "AFF"],
      optionalCodes: [],
    },
  },
  "26C-s4": {
    idealNotes: ["↑5000", "SQK 3432", "DCT FLL", "FREQ 119.45", "GPS X", "GPWS", "NEG"],
    requiredCodes: ["GPS X", "GPWS", "NEG"],
    optionalCodes: ["↑5000", "SQK 3432", "DCT FLL", "FREQ 119.45"],
    readback: {
      idealNotes: ["↑5000", "SQK 3432", "DCT FLL", "FREQ 119.45"],
      requiredCodes: ["↑5000", "SQK 3432"],
      optionalCodes: ["DCT FLL", "FREQ 119.45"],
    },
    confirm: {
      idealNotes: ["GPWS", "NEG"],
      requiredCodes: ["GPWS", "NEG"],
      optionalCodes: [],
    },
  },
  "26C-s5": {
    idealNotes: ["TAXI J B", "RWY 10", "FREQ 118.6", "DOG", "HLD", "AFF"],
    requiredCodes: ["DOG", "HLD", "AFF"],
    optionalCodes: ["RWY 10", "FREQ 118.6"],
    readback: {
      idealNotes: ["TAXI J B", "RWY 10", "FREQ 118.6"],
      requiredCodes: ["TAXI J B", "RWY 10"],
      optionalCodes: ["FREQ 118.6"],
    },
  },
};

export function getRecommendedNotesForSituation(situationId: string): RecommendedNotes | undefined {
  return PART2_RECOMMENDED_NOTES[situationId];
}
