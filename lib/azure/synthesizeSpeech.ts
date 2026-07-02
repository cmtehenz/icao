import { loadSpeechSdk } from "@/lib/azure/loadSpeechSdk";
import type { AzureSpeechTokenResponse } from "@/lib/azure/speechToken";

export type AzureVoiceRole = "female_examiner" | "male_candidate";

const AZURE_VOICES: Record<AzureVoiceRole, string> = {
  female_examiner: "en-US-JennyNeural",
  male_candidate: "en-US-GuyNeural",
};

const TOKEN_URL = "/api/azure-speech-token";

let cachedToken: AzureSpeechTokenResponse | null = null;
let tokenFetchedAt = 0;
const TOKEN_TTL_MS = 8 * 60 * 1000;

async function fetchToken(): Promise<AzureSpeechTokenResponse> {
  const now = Date.now();
  if (cachedToken?.configured && cachedToken.token && now - tokenFetchedAt < TOKEN_TTL_MS) {
    return cachedToken;
  }
  const res = await fetch(TOKEN_URL);
  const data = (await res.json()) as AzureSpeechTokenResponse;
  cachedToken = data;
  tokenFetchedAt = now;
  return data;
}

export async function isAzureSpeechConfigured(): Promise<boolean> {
  const data = await fetchToken();
  return !!(data.configured && data.token && data.region);
}

/** Neural Azure TTS as WAV — Jenny (examiner) or Guy (candidate). */
export async function synthesizeAzureSpeech(
  text: string,
  role: AzureVoiceRole = "female_examiner",
): Promise<Blob | null> {
  const trimmed = text.trim();
  if (!trimmed) return null;

  const tokenData = await fetchToken();
  if (!tokenData.configured || !tokenData.token || !tokenData.region) return null;

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

export function azureVoiceName(role: AzureVoiceRole): string {
  return AZURE_VOICES[role];
}
