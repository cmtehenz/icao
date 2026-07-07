import type { CaptainIntent, CaptainLessonMemory } from "@/lib/captainDelta/infinity/types";

const QUESTION_LEAD =
  /^(how can i|how do i|how to|why|what is|what's|what does|explain|can you help|can you|could you|tell me|help me)\b/i;

const TECHNICAL_ERROR =
  /\b(drain\s+timeout|session ended|no_recognizer|recognizer|azure|callback|nomatch|sdk|stack|technical)\b/i;

const FRUSTRATION =
  /\b(i can't|i cant|this is hard|too difficult|i give up|frustrated|not working|impossible|i'm stuck|im stuck)\b/i;

const CONFIDENCE =
  /\b(nervous|scared|worried|anxious|not confident|lack confidence|exam nerves)\b/i;

const MOTIVATION =
  /\b(motivat|keep going|give up|tired|burned out|burnout)\b/i;

export type IntentClassification = {
  intent: CaptainIntent;
  confidence: "high" | "medium" | "low";
};

export function classifyCaptainIntent(
  question: string,
  memory?: Pick<
    CaptainLessonMemory,
    "lastIntent" | "lastCoaching" | "currentWord" | "referenceText"
  > | null,
): IntentClassification {
  const q = question.trim().toLowerCase();
  if (!q) return { intent: "unknown", confidence: "low" };

  if (TECHNICAL_ERROR.test(q)) {
    return { intent: "technical_recording_error", confidence: "high" };
  }
  if (FRUSTRATION.test(q)) {
    return { intent: "student_frustration", confidence: "high" };
  }
  if (CONFIDENCE.test(q)) {
    return { intent: "confidence", confidence: "high" };
  }
  if (MOTIVATION.test(q)) {
    return { intent: "motivation", confidence: "high" };
  }
  if (/\b(repeat|say again|one more time|repeat that)\b/.test(q)) {
    return { intent: "repeat_request", confidence: "high" };
  }
  if (/\b(explain again|say it differently|another way|didn't understand|dont understand)\b/.test(q)) {
    return { intent: "explain_again", confidence: "high" };
  }
  if (q === "why" || q === "why?" || /^why\b/.test(q)) {
    return { intent: memory?.lastCoaching ? "explain_again" : "unknown", confidence: "medium" };
  }
  if (/\b(th sound|th\b|consonant|r sound|l sound|v sound|w sound|sh sound|ch sound)\b/.test(q)) {
    return { intent: "consonant_help", confidence: "high" };
  }
  if (/\b(link|connected speech|linking|check_the)\b/.test(q)) {
    return { intent: "connected_speech", confidence: "high" };
  }
  if (/\b(stress|stressed|syllable|stronger|louder|intonation)\b/.test(q)) {
    return { intent: "stress_help", confidence: "high" };
  }
  if (/\b(rhythm|flow|pause|choppy|breath|smooth|one breath)\b/.test(q)) {
    return { intent: "rhythm_help", confidence: "high" };
  }
  if (/\b(vowel|mouth|open your mouth)\b/.test(q)) {
    return { intent: "vowel_help", confidence: "high" };
  }
  if (/\b(pronounce|pronunciation|how can i say|how do i say|sound clearer)\b/.test(q)) {
    return { intent: "pronunciation_question", confidence: "high" };
  }
  if (/\b(what does this sentence|sentence mean|meaning of the sentence)\b/.test(q)) {
    return { intent: "meaning_question", confidence: "high" };
  }
  if (/\b(what does .* mean|meaning of|what is .* mean)\b/.test(q)) {
    return { intent: "vocabulary_question", confidence: "high" };
  }
  if (/\b(grammar|tense|past tense|present|article|preposition)\b/.test(q)) {
    return { intent: "grammar_question", confidence: "medium" };
  }
  if (/\b(icao|exam answer|level 4|how should i answer|model answer|part 1 answer)\b/.test(q)) {
    return { intent: "icao_answer", confidence: "high" };
  }
  if (/\b(exam strategy|exam tip|how to pass|check ride)\b/.test(q)) {
    return { intent: "exam_strategy", confidence: "medium" };
  }
  if (/\b(phraseology|standard phrase|radio phrase)\b/.test(q)) {
    return { intent: "phraseology", confidence: "medium" };
  }
  if (/\b(atc|controller|tower|clearance|readback)\b/.test(q)) {
    return { intent: "atc", confidence: "medium" };
  }
  if (/\b(crm|crew resource|teamwork|decision making)\b/.test(q)) {
    return { intent: "crm", confidence: "medium" };
  }
  if (/\b(weather|metar|visibility|wind|cloud)\b/.test(q)) {
    return { intent: "weather", confidence: "medium" };
  }
  if (/\b(navigation|route|waypoint|gps|position)\b/.test(q)) {
    return { intent: "navigation", confidence: "medium" };
  }
  if (/\b(helicopter|rotor|autorotation|heli|checklist|cockpit)\b/.test(q)) {
    return { intent: "helicopter_operation", confidence: "medium" };
  }
  if (/\b(helicopter|pilot|operational|when would|who says|in flight)\b/.test(q)) {
    return { intent: "aviation_context", confidence: "medium" };
  }
  if (/\b(hello|hi captain|how are you|thanks|thank you)\b/.test(q)) {
    return { intent: "conversation", confidence: "medium" };
  }
  if (/\b(why do pilots|what happens if|tell me about aviation)\b/.test(q)) {
    return { intent: "random_aviation", confidence: "low" };
  }
  if (/\b(pronunciation|how can i|how do i|how to|help me|explain|tell me)\b/.test(q)) {
    return { intent: "pronunciation_question", confidence: "medium" };
  }

  if (memory?.lastIntent && (q.includes("?") || QUESTION_LEAD.test(q))) {
    return { intent: memory.lastIntent, confidence: "low" };
  }

  if (q.includes("?") || QUESTION_LEAD.test(q)) {
    return { intent: "unknown", confidence: "low" };
  }

  return { intent: "unknown", confidence: "low" };
}

export function clarificationQuestion(
  memory: CaptainLessonMemory,
): { message: string; speechText: string } {
  const word = memory.currentWord;
  const safe =
    word && word !== "the word"
      ? `Are you asking about pronunciation, meaning, or how to use "${word}" in the sentence?`
      : "Are you asking about pronunciation, meaning, or how to use this in a sentence?";
  return { message: safe, speechText: safe };
}

export function isCaptainStudentQuestion(text: string): boolean {
  const q = text.trim();
  if (q.length < 4) return false;
  if (QUESTION_LEAD.test(q) || q.includes("?")) return true;
  if (FRUSTRATION.test(q) || CONFIDENCE.test(q) || MOTIVATION.test(q)) return true;
  return /\b(stress|rhythm|pronounce|meaning|icao|repeat|explain)\b/i.test(q);
}
