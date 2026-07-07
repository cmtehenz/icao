import { clampSentences, passesInstructorQualityGate } from "@/lib/captainDelta/infinity/qualityGate";
import { isGenericPraise } from "@/lib/captainDelta/infinity/praise";

const LECTURE_MARKERS =
  /\b(furthermore|moreover|in addition|it is important to note|definition|dictionary|according to)\b/i;

const WIKIPEDIA_OPENERS =
  /^(the word|in english|this term|it means|refers to)\b/i;

const CHATBOT_MARKERS =
  /\b(as an ai|language model|i'm here to help|happy to assist|great question!)\b/i;

export type SelfCheckResult = {
  message: string;
  speechText: string;
  rewritten: boolean;
};

function soundsLikeLecture(text: string): boolean {
  return LECTURE_MARKERS.test(text) || sentenceCount(text) > 10;
}

function soundsLikeWikipedia(text: string): boolean {
  return WIKIPEDIA_OPENERS.test(text.trim());
}

function soundsLikeChatbot(text: string): boolean {
  return CHATBOT_MARKERS.test(text);
}

function sentenceCount(text: string): number {
  return (text.match(/[^.!?]+[.!?]+/g) ?? []).length;
}

/** Would a real flight instructor say this? If not, rewrite. */
export function captainSelfCheck(
  message: string,
  speechText: string,
  fallback: string,
): SelfCheckResult {
  let out = message.trim();
  let speech = speechText.trim();
  let rewritten = false;

  if (
    !passesInstructorQualityGate(out) ||
    soundsLikeLecture(out) ||
    soundsLikeWikipedia(out) ||
    soundsLikeChatbot(out) ||
    isGenericPraise(out.split(".")[0] ?? out)
  ) {
    out = fallback;
    speech = clampSentences(fallback, 3);
    rewritten = true;
  }

  if (!passesInstructorQualityGate(speech)) {
    speech = clampSentences(out, 3);
    rewritten = true;
  }

  return { message: out, speechText: speech, rewritten };
}
