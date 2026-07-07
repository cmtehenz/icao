import type {
  AdaptivePlan,
  CaptainIntent,
  CaptainLessonMemory,
  CaptainStudentModel,
  DifficultyGranularity,
  LearningLoopAction,
  TeachingStrategy,
} from "@/lib/captainDelta/infinity/types";

function inferStudentGoal(memory: CaptainLessonMemory, intent: CaptainIntent): string {
  if (intent === "icao_answer" || intent === "exam_strategy") return "build a clear ICAO answer";
  if (intent === "meaning_question" || intent === "vocabulary_question") {
    return `use ${memory.currentWord} operationally`;
  }
  if (memory.practiceLevel >= 3) return "say the full sentence naturally";
  return `pronounce ${memory.currentWord} clearly`;
}

function inferBlocker(model: CaptainStudentModel, memory: CaptainLessonMemory): string | null {
  if (model.emotionalState === "frustrated") return "frustration is slowing progress";
  if (model.consecutiveSameMistake >= 2) return "repeating the same pronunciation habit";
  if (model.pronunciationWeakness === "rhythm") return "choppy rhythm breaks the line";
  if (model.pronunciationWeakness === "stress") return "stress is landing on the wrong syllable";
  if (model.pronunciationWeakness === "vowel") return "one vowel sound is unclear";
  if (model.pronunciationWeakness === "completeness") return "the sentence trails off";
  if (memory.helpLevel >= 2) return "the same explanation is not landing yet";
  return null;
}

function smallestLesson(
  model: CaptainStudentModel,
  memory: CaptainLessonMemory,
): DifficultyGranularity {
  if (model.emotionalState === "frustrated" || model.consecutiveSameMistake >= 2) {
    return "syllable";
  }
  if (model.lastAttemptSucceeded && model.wordMastered) return "challenge";
  if (model.pronunciationWeakness === "completeness" || memory.practiceLevel >= 3) {
    return model.lastAttemptSucceeded ? "sentence" : "phrase";
  }
  if (model.pronunciationWeakness === "stress") return "syllable";
  if (model.pronunciationWeakness === "rhythm") return "phrase";
  return memory.practiceLevel >= 2 ? "phrase" : "word";
}

function pickTeachingVariant(
  model: CaptainStudentModel,
  memory: CaptainLessonMemory,
  intent: CaptainIntent,
): TeachingStrategy {
  if (model.primaryNeed === "confidence") return "encourage";
  if (model.consecutiveSameMistake >= 2) return "direct";
  if (model.primaryNeed === "challenge") return "challenge";
  if (memory.turnCount > 2 && (intent === "stress_help" || intent === "rhythm_help")) {
    return "socratic";
  }
  if (memory.helpLevel >= 2) return "demonstration";
  if (memory.explainedTopics.length >= 2 && intent === "explain_again") return "story";
  return "direct";
}

function pickMicroChallenge(
  model: CaptainStudentModel,
  granularity: DifficultyGranularity,
): string | null {
  if (model.primaryNeed !== "challenge" && !model.lastAttemptSucceeded) return null;
  if (granularity === "challenge") {
    return "Pretend you're talking to Tower — say it like a real clearance readback.";
  }
  if (model.lastAttemptSucceeded) {
    return "Say it slightly faster this time — keep the rhythm steady.";
  }
  return null;
}

function pickActiveIntervention(model: CaptainStudentModel, word: string): string | null {
  if (model.consecutiveSameMistake < 2) return null;
  return `Let's stop for a second. You're repeating the same pronunciation on ${word}. Let's isolate just one sound.`;
}

function pickLearningLoop(intent: CaptainIntent, model: CaptainStudentModel): LearningLoopAction {
  if (intent === "icao_answer" || intent === "exam_strategy") return "own_sentence";
  if (intent === "meaning_question" || intent === "vocabulary_question") return "atc_usage";
  if (model.primaryNeed === "challenge") return "try_again";
  if (model.emotionalState === "frustrated") return "repeat_after_me";
  return "try_again";
}

function learningLoopText(action: LearningLoopAction): string {
  switch (action) {
    case "repeat_after_me":
      return "Repeat after me once, then try the full sentence.";
    case "own_sentence":
      return "Now say your version out loud once.";
    case "explain_back":
      return "Explain it back to me in one short sentence.";
    case "atc_usage":
      return "Tell me how ATC would use this word.";
    default:
      return "Now try the full sentence again.";
  }
}

/** Silent pre-response planning — what to teach and how. */
export function planAdaptiveResponse(
  model: CaptainStudentModel,
  memory: CaptainLessonMemory,
  intent: CaptainIntent,
): AdaptivePlan {
  const smallestLessonGranularity = smallestLesson(model, memory);
  const learningLoop = pickLearningLoop(intent, model);
  return {
    studentGoal: inferStudentGoal(memory, intent),
    blocker: inferBlocker(model, memory),
    smallestLesson: smallestLessonGranularity,
    teachingVariant: pickTeachingVariant(model, memory, intent),
    microChallenge: pickMicroChallenge(model, smallestLessonGranularity),
    activeIntervention: pickActiveIntervention(model, memory.currentWord),
    learningLoop,
    useAviationHook:
      intent === "vocabulary_question" ||
      intent === "aviation_context" ||
      intent === "helicopter_operation" ||
      intent === "atc" ||
      intent === "phraseology",
    useStory: memory.helpLevel >= 2 && memory.explainedTopics.length >= 1,
  };
}

export { learningLoopText };
