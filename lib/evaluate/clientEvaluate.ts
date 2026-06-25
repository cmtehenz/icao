import { errorTypeLabel, getMispronouncedWords } from "@/lib/azure/pronunciation";
import type { AzurePronunciationResult } from "@/lib/azure/pronunciation";
import { estimateIcaoLevel } from "@/lib/evaluate/icaoLevel";
import type { EvaluateFeedback, EvaluateType } from "@/lib/evaluate/types";

export function mergeAzureIntoFeedback(
  data: EvaluateFeedback,
  azureResult: AzurePronunciationResult,
  evaluateType: EvaluateType,
): EvaluateFeedback {
  const mispronounced = getMispronouncedWords(azureResult.words);
  const azureExtras = {
    accuracyScore: azureResult.accuracyScore,
    fluencyScore: azureResult.fluencyScore,
    completenessScore: azureResult.completenessScore,
    prosodyScore: azureResult.prosodyScore,
    weakWords: mispronounced.map((w) => w.word),
    mispronouncedWords: mispronounced.map((w) => ({
      word: w.word,
      accuracyScore: w.accuracyScore,
      errorType: w.errorType ?? "None",
      errorLabel: errorTypeLabel(w.errorType),
    })),
  };

  data.scores.pronunciation = azureResult.accuracyScore;
  data.scores.overall = Math.round(
    data.scores.content * 0.3 +
      data.scores.structure * 0.25 +
      data.scores.phraseology * 0.2 +
      azureResult.accuracyScore * 0.25,
  );
  data.azurePronunciation = azureExtras;
  data.summary = `Pronúncia Azure: ${azureResult.accuracyScore}/100 (accuracy). ${data.summary}`;
  if (azureExtras.weakWords.length) {
    data.improvements = [
      `Pronúncia: pratique — ${azureExtras.weakWords.join(", ")}.`,
      ...data.improvements,
    ];
  }
  data.icaoLevel = estimateIcaoLevel(data.scores, evaluateType, {
    accuracyScore: azureResult.accuracyScore,
    fluencyScore: azureResult.fluencyScore,
    completenessScore: azureResult.completenessScore,
  });

  return data;
}

export async function fetchEvaluation(
  transcript: string,
  question: string,
  modelAnswer: string,
  evaluateType: EvaluateType,
  azureResult?: AzurePronunciationResult,
): Promise<EvaluateFeedback> {
  const res = await fetch("/api/evaluate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      transcript,
      question,
      modelAnswer,
      type: evaluateType,
    }),
  });
  const data = (await res.json()) as EvaluateFeedback;
  if (azureResult) {
    return mergeAzureIntoFeedback(data, azureResult, evaluateType);
  }
  return data;
}
