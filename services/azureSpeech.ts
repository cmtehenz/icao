import {
  speakAzureText,
  stopAzureSpeech,
  synthesizeExamMp3,
  type AzureVoiceRole,
} from "@/lib/azure/azureTts";
import type { AzurePronunciationResult } from "@/lib/azure/pronunciation";
import { mergeAzureIntoFeedback } from "@/lib/evaluate/clientEvaluate";
import type { EvaluateFeedback, EvaluateType } from "@/lib/evaluate/types";

export type AzureVoiceType = "female_examiner" | "male_candidate";

const VOICE_MAP: Record<AzureVoiceType, AzureVoiceRole> = {
  female_examiner: "female_examiner",
  male_candidate: "male_candidate",
};

/** Speak text using Azure TTS (female examiner or male model answer). */
export async function speakText(
  text: string,
  voiceType: AzureVoiceType = "female_examiner",
): Promise<boolean> {
  return speakAzureText(text, VOICE_MAP[voiceType]);
}

/** Stop any in-flight Azure speech synthesis. */
export function stopSpeech(): void {
  stopAzureSpeech();
}

/** Synthesize MP3 blob for playback (e.g. model answers). */
export async function synthesizeSpeechBlob(
  text: string,
  voiceType: AzureVoiceType = "male_candidate",
): Promise<Blob | null> {
  return synthesizeExamMp3(text, VOICE_MAP[voiceType]);
}

async function blobToBase64(blob: Blob): Promise<string> {
  const buffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

/** Transcribe a recorded audio blob via secure backend route. */
export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  const audioBase64 = await blobToBase64(audioBlob);
  const res = await fetch("/api/stt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ audioBase64, mimeType: audioBlob.type }),
  });
  const data = (await res.json()) as { transcript?: string; error?: string };
  if (!res.ok || !data.transcript) {
    throw new Error(data.error ?? "Transcription failed");
  }
  return data.transcript;
}

/** Assess pronunciation via secure backend route. */
export async function assessPronunciation(
  audioBlob: Blob,
  referenceText?: string,
): Promise<AzurePronunciationResult | null> {
  const audioBase64 = await blobToBase64(audioBlob);
  const res = await fetch("/api/pronunciation-assessment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ audioBase64, referenceText: referenceText ?? "" }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return {
    accuracyScore: data.accuracyScore ?? 0,
    fluencyScore: data.fluencyScore ?? 0,
    completenessScore: data.completenessScore ?? 0,
    prosodyScore: data.prosodyScore ?? 0,
    recognizedText: data.recognizedText ?? "",
    words: [],
  };
}

/** Evaluate answer via secure backend route. */
export async function evaluateAnswer(
  transcript: string,
  question: string,
  modelAnswer: string,
  type: EvaluateType,
  azureResult?: AzurePronunciationResult,
  keywords?: string[],
): Promise<EvaluateFeedback> {
  const res = await fetch("/api/evaluate-answer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      transcript,
      question,
      modelAnswer,
      type,
      keywords,
      answerMode: type === "part1" ? "level5" : undefined,
    }),
  });
  const data = (await res.json()) as EvaluateFeedback;
  if (azureResult) {
    return mergeAzureIntoFeedback(data, azureResult, type);
  }
  return data;
}
