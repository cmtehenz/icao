/**
 * Convert recordings to WAV so they play on iPhone (Safari cannot play WebM/Opus).
 * Run on the device that recorded (Chrome can decode its own WebM).
 */

import { normalizeClientAudioBlob } from "@/lib/recordings/mime";
import { audioBufferToWav } from "@/lib/recordings/wav";

function isAlreadyUniversal(type: string): boolean {
  const t = type.toLowerCase();
  return (
    t.includes("wav") ||
    t.includes("mpeg") ||
    t.includes("mp3") ||
    t.includes("mp4") ||
    t.includes("m4a") ||
    t.includes("aac") ||
    t.includes("x-m4a") ||
    t.includes("caf")
  );
}

export function isWebmLike(type: string, filename = ""): boolean {
  const t = type.toLowerCase();
  const name = filename.toLowerCase();
  return t.includes("webm") || name.endsWith(".webm") || t.includes("ogg") || name.endsWith(".ogg");
}

/**
 * Returns a blob safe for iOS playback. WebM/Ogg → WAV via Web Audio decode.
 * If decode fails (e.g. iOS trying to decode WebM), returns the original normalized blob.
 */
export async function toUniversalPlayableBlob(blob: Blob): Promise<Blob> {
  if (!blob.size) return blob;

  const normalized = normalizeClientAudioBlob(blob);
  if (isAlreadyUniversal(normalized.type)) {
    return normalized;
  }

  try {
    const ctx = new AudioContext();
    try {
      if (ctx.state === "suspended") await ctx.resume();
      const bytes = await normalized.arrayBuffer();
      const buffer = await ctx.decodeAudioData(bytes.slice(0));
      return audioBufferToWav(buffer);
    } finally {
      void ctx.close();
    }
  } catch (e) {
    console.warn("[audio] could not convert recording to WAV", e);
    return normalized;
  }
}
