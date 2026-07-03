import { loadSpeechSdk } from "@/lib/azure/loadSpeechSdk";
import { AZURE_VOICES, type AzureVoiceRole } from "@/lib/azure/azureTts";

function getAzureConfig() {
  const key = process.env.AZURE_SPEECH_KEY;
  const region = process.env.AZURE_SPEECH_REGION;
  if (!key || !region) return null;
  return { key, region };
}

export async function synthesizeServerMp3(
  text: string,
  role: AzureVoiceRole = "female_examiner",
): Promise<Buffer | null> {
  const cfg = getAzureConfig();
  const trimmed = text.trim();
  if (!cfg || !trimmed) return null;

  const sdk = await loadSpeechSdk();
  const speechConfig = sdk.SpeechConfig.fromSubscription(cfg.key, cfg.region);
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
          resolve(Buffer.from(result.audioData));
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

export async function transcribeServerAudio(
  audioBase64: string,
  mimeType = "audio/webm",
): Promise<string | null> {
  const cfg = getAzureConfig();
  if (!cfg || !audioBase64) return null;

  const sdk = await loadSpeechSdk();
  const speechConfig = sdk.SpeechConfig.fromSubscription(cfg.key, cfg.region);
  speechConfig.speechRecognitionLanguage = "en-US";

  const audioBytes = Buffer.from(audioBase64, "base64");
  const pushStream = sdk.AudioInputStream.createPushStream();
  pushStream.write(audioBytes.buffer.slice(audioBytes.byteOffset, audioBytes.byteOffset + audioBytes.byteLength));
  pushStream.close();

  const audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
  const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

  return new Promise((resolve) => {
    recognizer.recognizeOnceAsync(
      (result) => {
        recognizer.close();
        if (result.reason === sdk.ResultReason.RecognizedSpeech) {
          resolve(result.text);
          return;
        }
        resolve(null);
      },
      () => {
        recognizer.close();
        resolve(null);
      },
    );
  });
}

export async function assessServerPronunciation(
  audioBase64: string,
  referenceText = "",
): Promise<{
  accuracyScore: number;
  fluencyScore: number;
  completenessScore: number;
  prosodyScore: number;
  recognizedText: string;
} | null> {
  const cfg = getAzureConfig();
  if (!cfg || !audioBase64) return null;

  const sdk = await loadSpeechSdk();
  const speechConfig = sdk.SpeechConfig.fromSubscription(cfg.key, cfg.region);
  speechConfig.speechRecognitionLanguage = "en-US";

  const audioBytes = Buffer.from(audioBase64, "base64");
  const pushStream = sdk.AudioInputStream.createPushStream();
  pushStream.write(audioBytes.buffer.slice(audioBytes.byteOffset, audioBytes.byteOffset + audioBytes.byteLength));
  pushStream.close();

  const audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
  const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

  const reference = referenceText.trim().slice(0, 500);
  const pronunciationConfig = new sdk.PronunciationAssessmentConfig(
    reference,
    sdk.PronunciationAssessmentGradingSystem.HundredMark,
    sdk.PronunciationAssessmentGranularity.Phoneme,
    !!reference,
  );
  pronunciationConfig.enableProsodyAssessment = true;
  pronunciationConfig.applyTo(recognizer);

  return new Promise((resolve) => {
    recognizer.recognizeOnceAsync(
      (result) => {
        recognizer.close();
        if (result.reason !== sdk.ResultReason.RecognizedSpeech) {
          resolve(null);
          return;
        }
        const pa = sdk.PronunciationAssessmentResult.fromResult(result);
        resolve({
          accuracyScore: Math.round(pa.accuracyScore),
          fluencyScore: Math.round(pa.fluencyScore),
          completenessScore: Math.round(pa.completenessScore),
          prosodyScore: Math.round(pa.prosodyScore ?? 0),
          recognizedText: result.text,
        });
      },
      () => {
        recognizer.close();
        resolve(null);
      },
    );
  });
}
