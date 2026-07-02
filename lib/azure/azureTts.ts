import { loadSpeechSdk } from "@/lib/azure/loadSpeechSdk";
import type { AzureSpeechTokenResponse } from "@/lib/azure/speechToken";

export type AzureVoiceRole = "female_examiner" | "male_candidate";

export const AZURE_VOICES: Record<AzureVoiceRole, string> = {
  female_examiner: "en-US-JennyNeural",
  male_candidate: "en-US-GuyNeural",
};

const TOKEN_URL = "/api/azure-speech-token";
const TOKEN_TTL_MS = 8 * 60 * 1000;

let cachedToken: AzureSpeechTokenResponse | null = null;
let tokenFetchedAt = 0;

export async function fetchAzureToken(force = false): Promise<AzureSpeechTokenResponse> {
  const now = Date.now();
  if (!force && cachedToken?.token && cachedToken.region && now - tokenFetchedAt < TOKEN_TTL_MS) {
    return cachedToken;
  }

  const res = await fetch(TOKEN_URL, { credentials: "same-origin", cache: "no-store" });
  let data: AzureSpeechTokenResponse = { configured: false };
  try {
    data = (await res.json()) as AzureSpeechTokenResponse;
  } catch {
    data = { configured: false, error: "Resposta inválida do servidor" };
  }

  if (res.ok && data.token && data.region) {
    cachedToken = data;
    tokenFetchedAt = now;
  } else {
    cachedToken = null;
    tokenFetchedAt = 0;
  }

  return data;
}

export async function isAzureTtsAvailable(): Promise<boolean> {
  const data = await fetchAzureToken();
  return !!(data.token && data.region);
}

/** Legacy no-op — exam listening uses examAudioBus instead of direct speaker output. */
export function stopAzureSpeech(): void {}

export function azureVoiceName(role: AzureVoiceRole): string {
  return AZURE_VOICES[role];
}

/** Neural TTS as WAV blob (Jenny / Guy). */
export async function synthesizeAzureSpeech(
  text: string,
  role: AzureVoiceRole = "female_examiner",
): Promise<Blob | null> {
  const trimmed = text.trim();
  if (!trimmed) return null;

  const tokenData = await fetchAzureToken();
  if (!tokenData.token || !tokenData.region) return null;

  const sdk = await loadSpeechSdk();
  const speechConfig = sdk.SpeechConfig.fromAuthorizationToken(tokenData.token, tokenData.region);
  speechConfig.speechSynthesisVoiceName = AZURE_VOICES[role];
  const synthesizer = new sdk.SpeechSynthesizer(speechConfig, null);

  return new Promise((resolve) => {
    synthesizer.speakTextAsync(
      trimmed,
      (result) => {
        synthesizer.close();
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted && result.audioData) {
          resolve(new Blob([result.audioData], { type: "audio/wav" }));
          return;
        }
        resolve(null);
      },
      () => {
        synthesizer.close();
        resolve(null);
      },
    );
  });
}

export const isAzureSpeechConfigured = isAzureTtsAvailable;
