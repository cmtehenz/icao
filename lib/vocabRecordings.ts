import { collectVaultWordCandidates } from "@/lib/azure/pronunciation";
import type { AzurePronunciationResult } from "@/lib/azure/pronunciation";
import { addWordsToVault } from "@/lib/pronunciationVault";
import { saveEvaluationRecord } from "@/lib/evaluate/saveEvaluation";
import {
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
};

export async function saveVocabAttempt(input: {
  id: string;
  termLabel: string;
  referenceText: string;
  level: 1 | 2 | 3 | 4;
  assessment: AzurePronunciationResult | null;
  audioBlob: Blob | null;
}): Promise<SaveVocabAttemptResult> {
  const score = input.assessment
    ? pronunciationScore(
        input.assessment.accuracyScore,
        input.assessment.fluencyScore,
        input.assessment.completenessScore,
      )
    : 0;

  let savedRecording: VocabSavedRecording | undefined;
  let audioSaved = false;
  let audioError: string | undefined;

  if (input.assessment) {
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
      summary: `Vocabulário L${input.level}: ${score}% — accuracy ${input.assessment.accuracyScore}%`,
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
      audioError = "Não foi possível salvar a gravação no servidor.";
    }
  }

  const store = loadVocabProgressStore();
  const progress = recordVocabAttempt(store, input.id, score, input.level, savedRecording);

  if (score < 75 && input.assessment) {
    addWordsToVault(mispronouncedFromAssessment(input.assessment), `Vocabulary: ${input.termLabel}`);
  } else if (score < 75) {
    addWordsToVault(
      [
        {
          word: input.termLabel,
          accuracyScore: score,
          errorType: "Mispronunciation",
          errorLabel: "Pronúncia fraca",
        },
      ],
      `Vocabulary: ${input.termLabel}`,
    );
  }

  return { progress, audioSaved, audioError };
}
