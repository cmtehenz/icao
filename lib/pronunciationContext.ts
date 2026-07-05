import type { WordContextPack } from "@/lib/pronunciationVault";

/** Manual aviation context for common vault words. */
const CONTEXT_OVERRIDES: Record<string, WordContextPack> = {
  fuel: {
    expression: "remaining fuel",
    sentence: "We checked our remaining fuel before deciding to divert.",
    icaoPrompt: "What are your responsibilities during cruise?",
    fragment: "During cruise, I monitor the route, weather and remaining fuel.",
  },
  turbulence: {
    expression: "severe turbulence",
    sentence: "We experienced severe turbulence during the approach.",
    icaoPrompt: "Tell me about a difficult weather situation.",
    fragment: "During the approach, we encountered severe turbulence and reduced speed.",
  },
  weather: {
    expression: "weather conditions",
    sentence: "We reviewed the weather conditions before departure.",
    icaoPrompt: "How do you prepare for changing weather?",
    fragment: "Before departure, I always check weather, NOTAMs and alternates.",
  },
  clearance: {
    expression: "runway clearance",
    sentence: "We received runway clearance after reporting ready.",
    icaoPrompt: "What makes a briefing effective?",
    fragment: "First of all, I confirm clearance, frequency and taxi route.",
  },
  helicopter: {
    expression: "helicopter operations",
    sentence: "Helicopter operations require careful power management.",
    icaoPrompt: "Tell me about your background as a pilot.",
    fragment: "I fly helicopter operations and focus on CRM and safety.",
  },
  safety: {
    expression: "safety culture",
    sentence: "Safety culture helps pilots speak up during CRM.",
    icaoPrompt: "What is the importance of CRM?",
    fragment: "Additionally, safety culture supports open communication in the cockpit.",
  },
  pilot: {
    expression: "experienced pilot",
    sentence: "An experienced pilot monitors fuel, weather and crew coordination.",
    icaoPrompt: "Tell me about your background as a pilot.",
    fragment: "I am an experienced pilot and I train ICAO English daily.",
  },
  route: {
    expression: "planned route",
    sentence: "We briefed the planned route and alternates before takeoff.",
    icaoPrompt: "What do you do before a flight?",
    fragment: "Before a flight, I review the route, weather and NOTAMs.",
  },
  approach: {
    expression: "final approach",
    sentence: "During final approach, we monitored speed and configuration.",
    icaoPrompt: "When should a pilot perform a missed approach?",
    fragment: "On final approach, I maintain stable speed and call out deviations.",
  },
  emergency: {
    expression: "engine emergency",
    sentence: "During an engine emergency, we follow the checklist immediately.",
    icaoPrompt: "When do pilots need to perform an emergency landing?",
    fragment: "In an emergency, I prioritize aviate, navigate and communicate.",
  },
};

const EXPRESSION_TEMPLATES = [
  (w: string) => `${w} check`,
  (w: string) => `${w} management`,
  (w: string) => `${w} procedure`,
  (w: string) => `critical ${w}`,
];

const SENTENCE_TEMPLATES = [
  (w: string, expr: string) => `We monitored ${expr} during the flight.`,
  (w: string, expr: string) => `The crew discussed ${expr} before departure.`,
  (w: string, expr: string) => `During cruise, we reviewed ${expr} with ATC.`,
];

const ICAO_PROMPTS = [
  "Tell me about a difficult situation you have had in a flight.",
  "What do you do before a flight?",
  "Why is CRM important?",
  "What makes a briefing effective?",
  "How does weather affect your decisions?",
];

const FRAGMENT_TEMPLATES = [
  (w: string, expr: string) =>
    `First of all, I monitor ${expr}. For example, during cruise I stay alert to ${w} issues.`,
  (w: string, expr: string) =>
    `In my opinion, ${expr} is essential. Additionally, I brief the crew about ${w}.`,
];

function pickStable<T>(items: T[], seed: string): T {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash + seed.charCodeAt(i) * (i + 1)) % items.length;
  return items[hash]!;
}

/** Template-based context pack — cached on the vault word after first use. */
export function buildWordContextPack(word: string): WordContextPack {
  const key = word.toLowerCase().trim();
  const override = CONTEXT_OVERRIDES[key];
  if (override) return { ...override };

  const expression = pickStable(EXPRESSION_TEMPLATES, key)(key);
  const sentence = pickStable(SENTENCE_TEMPLATES, key)(key, expression);
  const icaoPrompt = pickStable(ICAO_PROMPTS, key);
  const fragment = pickStable(FRAGMENT_TEMPLATES, key)(key, expression);

  return { expression, sentence, icaoPrompt, fragment };
}

export function ensureWordContext(word: string, existing?: WordContextPack): WordContextPack {
  if (existing?.expression && existing.sentence && existing.icaoPrompt && existing.fragment) {
    return existing;
  }
  return buildWordContextPack(word);
}
