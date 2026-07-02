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

let activeSynthesizer: { close: () => void } | null = null;
let pausedPayload: { text: string; role: AzureVoiceRole; rate: number; generation: number } | null = null;
let resumeCallback: (() => void) | undefined;
let suppressEndCallback = false;
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

function closeActiveSynthesizer(suppressEnd: boolean): void {
  if (!activeSynthesizer) return;
  if (suppressEnd) suppressEndCallback = true;
  activeSynthesizer.close();
  activeSynthesizer = null;
}

export function stopAzureSpeech(): void {
  speakGeneration += 1;
  closeActiveSynthesizer(true);
  pausedPayload = null;
  resumeCallback = undefined;
}

export function pauseAzureSpeech(): boolean {
  if (!activeSynthesizer) return pausedPayload !== null;
  closeActiveSynthesizer(true);
  return pausedPayload !== null;
}

export async function speakAzureText(
  text: string,
  role: AzureVoiceRole,
  rate = 1,
  onEnd?: () => void,
  onError?: (msg: string) => void,
): Promise<boolean> {
  const trimmed = text.trim();
  if (!trimmed) {
    onEnd?.();
    return true;
  }

  const myGeneration = ++speakGeneration;
  closeActiveSynthesizer(true);
  suppressEndCallback = false;

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
    onEnd?.();
    return false;
  }

  const sdk = await loadSpeechSdk();
  if (myGeneration !== speakGeneration) return false;

  const speechConfig = sdk.SpeechConfig.fromAuthorizationToken(tokenData.token, tokenData.region);
  speechConfig.speechSynthesisVoiceName = AZURE_VOICES[role];
  const synthesizer = new sdk.SpeechSynthesizer(speechConfig);
  activeSynthesizer = synthesizer;
  pausedPayload = { text: trimmed, role, rate, generation: myGeneration };
  resumeCallback = onEnd;

  const finish = (result: { reason: number; errorDetails?: string }, synth: { close: () => void }) => {
    synth.close();
    if (activeSynthesizer === synth) activeSynthesizer = null;

    if (myGeneration !== speakGeneration) return false;

    if (suppressEndCallback) {
      suppressEndCallback = false;
      return false;
    }

    if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
      pausedPayload = null;
      resumeCallback = undefined;
      onEnd?.();
      return true;
    }

    if (result.reason === sdk.ResultReason.Canceled) {
      return false;
    }

    const detail = result.errorDetails || `Azure TTS error (${result.reason})`;
    onError?.(detail);
    onEnd?.();
    return false;
  };

  return new Promise((resolve) => {
    const onSuccess = (result: { reason: number; errorDetails?: string }) => {
      resolve(finish(result, synthesizer));
    };
    const onFailure = (err: string) => {
      synthesizer.close();
      if (activeSynthesizer === synthesizer) activeSynthesizer = null;
      if (myGeneration !== speakGeneration) {
        suppressEndCallback = false;
        resolve(false);
        return;
      }
      if (suppressEndCallback) {
        suppressEndCallback = false;
        resolve(false);
        return;
      }
      onError?.(err);
      onEnd?.();
      resolve(false);
    };

    synthesizer.speakTextAsync(trimmed, onSuccess, onFailure);
  });
}

export function resumeAzureSpeech(
  onEnd?: () => void,
  onError?: (msg: string) => void,
): void {
  if (!pausedPayload) return;
  const { text, role, rate } = pausedPayload;
  void speakAzureText(text, role, rate, onEnd ?? resumeCallback, onError);
}

export function azureVoiceName(role: AzureVoiceRole): string {
  return AZURE_VOICES[role];
}

/** Blob synthesis for audio compare / replay widgets. */
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
