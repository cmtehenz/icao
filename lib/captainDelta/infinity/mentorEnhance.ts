import type { CaptainIntent, CaptainLessonMemory, TeachingStrategy } from "@/lib/captainDelta/infinity/types";
import type { CaptainMentorProfile } from "@/lib/captainDelta/infinity/mentorProfile";
import { operationExamplePrefix } from "@/lib/captainDelta/infinity/mentorProfile";
import { clampSentences } from "@/lib/captainDelta/infinity/qualityGate";

const RECURRING_STRATEGIES: TeachingStrategy[] = [
  "story",
  "socratic",
  "demonstration",
  "challenge",
  "progressive",
  "direct",
];

export function pickRecurringMistakeStrategy(repeatCount: number): TeachingStrategy {
  return RECURRING_STRATEGIES[repeatCount % RECURRING_STRATEGIES.length] ?? "story";
}

export function mentorJourneyOpener(
  profile: CaptainMentorProfile,
  word: string,
  intent: CaptainIntent,
): string | null {
  if (profile.wordStruggledYesterday && intent !== "student_frustration") {
    const q = `"${word.trim()}"`;
    return `I've noticed ${q} was tricky yesterday. Let's build on that today.`;
  }
  if (profile.progressTrend === "up" && (intent === "rhythm_help" || intent === "stress_help")) {
    return "I've noticed your rhythm has been improving since yesterday.";
  }
  if (profile.confidenceTrend === "up" && intent === "confidence") {
    return "You've become much more confident in the last few sessions.";
  }
  return null;
}

export function mentorSmartReviewLine(profile: CaptainMentorProfile, currentWord: string): string | null {
  const review = profile.smartReviewWord;
  if (!review || review === currentWord.toLowerCase()) return null;
  const mastered = profile.masteredWords.includes(currentWord.toLowerCase());
  if (!mastered) return null;
  return `You've mastered ${currentWord}. Let's revisit "${review}" because it caused problems earlier.`;
}

export function applyMentorPersonalization(
  message: string,
  speechText: string,
  profile: CaptainMentorProfile,
  memory: CaptainLessonMemory,
  intent: CaptainIntent,
): { message: string; speechText: string } {
  const parts: string[] = [];

  const journeyOpener = mentorJourneyOpener(profile, memory.currentWord, intent);
  if (journeyOpener) parts.push(journeyOpener);

  const reviewLine = mentorSmartReviewLine(profile, memory.currentWord);
  if (reviewLine && intent === "motivation") parts.push(reviewLine);

  if (profile.examSimulation && intent === "icao_answer") {
    parts.push("Exam is close — answer like the check ride: short, calm, operational.");
  } else if (profile.examMode && intent === "exam_strategy") {
    parts.push("We're shifting toward examiner-style practice — clear structure, no rambling.");
  }

  if (profile.operationContext !== "general" && intent === "aviation_context") {
    parts.push(`${operationExamplePrefix(profile.operationContext)}, keep it concise.`);
  }

  if (profile.learningStyle === "shadowing" && intent === "rhythm_help") {
    parts.push("Shadow the line once slowly, then speak it in your own voice.");
  }

  if (!parts.length) return { message, speechText };

  const prefix = parts.join(" ");
  return {
    message: clampSentences(`${prefix} ${message}`, 10),
    speechText: clampSentences(`${prefix} ${speechText}`, 3),
  };
}
