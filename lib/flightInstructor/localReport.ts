import type { EvaluateFeedback } from "@/lib/evaluate/types";
import type { FlightInstructorReport, NaturalnessLevel, SkillBand } from "@/lib/flightInstructor/types";
import { normalizeFlightInstructorReport } from "@/lib/flightInstructor/normalizeReport";

function naturalnessFromScores(overall: number): NaturalnessLevel {
  if (overall >= 85) return "professional_pilot";
  if (overall >= 72) return "natural";
  if (overall >= 58) return "understandable";
  if (overall >= 42) return "scripted";
  return "needs_improvement";
}

function scoreToBand(score: number): SkillBand {
  if (score >= 75) return "operational";
  if (score >= 55) return "developing";
  return "needs_practice";
}

function bandDetail(label: string, score: number): string {
  const band = scoreToBand(score);
  if (band === "operational") return `${label} sounds operational for exam practice.`;
  if (band === "developing") return `${label} is developing — one focused repetition will help.`;
  return `${label} needs practice — use the mission expressions in your next attempt.`;
}

/** Build Captain Delta report from evaluate feedback when OpenAI is unavailable. */
export function buildLocalInstructorReport(
  feedback: EvaluateFeedback,
  question: string,
  modelAnswer: string,
  keywords: string[] = [],
): FlightInstructorReport {
  const transcript = feedback.transcript.trim();
  const level = feedback.icaoLevel?.overall ?? 4;
  const nat = naturalnessFromScores(feedback.scores.overall);

  const positives =
    feedback.strengths.length > 0
      ? feedback.strengths.slice(0, 2)
      : [
          "You delivered a full spoken answer — that builds real SDEA confidence.",
          "Your answer shows you understood the scenario.",
        ];

  const suggestions = feedback.improvements.slice(0, 2).map((imp, i) => ({
    studentPhrase:
      i === 0
        ? transcript.slice(0, 90) + (transcript.length > 90 ? "…" : "")
        : imp.slice(0, 60),
    pilotPhrase: modelAnswer.split(/[.!?]/)[0]?.trim() ?? modelAnswer.slice(0, 100),
    why: imp,
  }));

  const coachVersion =
    feedback.suggestedAnswer?.trim() ||
    (transcript.length > 20 ? transcript : modelAnswer);

  const alreadyUsed = keywords
    ? keywords.filter((k) => !feedback.missingKeywords.some((m) => m.toLowerCase() === k.toLowerCase()))
    : [];
  const nextToLearn = feedback.missingKeywords.slice(0, 5);

  const priorityFocus =
    nat === "scripted" || nat === "needs_improvement"
      ? "More natural pilot language"
      : nextToLearn.length
        ? "Operational aviation vocabulary"
        : "Smoother connectors between ideas";

  const raw = {
    positiveOpening: positives,
    naturalnessReview: {
      summary:
        nat === "professional_pilot" || nat === "natural"
          ? "You sounded reasonably pilot-like. Small wording upgrades would make it sharper."
          : "Some phrases read like translated English — shorter, operational wording will help.",
      suggestions,
      level: nat,
      levelWhy:
        nat === "professional_pilot" || nat === "natural"
          ? "Your phrasing fits how experienced pilots brief and explain decisions."
          : "A few sentences still sound textbook rather than cockpit communication.",
    },
    pilotLanguageReview: feedback.missingKeywords.slice(0, 3).map((term) => ({
      term,
      usage: `Pilots use "${term}" in briefings and CRM — try it in your next answer.`,
    })),
    priorityImprovement: {
      focus: priorityFocus,
      detail:
        priorityFocus === "More natural pilot language"
          ? "Rewrite one sentence at a time using the pilot phrases above — do not memorize a full script."
          : `Work "${nextToLearn[0] ?? "situational awareness"}" into your next recording once.`,
    },
    mission: {
      title: "Operational phrases",
      expressions: [
        ...nextToLearn.slice(0, 2),
        "conservative decision",
        "situational awareness",
      ]
        .filter(Boolean)
        .slice(0, 3),
      estimatedMinutes: 8,
    },
    improvedAnswer: {
      studentVersion: transcript || "(no speech detected)",
      coachVersion,
      whatChanged: feedback.improvements.slice(0, 3).map((imp) => ({
        change: imp,
        why: "Sounds more natural in operational aviation English.",
      })),
    },
    pilotVocabulary: { alreadyUsed, nextToLearn },
    icaoBands: {
      pronunciation: {
        band: scoreToBand(feedback.scores.pronunciation),
        detail: bandDetail("Pronunciation", feedback.scores.pronunciation),
      },
      fluency: {
        band: scoreToBand(feedback.scores.overall),
        detail: "Keep a steady pace with clear pauses between ideas.",
      },
      vocabulary: {
        band: scoreToBand(feedback.scores.content),
        detail: bandDetail("Aviation vocabulary", feedback.scores.content),
      },
      structure: {
        band: scoreToBand(feedback.scores.structure),
        detail: bandDetail("Structure", feedback.scores.structure),
      },
      interaction: {
        band: scoreToBand(feedback.scores.phraseology),
        detail: bandDetail("Interaction", feedback.scores.phraseology),
      },
      estimatedLevel: level,
      disclaimer: "Training estimate — not an official SDEA/ANAC rating.",
    },
    memoryNote: null,
    followUpQuestion:
      question.toLowerCase().includes("weather") ||
      question.toLowerCase().includes("decision")
        ? "What made you choose that course of action instead of continuing?"
        : null,
    closingLine:
      feedback.scores.overall >= 70
        ? "Solid structure — one more recording with today's mission will sharpen it."
        : "Good raw material — focus on one improvement, then record again.",
    source: "local" as const,
  };

  return normalizeFlightInstructorReport(raw, {
    transcript,
    modelAnswer,
    feedback,
    keywords,
    source: "local",
  });
}
