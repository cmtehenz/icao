function normalize(text: string): string {
  return text.toLowerCase().replace(/[^\w\s'-]/g, " ").replace(/\s+/g, " ").trim();
}

/** Semantic aliases — keywords are ideas, not exact words to memorize. */
const ALIASES: Record<string, string[]> = {
  unsafe: ["unsafe", "not safe", "not safe to land", "cannot land", "can't land", "safe landing cannot"],
  weather: ["weather", "bad weather", "poor visibility", "visibility"],
  runway: ["runway", "runway obstruction", "traffic on the runway"],
  "try again": [
    "try again",
    "another approach",
    "go around",
    "divert",
    "tries another approach",
    "try another approach",
  ],
  young: ["young", "very young", "when i was"],
  helicopters: ["helicopter", "helicopters"],
  training: ["training", "flight training", "learn to fly", "learning to fly"],
  career: ["career", "helicopter pilot", "work as a pilot", "my job", "my life"],
  safe: ["safe", "safe environment", "without risk", "without any real risk", "no real risk"],
  practice: ["practice", "train", "training", "simulate"],
  emergencies: [
    "emergenc",
    "engine failure",
    "bad weather",
    "system failure",
    "hydraulic failure",
    "malfunction",
  ],
  confidence: ["confident", "confidence", "better prepared", "prepared"],
  clear: ["clear", "easy to understand", "complete", "focused on safety"],
  information: ["information", "weather", "fuel", "aircraft status", "landing site"],
  risk: ["risk", "obstacles", "emergency", "power margin"],
  team: ["team", "crew", "aligned", "coordination"],
  situation: ["situation", "difficult", "visibility", "workload"],
  actions: ["calm", "communicat", "safest option", "chose", "decide"],
  lesson: ["lesson", "learned", "taught me", "prepare", "divert"],
  preparation: ["preparation", "prepare", "review", "procedures", "emergency actions"],
  calmness: ["calm", "calmness", "stay calm", "hover"],
  physical: ["physical", "medical", "fit to fly", "conditions"],
  mental: ["mental", "stress", "fatigue", "concentration"],
  digital: ["digital", "technology", "modern"],
  ai: ["ai", "artificial intelligence", "routine tasks"],
  radio: ["radio", "voice contact", "communicate by radio"],
  discipline: ["discipline", "procedures", "checklists", "standard calls"],
  limits: ["limits", "aircraft limits", "power", "weight", "weather limitations"],
  technology: ["technology", "technological", "connected", "navigation"],
  growth: ["growth", "grow", "expand", "offshore", "hems"],
  location: ["location", "region", "terrain", "weather patterns"],
  operations: ["operations", "procedures", "helipad", "traffic pattern"],
  experience: ["experience", "familiarity", "regularly", "confidence"],
  standard: ["standard", "around the world", "worldwide", "phraseology"],
  safety: ["safety", "flight safety", "safe decision", "good judgment"],
};

export function keywordMatchesFlexible(transcript: string, keyword: string): boolean {
  const t = normalize(transcript);
  const key = normalize(keyword);
  const phrases = ALIASES[key] ?? [key];
  return phrases.some((phrase) => {
    const parts = phrase.split(" ").filter(Boolean);
    return parts.length > 0 && parts.every((p) => t.includes(p));
  });
}
