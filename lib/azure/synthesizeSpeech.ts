import { loadSpeechSdk } from "@/lib/azure/loadSpeechSdk";
import type { AzureSpeechTokenResponse } from "@/lib/azure/speechToken";

const AZURE_VOICE = "en-US-JennyNeural";
const TOKEN_URL = "/api/speech-token";

async function fetchToken(): Promise<AzureSpeechTokenResponse> {
  const res = await fetch(TOKEN_URL);
  return res.json();
}

/** Neural Azure TTS as WAV — same voice as shadowing (Jenny). */
export async function synthesizeAzureSpeech(text: string): Promise<Blob | null> {
  const trimmed = text.trim();
  if (!trimmed) return null;

  const tokenData = await fetchToken();
  if (!tokenData.configured || !tokenData.token || !tokenData.region) return null;

  const sdk = await loadSpeechSdk();
  const speechConfig = sdk.SpeechConfig.fromAuthorizationToken(tokenData.token, tokenData.region);
  speechConfig.speechSynthesisVoiceName = AZURE_VOICE;
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
