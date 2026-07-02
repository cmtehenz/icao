/**
 * Browser TTS abstraction — swap for ElevenLabs / OpenAI / Google later.
 */

export type VoiceType = "female_examiner" | "male_candidate";

export type SpeakOptions = {
  rate?: number;
  onEnd?: () => void;
  onError?: (err: string) => void;
};

let speaking = false;
let paused = false;
let currentUtterance: SpeechSynthesisUtterance | null = null;
let pausedAt = 0;
let pausedText = "";
const preferredVoices: Partial<Record<VoiceType, string>> = {};

const FEMALE_PATTERNS = [/Jenny/i, /Aria/i, /Samantha/i, /Victoria/i, /Karen/i, /female/i];
const MALE_PATTERNS = [/Guy/i, /Daniel/i, /David/i, /Mark/i, /James/i, /male/i];

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

function pickVoice(type: VoiceType): SpeechSynthesisVoice | null {
  if (typeof window === "undefined") return null;
  const voices = window.speechSynthesis.getVoices();
  const preferred = preferredVoices[type];
  if (preferred) {
    const match = voices.find((v) => v.name === preferred);
    if (match) return match;
  }
  const patterns = type === "female_examiner" ? FEMALE_PATTERNS : MALE_PATTERNS;
  for (const pattern of patterns) {
    const match = voices.find((v) => pattern.test(v.name));
    if (match) return match;
  }
  const en = voices.filter((v) => v.lang.startsWith("en"));
  if (type === "female_examiner") {
    return en.find((v) => /female|samantha|aria|jenny/i.test(v.name)) ?? en[0] ?? null;
  }
  return en.find((v) => /male|guy|daniel|david/i.test(v.name)) ?? en[1] ?? en[0] ?? null;
}

function runSpeak(text: string, type: VoiceType, rate: number, onEnd?: () => void, onError?: (e: string) => void) {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    onError?.("Speech synthesis not available");
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = pickVoice(type);
  if (voice) utterance.voice = voice;
  utterance.lang = voice?.lang ?? "en-US";
  utterance.rate = rate;
  utterance.pitch = type === "female_examiner" ? 1.05 : 0.95;
  currentUtterance = utterance;
  utterance.onend = () => {
    speaking = false;
    paused = false;
    currentUtterance = null;
    onEnd?.();
  };
  utterance.onerror = () => {
    speaking = false;
    paused = false;
    currentUtterance = null;
    onError?.("Speech error");
    onEnd?.();
  };
  speaking = true;
  paused = false;
  window.speechSynthesis.speak(utterance);
}

export function isSpeechActive(): boolean {
  return speaking;
}

export function stopSpeech(): void {
  if (typeof window === "undefined") return;
  window.speechSynthesis.cancel();
  speaking = false;
  paused = false;
  currentUtterance = null;
  pausedText = "";
  pausedAt = 0;
}

/** Web Speech API cannot truly pause — we stop and keep text for resume. */
export function pauseSpeech(): void {
  if (!speaking || typeof window === "undefined") return;
  paused = true;
  pausedText = currentUtterance?.text ?? "";
  window.speechSynthesis.cancel();
  speaking = false;
}

export function resumeSpeech(type: VoiceType = "female_examiner", rate = 1, onEnd?: () => void): void {
  if (!paused || !pausedText) return;
  const text = pausedText;
  paused = false;
  pausedText = "";
  speakText(text, type, { rate, onEnd });
}

export function speakText(text: string, voiceType: VoiceType, options: SpeakOptions = {}): boolean {
  const trimmed = text.trim();
  if (!trimmed) {
    options.onEnd?.();
    return false;
  }
  const rate = options.rate ?? 1;

  if (typeof window === "undefined" || !window.speechSynthesis) {
    options.onError?.("Speech synthesis not available");
    options.onEnd?.();
    return false;
  }

  const voices = window.speechSynthesis.getVoices();
  const start = () => runSpeak(trimmed, voiceType, rate, options.onEnd, options.onError);

  if (voices.length === 0) {
    const onVoices = () => {
      window.speechSynthesis.removeEventListener("voiceschanged", onVoices);
      start();
    };
    window.speechSynthesis.addEventListener("voiceschanged", onVoices);
    window.speechSynthesis.getVoices();
    return true;
  }

  start();
  return true;
}

export function listAvailableVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined") return [];
  return window.speechSynthesis.getVoices();
}
