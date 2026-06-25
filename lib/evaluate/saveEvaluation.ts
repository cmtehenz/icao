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

export async function saveEvaluationRecord(input: SaveEvaluationInput): Promise<string | null> {
  try {
    const res = await fetch("/api/evaluations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: input.type,
        question: input.question,
        transcript: input.transcript,
        scores: input.scores,
        icaoLevel: input.icaoLevel,
        icaoCriteria: input.icaoCriteria,
        summary: input.summary,
      }),
    });

    if (!res.ok) return null;
    const data = (await res.json()) as { id?: string };
    if (!data.id) return null;

    if (input.audioBlob && input.audioBlob.size > 0) {
      const form = new FormData();
      form.append("audio", input.audioBlob, `recording.${input.audioBlob.type.includes("ogg") ? "ogg" : "webm"}`);
      await fetch(`/api/evaluations/${data.id}/audio`, {
        method: "POST",
        body: form,
      });
    }

    return data.id;
  } catch {
    return null;
  }
}
