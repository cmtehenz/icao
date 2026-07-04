import type { EvaluateFeedback } from "@/lib/evaluate/types";
import type {
  FlightInstructorReport,
  NaturalnessLevel,
  SkillBand,
  SkillBandNote,
} from "@/lib/flightInstructor/types";

type LegacyReport = Partial<FlightInstructorReport> & {
  positiveFeedback?: string[];
  confidenceMessage?: string;
  personalCoaching?: string | null;
  nextMission?: { items: string[]; estimatedMinutes: number };
  pilotLanguage?: { term: string; usage: string }[];
  icaoEvaluation?: {
    pronunciation: string;
    fluency: string;
    vocabulary: string;
    structure: string;
    interaction: string;
    estimatedLevel: number;
    disclaimer: string;
  };
  pilotVocabulary?: {
    rating?: string;
    missingExpressions?: string[];
    alreadyUsed?: string[];
    nextToLearn?: string[];
  };
  memoryCoaching?: { note: string };
  naturalnessReview?: {
    level?: string;
    levelWhy?: string;
    summary?: string;
    suggestions?: FlightInstructorReport["naturalnessReview"]["suggestions"];
  };
};

export function normalizeNaturalnessLevel(level?: string): NaturalnessLevel {
  if (level === "acceptable") return "understandable";
  if (
    level === "professional_pilot" ||
    level === "natural" ||
    level === "understandable" ||
    level === "scripted" ||
    level === "needs_improvement"
  ) {
    return level;
  }
  return "understandable";
}

function scoreToBand(score: number): SkillBand {
  if (score >= 75) return "operational";
  if (score >= 55) return "developing";
  return "needs_practice";
}

function textToBand(text: string, score: number): SkillBand {
  const lower = text.toLowerCase();
  if (/operational|strong|good|clear|solid/.test(lower)) return "operational";
  if (/developing|progress|improving|reasonable/.test(lower)) return "developing";
  if (/needs|weak|practice|work on/.test(lower)) return "needs_practice";
  return scoreToBand(score);
}

function matchedKeywords(
  feedback?: EvaluateFeedback,
  keywords?: string[],
): string[] {
  if (!feedback || !keywords?.length) return [];
  const missing = new Set(feedback.missingKeywords.map((k) => k.toLowerCase()));
  return keywords.filter((k) => !missing.has(k.toLowerCase()));
}

function legacyBand(text: string, score: number): SkillBandNote {
  return {
    band: textToBand(text, score),
    detail: text.replace(/\d+\/100\.?/g, "").trim() || "Keep practicing in the next recording.",
  };
}

/** Normalize OpenAI or legacy-shaped payloads into Captain Delta report shape. */
export function normalizeFlightInstructorReport(
  raw: LegacyReport,
  fallback: {
    transcript: string;
    modelAnswer: string;
    feedback?: EvaluateFeedback;
    keywords?: string[];
    source: "openai" | "local";
  },
): FlightInstructorReport {
  const fb = fallback.feedback;
  const scores = fb?.scores;

  const level = normalizeNaturalnessLevel(raw.naturalnessReview?.level);
  const positiveOpening =
    raw.positiveOpening?.length
      ? raw.positiveOpening.slice(0, 2)
      : (raw.positiveFeedback?.slice(0, 2) ?? ["You completed a spoken answer — that builds real exam confidence."]);

  const pilotLanguageReview =
    raw.pilotLanguageReview?.length
      ? raw.pilotLanguageReview.slice(0, 3)
      : (raw.pilotLanguage?.slice(0, 3) ?? []);

  const mission = raw.mission ?? {
    title: "Next attempt",
    expressions: raw.nextMission?.items?.slice(0, 4) ?? ["situational awareness", "conservative decision"],
    estimatedMinutes: raw.nextMission?.estimatedMinutes ?? 8,
  };

  const pilotVocabulary = {
    alreadyUsed:
      raw.pilotVocabulary?.alreadyUsed?.length
        ? raw.pilotVocabulary.alreadyUsed
        : matchedKeywords(fb, fallback.keywords),
    nextToLearn:
      raw.pilotVocabulary?.nextToLearn ??
      raw.pilotVocabulary?.missingExpressions?.slice(0, 5) ??
      fb?.missingKeywords?.slice(0, 5) ??
      [],
  };

  const icaoFromLegacy = raw.icaoEvaluation;
  const icaoFromNew = raw.icaoBands;

  const icaoBands = icaoFromNew ?? {
    pronunciation: legacyBand(
      icaoFromLegacy?.pronunciation ?? "Pronunciation for operational comms.",
      scores?.pronunciation ?? 60,
    ),
    fluency: legacyBand(icaoFromLegacy?.fluency ?? "Fluency and pacing.", scores?.overall ?? 60),
    vocabulary: legacyBand(
      icaoFromLegacy?.vocabulary ?? "Aviation vocabulary.",
      scores?.content ?? 60,
    ),
    structure: legacyBand(
      icaoFromLegacy?.structure ?? "Answer structure.",
      scores?.structure ?? 60,
    ),
    interaction: legacyBand(
      icaoFromLegacy?.interaction ?? "Interaction clarity.",
      scores?.phraseology ?? 60,
    ),
    estimatedLevel:
      icaoFromLegacy?.estimatedLevel ?? fb?.icaoLevel?.overall ?? 4,
    disclaimer:
      icaoFromLegacy?.disclaimer ??
      "Training estimate — not an official SDEA/ANAC rating.",
  };

  const priorityImprovement = raw.priorityImprovement ?? {
    focus: "More natural pilot language",
    detail: "Focus on one operational phrase at a time in your next recording.",
  };

  return {
    positiveOpening,
    naturalnessReview: {
      summary:
        raw.naturalnessReview?.summary ??
        "Your answer was understandable — a few wording changes would make it sound more like cockpit English.",
      suggestions: raw.naturalnessReview?.suggestions?.slice(0, 2) ?? [],
      level,
      levelWhy:
        raw.naturalnessReview?.levelWhy ??
        "Based on how operational and natural your phrasing sounded.",
    },
    pilotLanguageReview,
    priorityImprovement,
    mission: {
      title: mission.title ?? "Practice mission",
      expressions: mission.expressions?.slice(0, 4) ?? [],
      estimatedMinutes: mission.estimatedMinutes ?? 8,
    },
    improvedAnswer: {
      studentVersion:
        (raw.improvedAnswer?.studentVersion ?? fallback.transcript) || "(no speech detected)",
      coachVersion:
        raw.improvedAnswer?.coachVersion ??
        fb?.suggestedAnswer ??
        fallback.modelAnswer,
      whatChanged: raw.improvedAnswer?.whatChanged?.slice(0, 4) ?? [],
    },
    pilotVocabulary,
    icaoBands,
    memoryNote: raw.memoryNote ?? raw.personalCoaching ?? raw.memoryCoaching?.note ?? null,
    followUpQuestion: raw.followUpQuestion ?? null,
    closingLine:
      raw.closingLine ??
      raw.confidenceMessage ??
      "Solid effort — record again and apply today's mission.",
    source: raw.source ?? fallback.source,
  };
}
