/**
 * TTS abstraction — Azure Neural primary, browser fallback.
 * Swap provider later (ElevenLabs / OpenAI) by changing speakText internals.
 */

import { isAzureSpeechConfigured, synthesizeAzureSpeech } from "@/lib/azure/synthesizeSpeech";

export type VoiceType = "female_examiner" | "male_candidate";
export type SpeechEngine = "azure" | "browser" | "none";

export type SpeakOptions = {
  rate?: number;
  onEnd?: () => void;
  onError?: (err: string) => void;
};

let speaking = false;
let paused = false;
let pausedAt = 0;
let pausedText = "";
let pausedVoice: VoiceType = "female_examiner";
let pausedRate = 1;
let resumeOnEnd: (() => void) | undefined;

let currentUtterance: SpeechSynthesisUtterance | null = null;
let activeAudio: HTMLAudioElement | null = null;
let activeBlobUrl: string | null = null;
let activeEngine: SpeechEngine = "none";

const preferredVoices: Partial<Record<VoiceType, string>> = {};

const FEMALE_PATTERNS = [
  /Jenny/i,
  /Aria/i,
  /Samantha/i,
  /Karen/i,
  /Victoria/i,
  /Moira/i,
  /Google US English/i,
  /Microsoft.*Zira/i,
  /female/i,
];
const MALE_PATTERNS = [
  /Guy/i,
  /Davis/i,
  /Daniel/i,
  /Alex/i,
  /Tom/i,
  /Microsoft.*Mark/i,
  /male/i,
];

const audioCache = new Map<string, Blob>();
const AUDIO_CACHE_MAX = 40;

export function setPreferredVoice(type: VoiceType, voiceName: string): void {
  preferredVoices[type] = voiceName;
  if (typeof window !== "undefined") {
    localStorage.setItem(`icao_tts_voice_${type}`, voiceName);
  }
}

export function loadPreferredVoices(): void {
  if (typeof window === "undefined") return;
  (["female_examiner", "male_candidate"] as VoiceType[]).forEach((type) => {
    const saved = localStorage.getItem(`icao_tts_voice_${type}`);
    if (saved) preferredVoices[type] = saved;
  });
}

export function getActiveSpeechEngine(): SpeechEngine {
  return activeEngine;
}

function cacheKey(voiceType: VoiceType, text: string): string {
  return `${voiceType}::${text}`;
}

function rememberCache(key: string, blob: Blob): void {
  if (audioCache.size >= AUDIO_CACHE_MAX) {
    const first = audioCache.keys().next().value;
    if (first) audioCache.delete(first);
  }
  audioCache.set(key, blob);
}

function cleanupAudio(): void {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.onended = null;
    activeAudio.onerror = null;
    activeAudio = null;
  }
  if (activeBlobUrl) {
    URL.revokeObjectURL(activeBlobUrl);
    activeBlobUrl = null;
  }
}

function scoreVoice(voice: SpeechSynthesisVoice, type: VoiceType): number {
  let score = 0;
  const name = voice.name;
  if (/Neural|Natural|Premium|Enhanced/i.test(name)) score += 80;
  if (/Google/i.test(name)) score += 40;
  if (/Microsoft/i.test(name)) score += 30;
  if (/Samantha|Karen|Daniel|Alex/i.test(name)) score += 25;
  if (/Compact|Robotic|espeak/i.test(name)) score -= 60;
  if (voice.lang.startsWith("en-US")) score += 15;
  else if (voice.lang.startsWith("en")) score += 8;
  const patterns = type === "female_examiner" ? FEMALE_PATTERNS : MALE_PATTERNS;
  if (patterns.some((p) => p.test(name))) score += 50;
  if (type === "female_examiner" && /female|samantha|jenny|aria|karen/i.test(name)) score += 20;
  if (type === "male_candidate" && /male|guy|daniel|david|alex/i.test(name)) score += 20;
  return score;
}

function pickVoice(type: VoiceType): SpeechSynthesisVoice | null {
  if (typeof window === "undefined") return null;
  const voices = window.speechSynthesis.getVoices();
  const preferred = preferredVoices[type];
  if (preferred) {
    const match = voices.find((v) => v.name === preferred);
    if (match) return match;
  }

  const en = voices.filter((v) => v.lang.startsWith("en"));
  if (!en.length) return null;

  return en.reduce<SpeechSynthesisVoice | null>((best, voice) => {
    const s = scoreVoice(voice, type);
    if (!best || s > scoreVoice(best, type)) return voice;
    return best;
  }, null);
}

function finishSpeaking(onEnd?: () => void): void {
  speaking = false;
  paused = false;
  currentUtterance = null;
  activeEngine = "none";
  onEnd?.();
}

function runBrowserSpeak(
  text: string,
  type: VoiceType,
  rate: number,
  onEnd?: () => void,
  onError?: (e: string) => void,
): void {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    onError?.("Speech synthesis not available");
    onEnd?.();
    return;
  }

  window.speechSynthesis.cancel();
  cleanupAudio();

  const utterance = new SpeechSynthesisUtterance(text);
  const voice = pickVoice(type);
  if (voice) utterance.voice = voice;
  utterance.lang = voice?.lang ?? "en-US";
  utterance.rate = Math.min(1.1, Math.max(0.85, rate));
  utterance.pitch = 1;
  utterance.volume = 1;
  currentUtterance = utterance;
  activeEngine = "browser";
  speaking = true;
  paused = false;

  utterance.onend = () => finishSpeaking(onEnd);
  utterance.onerror = () => {
    onError?.("Speech error");
    finishSpeaking(onEnd);
  };
  window.speechSynthesis.speak(utterance);
}

async function runAzureSpeak(
  text: string,
  type: VoiceType,
  rate: number,
  onEnd?: () => void,
  onError?: (e: string) => void,
): Promise<boolean> {
  const key = cacheKey(type, text);
  let blob = audioCache.get(key) ?? null;
  if (!blob) {
    blob = await synthesizeAzureSpeech(text, type);
    if (blob) rememberCache(key, blob);
  }
  if (!blob) return false;

  cleanupAudio();
  if (typeof window !== "undefined") window.speechSynthesis.cancel();

  const url = URL.createObjectURL(blob);
  activeBlobUrl = url;
  const audio = new Audio(url);
  audio.playbackRate = Math.min(1.5, Math.max(0.5, rate));
  activeAudio = audio;
  activeEngine = "azure";
  speaking = true;
  paused = false;

  audio.onended = () => {
    cleanupAudio();
    finishSpeaking(onEnd);
  };
  audio.onerror = () => {
    onError?.("Audio playback error");
    cleanupAudio();
    finishSpeaking(onEnd);
  };

  try {
    await audio.play();
    return true;
  } catch {
    cleanupAudio();
    finishSpeaking();
    return false;
  }
}

export function isSpeechActive(): boolean {
  return speaking;
}

export function stopSpeech(): void {
  if (typeof window !== "undefined") window.speechSynthesis.cancel();
  cleanupAudio();
  speaking = false;
  paused = false;
  currentUtterance = null;
  pausedText = "";
  pausedAt = 0;
  resumeOnEnd = undefined;
  activeEngine = "none";
}

export function pauseSpeech(): void {
  if (activeAudio && !activeAudio.paused) {
    paused = true;
    pausedAt = activeAudio.currentTime;
    activeAudio.pause();
    speaking = false;
    return;
  }

  if (speaking && currentUtterance) {
    paused = true;
    pausedText = currentUtterance.text ?? "";
    pausedVoice = activeEngine === "browser" ? inferVoiceFromUtterance() : pausedVoice;
    if (typeof window !== "undefined") window.speechSynthesis.cancel();
    speaking = false;
    currentUtterance = null;
  }
}

function inferVoiceFromUtterance(): VoiceType {
  const name = currentUtterance?.voice?.name ?? "";
  return MALE_PATTERNS.some((p) => p.test(name)) ? "male_candidate" : "female_examiner";
}

export function resumeSpeech(type: VoiceType = "female_examiner", rate = 1, onEnd?: () => void): void {
  if (activeAudio && paused) {
    paused = false;
    speaking = true;
    activeAudio.playbackRate = Math.min(1.5, Math.max(0.5, rate));
    activeAudio.currentTime = pausedAt;
    activeAudio.onended = () => {
      cleanupAudio();
      finishSpeaking(onEnd ?? resumeOnEnd);
    };
    void activeAudio.play();
    return;
  }

  if (paused && pausedText) {
    const text = pausedText;
    const voice = pausedVoice || type;
    paused = false;
    pausedText = "";
    speakText(text, voice, { rate, onEnd: onEnd ?? resumeOnEnd });
  }
}

export function speakText(text: string, voiceType: VoiceType, options: SpeakOptions = {}): boolean {
  const trimmed = text.trim();
  if (!trimmed) {
    options.onEnd?.();
    return false;
  }

  const rate = options.rate ?? 1;
  resumeOnEnd = options.onEnd;

  if (typeof window === "undefined") {
    options.onError?.("Speech synthesis not available");
    options.onEnd?.();
    return false;
  }

  const start = () => {
    void (async () => {
      try {
        const azureOk = await isAzureSpeechConfigured();
        if (azureOk) {
          const played = await runAzureSpeak(trimmed, voiceType, rate, options.onEnd, options.onError);
          if (played) return;
        }
      } catch {
        /* fall through to browser */
      }

      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        const onVoices = () => {
          window.speechSynthesis.removeEventListener("voiceschanged", onVoices);
          runBrowserSpeak(trimmed, voiceType, rate, options.onEnd, options.onError);
        };
        window.speechSynthesis.addEventListener("voiceschanged", onVoices);
        window.speechSynthesis.getVoices();
        return;
      }

      runBrowserSpeak(trimmed, voiceType, rate, options.onEnd, options.onError);
    })();
  };

  start();
  return true;
}

export function prefetchSpeech(text: string, voiceType: VoiceType): void {
  const trimmed = text.trim();
  if (!trimmed) return;
  const key = cacheKey(voiceType, trimmed);
  if (audioCache.has(key)) return;

  void (async () => {
    if (!(await isAzureSpeechConfigured())) return;
    const blob = await synthesizeAzureSpeech(trimmed, voiceType);
    if (blob) rememberCache(key, blob);
  })();
}

/** Warm Azure token + preload first phrases for smoother playback. */
export async function warmSpeechEngine(samples?: Array<{ text: string; voice: VoiceType }>): Promise<SpeechEngine> {
  loadPreferredVoices();
  if (typeof window !== "undefined") window.speechSynthesis.getVoices();

  const azureOk = await isAzureSpeechConfigured();
  if (azureOk && samples?.length) {
    await Promise.all(
      samples.slice(0, 3).map(async ({ text, voice }) => {
        const key = cacheKey(voice, text.trim());
        if (audioCache.has(key)) return;
        const blob = await synthesizeAzureSpeech(text, voice);
        if (blob) rememberCache(key, blob);
      }),
    );
    return "azure";
  }
  return azureOk ? "azure" : "browser";
}

export function listAvailableVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined") return [];
  return window.speechSynthesis
    .getVoices()
    .filter((v) => v.lang.startsWith("en"))
    .sort((a, b) => scoreVoice(b, "female_examiner") - scoreVoice(a, "female_examiner"));
}
