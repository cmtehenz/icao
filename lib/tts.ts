let speaking = false;

export function isSpeaking() {
  return speaking;
}

export function stopSpeaking() {
  if (typeof window === "undefined") return;
  window.speechSynthesis.cancel();
  speaking = false;
}

function pickEnglishVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  const patterns = [
    /Jenny/i,
    /Aria/i,
    /Samantha/i,
    /Google US English/i,
    /Microsoft.*English.*United States/i,
    /en-US/i,
    /en-GB/i,
  ];
  for (const pattern of patterns) {
    const match = voices.find((voice) => pattern.test(voice.name) || pattern.test(voice.lang));
    if (match) return match;
  }
  return voices.find((voice) => voice.lang.startsWith("en")) ?? null;
}

function runSpeak(text: string, onEnd?: () => void) {
  stopSpeaking();
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = pickEnglishVoice();
  if (voice) utterance.voice = voice;
  utterance.lang = voice?.lang ?? "en-US";
  utterance.rate = 0.95;
  utterance.pitch = 1;
  utterance.onend = () => {
    speaking = false;
    onEnd?.();
  };
  utterance.onerror = () => {
    speaking = false;
    onEnd?.();
  };
  speaking = true;
  window.speechSynthesis.speak(utterance);
}

export function speakText(text: string, onEnd?: () => void) {
  if (typeof window === "undefined" || !window.speechSynthesis) return false;

  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) {
    const onVoices = () => {
      window.speechSynthesis.removeEventListener("voiceschanged", onVoices);
      runSpeak(text, onEnd);
    };
    window.speechSynthesis.addEventListener("voiceschanged", onVoices);
    window.speechSynthesis.getVoices();
    return true;
  }

  runSpeak(text, onEnd);
  return true;
}
