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
let pausedPayload: { text: string; role: AzureVoiceRole; rate: number } | null = null;
let resumeCallback: (() => void) | undefined;
let suppressEndCallback = false;

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

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildSsml(text: string, voice: string, rate: number): string {
  const prosodyRate =
    rate <= 0.8 ? ' rate="-12%"' : rate >= 1.2 ? ' rate="+12%"' : "";
  return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US"><voice name="${voice}"><prosody${prosodyRate}>${escapeXml(text)}</prosody></voice></speak>`;
}

export function stopAzureSpeech(): void {
  suppressEndCallback = true;
  if (activeSynthesizer) {
    activeSynthesizer.close();
    activeSynthesizer = null;
  }
  pausedPayload = null;
  resumeCallback = undefined;
}

export function pauseAzureSpeech(): boolean {
  if (!activeSynthesizer) return false;
  suppressEndCallback = true;
  activeSynthesizer.close();
  activeSynthesizer = null;
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

  stopAzureSpeech();

  let tokenData = await fetchAzureToken();
  if (!tokenData.token || !tokenData.region) {
    tokenData = await fetchAzureToken(true);
  }
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
  const speechConfig = sdk.SpeechConfig.fromAuthorizationToken(tokenData.token, tokenData.region);
  speechConfig.speechSynthesisVoiceName = AZURE_VOICES[role];
  const synthesizer = new sdk.SpeechSynthesizer(speechConfig);
  activeSynthesizer = synthesizer;
  pausedPayload = { text: trimmed, role, rate };
  resumeCallback = onEnd;

  const ssml = buildSsml(trimmed, AZURE_VOICES[role], rate);

  return new Promise((resolve) => {
    synthesizer.speakSsmlAsync(
      ssml,
      (result) => {
        synthesizer.close();
        if (activeSynthesizer === synthesizer) activeSynthesizer = null;

        if (suppressEndCallback) {
          suppressEndCallback = false;
          resolve(true);
          return;
        }

        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          pausedPayload = null;
          resumeCallback = undefined;
          onEnd?.();
          resolve(true);
          return;
        }

        if (result.reason === sdk.ResultReason.Canceled) {
          resolve(false);
          return;
        }

        const detail = result.errorDetails || `Azure TTS error (${result.reason})`;
        onError?.(detail);
        onEnd?.();
        resolve(false);
      },
      (err) => {
        synthesizer.close();
        if (activeSynthesizer === synthesizer) activeSynthesizer = null;
        if (suppressEndCallback) {
          suppressEndCallback = false;
          resolve(false);
          return;
        }
        onError?.(err);
        onEnd?.();
        resolve(false);
      },
    );
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

// Back-compat alias
export const isAzureSpeechConfigured = isAzureTtsAvailable;
