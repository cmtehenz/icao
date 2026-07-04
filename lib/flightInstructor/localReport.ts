import type { EvaluateFeedback } from "@/lib/evaluate/types";
import type { FlightInstructorReport, NaturalnessLevel, PilotVocabRating } from "@/lib/flightInstructor/types";

function naturalnessFromScores(overall: number): NaturalnessLevel {
  if (overall >= 82) return "professional_pilot";
  if (overall >= 70) return "natural";
  if (overall >= 55) return "acceptable";
  return "scripted";
}

function vocabRating(content: number, missing: number): PilotVocabRating {
  if (content >= 80 && missing <= 1) return "excellent";
  if (content >= 65) return "good";
  return "needs_improvement";
}

/** Build instructor-shaped report from existing evaluate feedback when OpenAI is unavailable. */
export function buildLocalInstructorReport(
  feedback: EvaluateFeedback,
  question: string,
  modelAnswer: string,
): FlightInstructorReport {
  const transcript = feedback.transcript.trim();
  const level = feedback.icaoLevel?.overall ?? 4;
  const nat = naturalnessFromScores(feedback.scores.overall);

  const positives =
    feedback.strengths.length > 0
      ? feedback.strengths.slice(0, 4)
      : [
          "You completed a full spoken answer — that already builds exam confidence.",
          "Your answer shows you understood the question.",
        ];

  const suggestions = feedback.improvements.slice(0, 3).map((imp) => ({
    studentPhrase: transcript.slice(0, 80) + (transcript.length > 80 ? "…" : ""),
    pilotPhrase: modelAnswer.split(/[.!?]/)[0]?.trim() ?? modelAnswer.slice(0, 120),
    why: imp,
  }));

  const coachVersion =
    feedback.suggestedAnswer?.trim() ||
    (transcript.length > 20 ? transcript : modelAnswer);

  return {
    positiveFeedback: positives,
    naturalnessReview: {
      summary:
        nat === "professional_pilot" || nat === "natural"
          ? "Your answer sounded reasonably pilot-like. Small wording upgrades would make it more professional."
          : "Some phrases sound like textbook English rather than cockpit communication. Focus on shorter, operational wording.",
      suggestions,
      level: nat,
    },
    icaoEvaluation: {
      pronunciation: `Training note: pronunciation score ${feedback.scores.pronunciation}/100.`,
      fluency: `Keep a steady pace with clear pauses between ideas.`,
      vocabulary: `Aviation vocabulary score ${feedback.scores.content}/100 — use operational terms where possible.`,
      structure: `Structure score ${feedback.scores.structure}/100 — organize: situation → action → outcome.`,
      interaction: `Interaction clarity ${feedback.scores.phraseology}/100.`,
      estimatedLevel: level,
      disclaimer: "This is a training estimate — not an official SDEA/ANAC rating.",
    },
    improvedAnswer: {
      studentVersion: transcript || "(no speech detected)",
      coachVersion,
      whatChanged: feedback.improvements.slice(0, 5).map((imp) => ({
        change: imp,
        why: "Improves ICAO structure or aviation naturalness.",
      })),
    },
    pilotLanguage: feedback.missingKeywords.slice(0, 5).map((term) => ({
      term,
      usage: `Use "${term}" when describing this scenario to sound more operational.`,
    })),
    memoryCoaching: {
      keyIdeas: extractKeyIdeas(question, modelAnswer),
      note: "Speak from these ideas — do not memorize a full paragraph.",
    },
    personalCoaching: null,
    nextMission: {
      items: [
        ...feedback.missingKeywords.slice(0, 2),
        ...feedback.improvements.slice(0, 2).map((i) => i.slice(0, 60)),
      ].filter(Boolean).slice(0, 4),
      estimatedMinutes: 15,
    },
    confidenceMessage:
      feedback.scores.overall >= 70
        ? "This answer has a solid structure. You are getting closer to a consistent ICAO Level 4."
        : "This answer has good raw material — I would only improve one part at a time. Keep recording.",
    pilotVocabulary: {
      rating: vocabRating(feedback.scores.content, feedback.missingKeywords.length),
      missingExpressions: feedback.missingKeywords.slice(0, 6),
    },
    source: "local",
  };
}

function extractKeyIdeas(question: string, modelAnswer: string): string[] {
  const words = modelAnswer
    .split(/\s+/)
    .filter((w) => w.length > 4)
    .slice(0, 8);
  if (words.length >= 3) {
    return ["Situation", "Action", "Outcome", "Lesson"];
  }
  return [question.slice(0, 40), "Details", "Decision", "Lesson learned"];
}
