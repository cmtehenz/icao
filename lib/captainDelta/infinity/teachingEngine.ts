import { splitSyllables } from "@/lib/captainDelta/visual/syllables";
import type {
  AdaptivePlan,
  CaptainIntent,
  CaptainInstructorResponse,
  CaptainLessonMemory,
  HelpLevel,
  InstructorLesson,
  TeachingStrategy,
} from "@/lib/captainDelta/infinity/types";
import {
  clampSentences,
  passesInstructorQualityGate,
  passesSpeechQualityGate,
} from "@/lib/captainDelta/infinity/qualityGate";
import { resolveWhyReferent } from "@/lib/captainDelta/infinity/lessonMemory";
import { enhanceLessonWithAdaptivePlan } from "@/lib/captainDelta/infinity/adaptiveEnhance";

function quoteWord(word: string): string {
  return `"${word.trim()}"`;
}

export function pickTeachingStrategy(
  intent: CaptainIntent,
  memory: CaptainLessonMemory,
  planned?: TeachingStrategy,
): TeachingStrategy {
  if (planned) return planned;
  if (intent === "unknown") return "clarify";
  if (intent === "student_frustration" || intent === "confidence" || intent === "motivation") {
    return "encourage";
  }
  if (intent === "repeat_request") return "demonstration";
  if (intent === "explain_again" && memory.helpLevel >= 2) return "demonstration";
  if (intent === "explain_again" && (memory.helpLevel >= 1 || memory.turnCount >= 1)) {
    return "progressive";
  }
  if (
    (intent === "stress_help" || intent === "rhythm_help") &&
    memory.helpLevel === 0 &&
    memory.turnCount > 2
  ) {
    return "socratic";
  }
  if (memory.helpLevel >= 2) return "demonstration";
  if (memory.helpLevel >= 1) return "progressive";
  return "direct";
}

function buildInstructorLesson(lesson: InstructorLesson): { message: string; speechText: string } {
  const body = [lesson.positive, lesson.focus, lesson.teach, lesson.exercise]
    .filter(Boolean)
    .join(" ");
  const message = lesson.repeat
    ? `${clampSentences(body, 5)} ${lesson.repeat}`
    : clampSentences(body, 6);

  const speechText = clampSentences(
    [lesson.positive, lesson.exercise, lesson.repeat].filter(Boolean).join(" "),
    3,
  );

  return { message: message.trim(), speechText };
}

function stressSyllableDrill(word: string): { drill: string; stressed: string } {
  const w = word.trim().toLowerCase();
  if (w === "engine") {
    return { drill: "EN... gine... ENGINE", stressed: "EN" };
  }
  const parts = splitSyllables(word);
  if (parts.length <= 1) {
    const upper = word.toUpperCase();
    return { drill: `${upper}... ${upper}`, stressed: upper };
  }
  const stressed = parts[0]!.toUpperCase();
  const tail = parts.slice(1).join("").toLowerCase();
  return { drill: `${stressed}... ${tail}... ${word.toUpperCase()}`, stressed };
}

function linkedSpeechHint(referenceText: string): string {
  const words = referenceText
    .replace(/[.,!?;:]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 4);
  if (words.length < 2) return referenceText.trim();
  return words.join("_").toLowerCase();
}

function socraticPrefix(strategy: TeachingStrategy): string {
  if (strategy !== "socratic") return "";
  return "Quick check — can you hear which syllable sounds stronger? ";
}

function progressiveTeachLine(helpLevel: HelpLevel, base: string, fuller: string): string {
  if (helpLevel >= 3) return fuller;
  if (helpLevel >= 1) return base;
  return base.split(".")[0] + ".";
}

function frustrationAnswer(memory: CaptainLessonMemory): InstructorLesson {
  const q = quoteWord(memory.currentWord);
  return {
    positive: "I hear you — this part is tricky.",
    focus: "Let's slow down and take one small step.",
    teach: "Even experienced pilots drill single words before full sentences.",
    exercise: `Say ${q} once slowly — quality before speed.`,
    repeat: "When you're ready, try the full sentence again.",
  };
}

function confidenceAnswer(memory: CaptainLessonMemory): InstructorLesson {
  return {
    positive: "That's normal before an exam.",
    focus: "Your job is understandable English — not perfect English.",
    teach: "Speak like a calm briefing: short sentences, clear words, steady pace.",
    exercise: `Practice ${quoteWord(memory.currentWord)} once in a relaxed voice.`,
    repeat: "Breathe, then try the line again.",
  };
}

function motivationAnswer(): InstructorLesson {
  return {
    positive: "You're putting in the work — that matters.",
    focus: "Five focused minutes beats an hour of rushing.",
    teach: "Finish this word cleanly, then we move on.",
    exercise: "",
    repeat: "One more clear attempt — you've got this.",
  };
}

function stressLesson(word: string, referenceText: string, helpLevel: HelpLevel): InstructorLesson {
  const q = quoteWord(word);
  const { drill, stressed } = stressSyllableDrill(word);
  const teach =
    helpLevel >= 2
      ? `Listen carefully. ${drill}. Notice the first syllable carries the energy.`
      : progressiveTeachLine(
          helpLevel,
          `Make ${stressed} a little stronger and slightly higher.`,
          `Make ${stressed} stronger, a little longer, and slightly higher — then let the rest settle.`,
        );
  return {
    positive: helpLevel >= 1 ? "Let's try a different angle." : "Good question.",
    focus: `For ${q}: ${drill}.`,
    teach,
    exercise: "",
    repeat: referenceText ? "Now put it back into the full sentence." : "Now say the full sentence again.",
  };
}

function rhythmLesson(word: string, referenceText: string, helpLevel: HelpLevel): InstructorLesson {
  const linked = linkedSpeechHint(referenceText || word);
  const linkedDisplay = linked.includes("_") ? linked : linked.replace(/\s+/g, "_");
  return {
    positive: helpLevel >= 1 ? "Different approach — same goal." : "Good question.",
    focus: "Try speaking the whole sentence in one breath.",
    teach: progressiveTeachLine(
      helpLevel,
      "Link the words smoothly — like a calm radio call.",
      "Don't stop between the words. Link the phrase smoothly, almost as one flow.",
    ),
    exercise: `Try: ${linkedDisplay.replace(/_/g, "_")}. Slowly first, then normal speed.`,
    repeat: referenceText ? "Now say the full sentence again." : "Now try the full phrase again.",
  };
}

function vowelLesson(word: string, referenceText: string): InstructorLesson {
  const q = quoteWord(word);
  return {
    positive: "Good question.",
    focus: `Let's clean the vowel in ${q}.`,
    teach: "Open your mouth slightly more. Keep the vowel short — don't stretch it.",
    exercise: `Say ${q} once slowly, then once at normal speed.`,
    repeat: referenceText
      ? "Now put it back into the full sentence."
      : "Now say the full sentence again.",
  };
}

function connectedSpeechLesson(referenceText: string): InstructorLesson {
  const linked = linkedSpeechHint(referenceText || "check the engine");
  return {
    positive: "Good question.",
    focus: "English pilots link words in operational phrases.",
    teach: `Instead of pausing between words, try ${linked.replace(/_/g, "_")} — almost as one unit.`,
    exercise: "Listen first. Repeat after me at half speed, then normal.",
    repeat: "Now say the full sentence in one breath.",
  };
}

function consonantLesson(question: string): InstructorLesson {
  const q = question.toLowerCase();
  let sound = "TH";
  if (/\br sound\b|\bthe r\b/.test(q)) sound = "R";
  else if (/\bl sound\b/.test(q)) sound = "L";
  else if (/\bv sound\b/.test(q)) sound = "V";
  else if (/\bw sound\b/.test(q)) sound = "W";
  else if (/\bsh sound\b/.test(q)) sound = "SH";
  else if (/\bch sound\b/.test(q)) sound = "CH";

  return {
    positive: "Good question.",
    focus: `Let's work the ${sound} sound.`,
    teach:
      sound === "TH"
        ? "Place your tongue lightly between your teeth — don't bite hard. Keep the air flowing."
        : "Relax your tongue. Short, clean sound — not exaggerated.",
    exercise: `Say a simple word with ${sound} slowly twice.`,
    repeat: "Now put it back into your practice sentence.",
  };
}

function vocabularyLesson(word: string, referenceText: string): InstructorLesson {
  const q = quoteWord(word);
  const operational = referenceText.trim()
    ? `In your line, ${quoteWord(referenceText)} — ${q} is the key operational word.`
    : `${q} is aviation briefing language — short and clear on the radio.`;
  return {
    positive: "Good question.",
    focus: operational,
    teach: "Pilots use it in real operations — short, clear, and calm on the radio.",
    exercise: `Say ${q} once clearly, then use it in the sentence.`,
    repeat: "Now repeat the full sentence in your own steady voice.",
  };
}

function icaoLesson(word: string, referenceText: string): InstructorLesson {
  const model = referenceText.trim()
    ? `Model: ${referenceText.trim().slice(0, 120)}`
    : `Use ${quoteWord(word)} in one short operational sentence — one idea, then stop.`;
  return {
    positive: "Good question.",
    focus: "Keep your ICAO answer short — Level 4 English, simple words.",
    teach: model,
    exercise: "Personalize it with your own details, same clear structure.",
    repeat: "Now say your version out loud once.",
  };
}

function whyAnswer(memory: CaptainLessonMemory, helpLevel: HelpLevel): InstructorLesson {
  const referent = resolveWhyReferent(memory);
  return {
    positive: "Good question.",
    focus:
      helpLevel >= 1
        ? `Here's another way to see it: ${clampSentences(referent, 2)}`
        : `Because ${clampSentences(referent, 2)}`,
    teach: "In the exam, understandable beats perfect — keep it operational.",
    exercise: `Say ${quoteWord(memory.currentWord)} once clearly.`,
    repeat: "Now try the full sentence again.",
  };
}

function repeatLesson(memory: CaptainLessonMemory): InstructorLesson {
  if (memory.lastCoaching && passesInstructorQualityGate(memory.lastCoaching)) {
    return {
      positive: "Sure.",
      focus: memory.lastCoaching,
      teach: "",
      exercise: "",
      repeat: "",
    };
  }
  return {
    positive: "Sure.",
    focus: `Let's go again on ${quoteWord(memory.currentWord)}.`,
    teach: "Slow and clear first — quality before speed.",
    exercise: `Say ${quoteWord(memory.currentWord)} once, then the full sentence.`,
    repeat: "Go when ready.",
  };
}

function technicalErrorLesson(): InstructorLesson {
  const safe =
    "I couldn't get a clear recording that time. Try again with a short phrase and speak a little closer to the mic.";
  return { positive: safe, focus: "", teach: "", exercise: "", repeat: "" };
}

function generalLesson(memory: CaptainLessonMemory): InstructorLesson {
  const q = quoteWord(memory.currentWord);
  const levelHint =
    memory.practiceLevel >= 3
      ? "You're on sentence level — connect the words naturally."
      : "Start with the word alone, then build up.";
  return {
    positive: "Good question.",
    focus: `We're working on ${q}${memory.referenceText ? ` in ${quoteWord(memory.referenceText)}` : ""}.`,
    teach: levelHint,
    exercise: `Say ${q} once clearly.`,
    repeat: "Now repeat the full sentence again.",
  };
}

export function buildCaptainTeachingResponse(
  intent: CaptainIntent,
  memory: CaptainLessonMemory,
  strategy: TeachingStrategy,
  question = "",
  plan?: AdaptivePlan,
): CaptainInstructorResponse {
  const word = memory.currentWord;
  const ref = memory.referenceText;
  const helpLevel = memory.helpLevel;

  let lesson: InstructorLesson;

  switch (intent) {
    case "student_frustration":
      lesson = frustrationAnswer(memory);
      break;
    case "confidence":
      lesson = confidenceAnswer(memory);
      break;
    case "motivation":
      lesson = motivationAnswer();
      break;
    case "stress_help":
      lesson = stressLesson(word, ref, helpLevel);
      break;
    case "rhythm_help":
      lesson = rhythmLesson(word, ref, helpLevel);
      break;
    case "vowel_help":
    case "pronunciation_question":
      lesson = vowelLesson(word, ref);
      break;
    case "connected_speech":
      lesson = connectedSpeechLesson(ref);
      break;
    case "consonant_help":
      lesson = consonantLesson(question);
      break;
    case "meaning_question":
    case "vocabulary_question":
    case "aviation_context":
    case "helicopter_operation":
      lesson = vocabularyLesson(word, ref);
      break;
    case "icao_answer":
    case "exam_strategy":
      lesson = icaoLesson(word, ref);
      break;
    case "explain_again":
      lesson =
        memory.turnCount >= 1 || helpLevel >= 1
          ? whyAnswer(memory, helpLevel)
          : stressLesson(word, ref, helpLevel);
      break;
    case "repeat_request":
      lesson = repeatLesson(memory);
      break;
    case "technical_recording_error":
      lesson = technicalErrorLesson();
      break;
    default:
      lesson = generalLesson(memory);
  }

  if (strategy === "socratic" && lesson.teach) {
    lesson = { ...lesson, teach: socraticPrefix(strategy) + lesson.teach };
  }

  if (plan) {
    lesson = enhanceLessonWithAdaptivePlan(lesson, memory, plan, word);
  }

  const copy = buildInstructorLesson(lesson);

  return {
    message: copy.message,
    speechText: passesSpeechQualityGate(copy.speechText) ? copy.speechText : clampSentences(copy.message, 3),
    intent,
    strategy,
    helpLevel: memory.helpLevel,
  };
}
