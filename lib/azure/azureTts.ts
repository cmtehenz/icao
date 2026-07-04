import { loadSpeechSdk } from "@/lib/azure/loadSpeechSdk";
import type { AzureSpeechTokenResponse } from "@/lib/azure/speechToken";

export type AzureVoiceRole = "female_examiner" | "male_candidate" | "captain_delta";

export const AZURE_VOICES: Record<AzureVoiceRole, string> = {
  female_examiner: "en-US-JennyNeural",
  male_candidate: "en-US-GuyNeural",
  captain_delta: "en-US-AndrewNeural",
};

const TOKEN_URL = "/api/azure-speech-token";
const TOKEN_TTL_MS = 8 * 60 * 1000;

let cachedToken: AzureSpeechTokenResponse | null = null;
let tokenFetchedAt = 0;

let activeSynthesizer: { close: () => void } | null = null;
let speakGeneration = 0;

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

function closeActiveSynthesizer(): void {
  if (!activeSynthesizer) return;
  activeSynthesizer.close();
  activeSynthesizer = null;
}

/** Cancel in-flight Azure speaker synthesis. */
export function stopAzureSpeech(): void {
  speakGeneration += 1;
  closeActiveSynthesizer();
}

let speakQueue: Promise<boolean> = Promise.resolve(true);

/**
 * Speak via Azure default output — strictly one clip at a time (study / flashcards).
 * Escutar Prova uses examAudioPipeline instead.
 */
export async function speakAzureText(
  text: string,
  role: AzureVoiceRole,
  _rate = 1,
  onError?: (msg: string) => void,
): Promise<boolean> {
  const run = async (): Promise<boolean> => {
    const trimmed = text.trim();
    if (!trimmed) return true;

    const myGeneration = ++speakGeneration;
    closeActiveSynthesizer();

    let tokenData = await fetchAzureToken();
    if (myGeneration !== speakGeneration) return false;

    if (!tokenData.token || !tokenData.region) {
      tokenData = await fetchAzureToken(true);
    }
    if (myGeneration !== speakGeneration) return false;

    if (!tokenData.token || !tokenData.region) {
      const msg =
        tokenData.error ??
        (tokenData.configured === false
          ? "Azure Speech não configurado no servidor."
          : "Azure Speech indisponível. Confirme que você está logado.");
      onError?.(msg);
      return false;
    }

    const sdk = await loadSpeechSdk();
    if (myGeneration !== speakGeneration) return false;

    const speechConfig = sdk.SpeechConfig.fromAuthorizationToken(tokenData.token, tokenData.region);
    speechConfig.speechSynthesisVoiceName = AZURE_VOICES[role];
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig);
    activeSynthesizer = synthesizer;

    return new Promise((resolve) => {
      const done = (ok: boolean) => {
        synthesizer.close();
        if (activeSynthesizer === synthesizer) activeSynthesizer = null;
        if (myGeneration !== speakGeneration) {
          resolve(false);
          return;
        }
        resolve(ok);
      };

      synthesizer.speakTextAsync(
        trimmed,
        (result) => {
          if (myGeneration !== speakGeneration) {
            done(false);
            return;
          }
          if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
            done(true);
            return;
          }
          if (result.reason === sdk.ResultReason.Canceled) {
            done(false);
            return;
          }
          onError?.(result.errorDetails || `Azure TTS error (${result.reason})`);
          done(false);
        },
        (err) => {
          onError?.(err);
          done(false);
        },
      );
    });
  };

  const result = await (speakQueue = speakQueue.then(run, run));
  return result;
}

/** MP3 blob for exam pipeline (browser-friendly). */
export async function synthesizeExamMp3(
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
  speechConfig.speechSynthesisOutputFormat =
    sdk.SpeechSynthesisOutputFormat.Audio24Khz48KBitRateMonoMp3;
  const synthesizer = new sdk.SpeechSynthesizer(speechConfig, null);

  return new Promise((resolve) => {
    synthesizer.speakTextAsync(
      trimmed,
      (result) => {
        synthesizer.close();
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted && result.audioData) {
          resolve(new Blob([result.audioData], { type: "audio/mpeg" }));
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

export const isAzureSpeechConfigured = isAzureTtsAvailable;

/** Neural TTS as WAV blob (for study replay panels). */
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
