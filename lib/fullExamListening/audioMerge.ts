/**
 * Merge mixed-format clips (Azure MP3 + original ATC MP3) into one WAV.
 * Naive MP3 concatenation breaks when bitrates/sample rates differ.
 */

import { audioBufferToWav } from "@/lib/recordings/wav";

const TARGET_SAMPLE_RATE = 22050;

async function decodeBlob(ctx: BaseAudioContext, blob: Blob): Promise<AudioBuffer> {
  const bytes = await blob.arrayBuffer();
  // copy: decodeAudioData may detach the buffer
  return ctx.decodeAudioData(bytes.slice(0));
}

export type MergedClip = {
  blob: Blob;
  itemIndex: number;
};

export type MergeResult = {
  blob: Blob;
  segments: Array<{ itemIndex: number; start: number; end: number }>;
  duration: number;
};

/**
 * Decode each clip and render a single mono WAV via OfflineAudioContext.
 * Preserves ATC and Azure audio regardless of original MP3 encoding.
 */
export async function mergeClipsToWav(
  clips: MergedClip[],
  signal?: AbortSignal,
): Promise<MergeResult> {
  if (!clips.length) throw new Error("Nenhum clip para mesclar.");

  const probe = new AudioContext();
  const decoded: AudioBuffer[] = [];

  try {
    if (probe.state === "suspended") await probe.resume();
    for (const clip of clips) {
      if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
      decoded.push(await decodeBlob(probe, clip.blob));
    }
  } finally {
    void probe.close();
  }

  let totalDuration = 0;
  for (const buf of decoded) totalDuration += buf.duration;

  const frameCount = Math.max(1, Math.ceil(totalDuration * TARGET_SAMPLE_RATE));
  const offline = new OfflineAudioContext(1, frameCount, TARGET_SAMPLE_RATE);

  let offset = 0;
  const segments: MergeResult["segments"] = [];

  for (let i = 0; i < decoded.length; i++) {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
    const buf = decoded[i];
    const src = offline.createBufferSource();
    src.buffer = buf;
    src.connect(offline.destination);
    src.start(offset);
    const start = offset;
    const end = offset + buf.duration;
    segments.push({ itemIndex: clips[i].itemIndex, start, end });
    offset = end;
  }

  const rendered = await offline.startRendering();
  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

  return {
    blob: audioBufferToWav(rendered),
    segments,
    duration: offset,
  };
}
