export type QuickNoteCategory = {
  id: string;
  label: string;
  color: "nav" | "atc" | "emergency" | "weather" | "intention" | "traffic" | "comm";
  codes: string[];
};

export const QUICK_NOTE_CATEGORIES: QuickNoteCategory[] = [
  {
    id: "altitude",
    label: "Altitude",
    color: "nav",
    codes: ["↑", "↓", "↑FL", "↓FL"],
  },
  {
    id: "heading",
    label: "Heading",
    color: "nav",
    codes: ["HD"],
  },
  {
    id: "runway",
    label: "Runway / Approach",
    color: "nav",
    codes: ["RWY", "ILS", "RNAV", "VIS"],
  },
  {
    id: "frequency",
    label: "Frequency",
    color: "nav",
    codes: ["FREQ"],
  },
  {
    id: "atc",
    label: "ATC",
    color: "atc",
    codes: ["MNT", "HLD", "DCT", "VEC", "PRC", "EXPECT", "CFM", "RPT", "APP", "DEP", "TWR"],
  },
  {
    id: "aircraft",
    label: "Aircraft Problems",
    color: "emergency",
    codes: [
      "ENG X",
      "ENG FIRE",
      "LOP",
      "HOT OIL",
      "HYD↓",
      "HYD L",
      "ELEC X",
      "GPS X",
      "FMS X",
      "PROP X",
      "SMK",
      "FIRE",
      "CAB",
      "DOOR",
      "GEAR",
      "GEAR↓",
      "GEAR↑",
      "GEAR STK",
    ],
  },
  {
    id: "weather",
    label: "Weather",
    color: "weather",
    codes: ["WX", "VIS↓", "WND", "TS", "TURB", "WS", "ICE"],
  },
  {
    id: "fuel",
    label: "Fuel",
    color: "emergency",
    codes: ["LF", "FUEL!!", "DUMP"],
  },
  {
    id: "medical",
    label: "Medical",
    color: "emergency",
    codes: ["MED", "PAX↓", "PAX", "PIC X"],
  },
  {
    id: "intention",
    label: "Intention",
    color: "intention",
    codes: ["RTN", "DIV", "LAND", "EM LND", "ALT"],
  },
  {
    id: "traffic",
    label: "Traffic / Field",
    color: "traffic",
    codes: ["BIRD", "DRONE", "FOD", "DOG"],
  },
  {
    id: "comm",
    label: "Communication",
    color: "comm",
    codes: ["READBK", "NEG", "AFF", "SAY AGN"],
  },
];
