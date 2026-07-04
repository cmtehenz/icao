import { filenameForAudioBlob } from "@/lib/recordings/mime";
import { toUniversalPlayableBlob } from "@/lib/recordings/toPlayableBlob";
import type { EvaluateScores, EvaluateType } from "@/lib/evaluate/types";

export type SaveEvaluationInput = {
  type: EvaluateType | string;
  question: string;
  transcript: string;
  scores: EvaluateScores;
  icaoLevel?: number;
  icaoCriteria?: Record<string, number>;
  summary: string;
  audioBlob?: Blob | null;
};

export type SaveEvaluationResult = {
  id: string;
  audioSaved: boolean;
  audioError?: string;
};

export async function saveEvaluationRecord(
  input: SaveEvaluationInput,
): Promise<SaveEvaluationResult | null> {
  const payload = {
    type: input.type,
    question: input.question,
    transcript: input.transcript,
    scores: input.scores,
    icaoLevel: input.icaoLevel,
    icaoCriteria: input.icaoCriteria,
    summary: input.summary,
  };

  try {
    if (input.audioBlob && input.audioBlob.size > 0) {
      // WAV (or MP4) so recordings play on iPhone — Chrome often captures WebM.
      const blob = await toUniversalPlayableBlob(input.audioBlob);
      const form = new FormData();
      form.append("data", JSON.stringify(payload));
      form.append("audio", blob, filenameForAudioBlob(blob));

      const res = await fetch("/api/evaluations", {
        method: "POST",
        body: form,
      });

      const data = (await res.json()) as {
        id?: string;
        audioSaved?: boolean;
        audioError?: string;
        error?: string;
      };

      if (!res.ok) {
        console.error("[saveEvaluation] multipart failed", res.status, data.error);
        return null;
      }

      if (!data.id) return null;

      return {
        id: data.id,
        audioSaved: !!data.audioSaved,
        audioError: data.audioSaved ? undefined : (data.audioError ?? "Áudio não foi salvo no servidor."),
      };
    }

    const res = await fetch("/api/evaluations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) return null;
    const data = (await res.json()) as { id?: string };
    if (!data.id) return null;

    return { id: data.id, audioSaved: false };
  } catch (e) {
    console.error("[saveEvaluation] error", e);
    return null;
  }
}
