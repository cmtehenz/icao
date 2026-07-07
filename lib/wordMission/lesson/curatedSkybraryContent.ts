import {
  isValidKnowledgeSummary,
  SKYBRARY_ATTRIBUTION,
  type KnowledgeSource,
} from "@/lib/wordMission/lesson/knowledgeSource";

export type SkybraryTopicId =
  | "controlled-flight-into-terrain"
  | "loss-of-control"
  | "runway-incursion"
  | "weather-avoidance"
  | "communication-error";

/** Hand-curated SKYbrary references — summaries in our own words, not scraped text. */
export const CURATED_SKYBRARY_TOPICS: Record<SkybraryTopicId, KnowledgeSource> = {
  "controlled-flight-into-terrain": {
    provider: "skybrary",
    topic: "Controlled Flight Into Terrain",
    summary:
      "CFIT happens when a serviceable aircraft flies into ground or water. Clear altitude calls and readbacks reduce risk.",
    operationalLessonIdea:
      "On approach, confirm altitude and minimum safe height — never assume you are clear of terrain.",
    icaoQuestionIdea:
      "How would you describe the crew actions that help prevent a controlled flight into terrain event?",
    sourceUrl: "https://skybrary.aero/articles/controlled-flight-into-terrain-cfit",
    sourceTitle: "Controlled Flight Into Terrain (CFIT)",
    attribution: SKYBRARY_ATTRIBUTION,
  },
  "loss-of-control": {
    provider: "skybrary",
    topic: "Loss of Control",
    summary:
      "Loss of control means the aircraft departs from normal flight. Early recognition and calm crew coordination matter.",
    operationalLessonIdea:
      "If handling degrades, slow down, fly the aircraft first, then communicate intentions clearly.",
    icaoQuestionIdea:
      "What would you tell ATC if you need to stop a climb because of unexpected aircraft behaviour?",
    sourceUrl: "https://skybrary.aero/articles/loss-control-inflight-loci",
    sourceTitle: "Loss of Control In-Flight (LOC-I)",
    attribution: SKYBRARY_ATTRIBUTION,
  },
  "runway-incursion": {
    provider: "skybrary",
    topic: "Runway Incursion",
    summary:
      "A runway incursion is any presence on a runway that creates a collision risk. Ground phraseology must be precise.",
    operationalLessonIdea:
      "Read back hold short and line up and wait exactly — never enter a runway without a clearance.",
    icaoQuestionIdea:
      "Why is a correct readback critical after 'line up and wait'?",
    sourceUrl: "https://skybrary.aero/articles/runway-incursion",
    sourceTitle: "Runway Incursion",
    attribution: SKYBRARY_ATTRIBUTION,
  },
  "weather-avoidance": {
    provider: "skybrary",
    topic: "Weather Avoidance",
    summary:
      "Weather decisions depend on timely information. Pilots request updates and state intentions when conditions change.",
    operationalLessonIdea:
      "When visibility or turbulence deteriorates, brief ATC early — request vectors or a hold before workload peaks.",
    icaoQuestionIdea:
      "How would you report deteriorating weather to ATC during an approach?",
    sourceUrl: "https://skybrary.aero/articles/weather",
    sourceTitle: "Weather",
    attribution: SKYBRARY_ATTRIBUTION,
  },
  "communication-error": {
    provider: "skybrary",
    topic: "Communication Error",
    summary:
      "Many incidents involve misunderstood radio calls. Standard phraseology, readbacks, and clarification prevent errors.",
    operationalLessonIdea:
      "If a clearance is unclear, ask ATC to say again — guessing on frequency creates risk.",
    icaoQuestionIdea:
      "What should a pilot do when unsure about an ATC instruction?",
    sourceUrl: "https://skybrary.aero/articles/communication-error",
    sourceTitle: "Communication Error",
    attribution: SKYBRARY_ATTRIBUTION,
  },
};

const TOPIC_KEYWORDS: Record<SkybraryTopicId, string[]> = {
  "controlled-flight-into-terrain": [
    "descend",
    "descent",
    "minimum",
    "altitude",
    "terrain",
    "vectors to final",
    "approach",
  ],
  "loss-of-control": [
    "engine failure",
    "engine stall",
    "loss of power",
    "loss of thrust",
    "stall",
  ],
  "runway-incursion": [
    "line up and wait",
    "hold short",
    "runway",
    "taxi",
    "cleared for takeoff",
  ],
  "weather-avoidance": [
    "weather",
    "windshear",
    "microburst",
    "turbulence",
    "icing",
    "visibility",
    "divert",
  ],
  "communication-error": [
    "squawk",
    "read back",
    "say again",
    "unable to comply",
    "confirm",
  ],
};

function matchesKeyword(term: string, keyword: string): boolean {
  const t = term.toLowerCase();
  const k = keyword.toLowerCase();
  return t === k || t.includes(k) || k.includes(t);
}

/** Match a vocab term to a curated SKYbrary topic — no scraping, keyword map only. */
export function findSkybraryKnowledge(term: string, _categoryId?: string): KnowledgeSource | null {
  const key = term.trim().toLowerCase();

  for (const [topicId, keywords] of Object.entries(TOPIC_KEYWORDS) as [SkybraryTopicId, string[]][]) {
    if (keywords.some((kw) => matchesKeyword(key, kw))) {
      const entry = CURATED_SKYBRARY_TOPICS[topicId];
      if (entry && isValidKnowledgeSummary(entry.summary)) return entry;
    }
  }

  return null;
}

export function listSkybraryTopics(): SkybraryTopicId[] {
  return Object.keys(CURATED_SKYBRARY_TOPICS) as SkybraryTopicId[];
}
