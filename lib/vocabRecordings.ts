import { collectVaultWordCandidates } from "@/lib/azure/pronunciation";
import type { AzurePronunciationResult } from "@/lib/azure/pronunciation";
import { emitCaptainDeltaSuggestion } from "@/lib/captainDelta/events";
import { addWordsToVault } from "@/lib/pronunciationVault";
import { saveEvaluationRecord } from "@/lib/evaluate/saveEvaluation";
import {
  isVocabTermInTodayMission,
  markVocabDailyComplete,
} from "@/lib/vocabDailyMission";
import { AZURE_RECOVERY_GUIDANCE, captainVocabFeedbackAfterAttempt } from "@/lib/vocabCoach";
import { isVocabMissionTermComplete, VB_PASS_SCORE } from "@/lib/vocabGraduation";
import {
  getItemProgress,
  loadVocabProgressStore,
  pronunciationScore,
  recordVocabAttempt,
  type VocabItemProgress,
  type VocabSavedRecording,
} from "@/utils/spacedRepetition";

function mispronouncedFromAssessment(assessment: AzurePronunciationResult) {
  return collectVaultWordCandidates(assessment);
}

export type SaveVocabAttemptResult = {
  progress: VocabItemProgress;
  audioSaved: boolean;
  audioError?: string;
  assessed: boolean;
};

export async function saveVocabAttempt(input: {
  id: string;
  termLabel: string;
  referenceText: string;
  level: 1 | 2 | 3 | 4;
  assessment: AzurePronunciationResult | null;
  audioBlob: Blob | null;
}): Promise<SaveVocabAttemptResult> {
  const store = loadVocabProgressStore();
  const existing = getItemProgress(store, input.id);

  if (!input.assessment) {
    const message = `Assessment unavailable. ${AZURE_RECOVERY_GUIDANCE}`;
    emitCaptainDeltaSuggestion({
      text: message,
      speechText: "Assessment unavailable. Listen to the model, slow down, then record again.",
      kind: "coaching",
      primaryAction: { id: "try_again", label: "Try again", primary: true },
      secondaryActions: [{ id: "slow_audio", label: "🎧 Slow Audio", primary: false }],
    });
    return { progress: existing, audioSaved: false, assessed: false };
  }

  const score = pronunciationScore(
    input.assessment.accuracyScore,
    input.assessment.fluencyScore,
    input.assessment.completenessScore,
  );

  let savedRecording: VocabSavedRecording | undefined;
  let audioSaved = false;
  let audioError: string | undefined;

  const saved = await saveEvaluationRecord({
    type: "vocabulary",
    question: `${input.termLabel} · Level ${input.level}`,
    transcript: input.assessment.recognizedText || input.referenceText,
    scores: {
      overall: score,
      structure: 0,
      content: 0,
      phraseology: 0,
      pronunciation: input.assessment.accuracyScore,
    },
    summary: `Vocabulary L${input.level}: ${score}% — accuracy ${input.assessment.accuracyScore}%`,
    audioBlob: input.audioBlob,
  });

  if (saved?.id) {
    audioSaved = saved.audioSaved;
    audioError = saved.audioError;
    savedRecording = {
      evaluationId: saved.id,
      score,
      level: input.level,
      recordedAt: new Date().toISOString(),
    };
  } else if (input.audioBlob) {
    audioError = "Could not save recording to the server.";
  }

  const progress = recordVocabAttempt(store, input.id, score, input.level, savedRecording);

  const feedback = captainVocabFeedbackAfterAttempt(score, input.level, progress);
  const missionTerm = isVocabTermInTodayMission(input.id);
  const termComplete = isVocabMissionTermComplete(progress);
  const passedLevel = score >= VB_PASS_SCORE;
  const recoveryHint = !passedLevel ? ` ${AZURE_RECOVERY_GUIDANCE}` : "";

  emitCaptainDeltaSuggestion({
    text: feedback.message + recoveryHint,
    speechText: feedback.speechText,
    kind: "coaching",
    primaryAction:
      missionTerm && termComplete
        ? { id: "ready", label: "Continue", primary: true }
        : { id: "try_again", label: "Try again", primary: true },
    secondaryActions: !passedLevel
      ? [{ id: "slow_audio", label: "🎧 Slow Audio", primary: false }]
      : [],
  });

  if (missionTerm && termComplete) {
    markVocabDailyComplete(input.id);
  }

  if (score < VB_PASS_SCORE) {
    addWordsToVault(mispronouncedFromAssessment(input.assessment), `Vocabulary: ${input.termLabel}`);
  }

  return { progress, audioSaved, audioError, assessed: true };
}
