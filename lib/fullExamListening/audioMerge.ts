/**
 * Merge mixed-format clips (Azure MP3 + original ATC MP3) into one WAV.
 * Naive MP3 concatenation breaks when bitrates/sample rates differ.
 */

const TARGET_SAMPLE_RATE = 22050;

function writeString(view: DataView, offset: number, str: string): void {
  for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
}

/** Encode a mono/stereo AudioBuffer as 16-bit PCM WAV. */
export function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = 1;
  const sampleRate = buffer.sampleRate;
  const samples = buffer.length;
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const dataSize = samples * blockAlign;
  const headerSize = 44;
  const arrayBuffer = new ArrayBuffer(headerSize + dataSize);
  const view = new DataView(arrayBuffer);

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);

  const channel = buffer.numberOfChannels > 0 ? buffer.getChannelData(0) : new Float32Array(samples);
  const extra =
    buffer.numberOfChannels > 1 ? buffer.getChannelData(1) : null;

  let offset = 44;
  for (let i = 0; i < samples; i++) {
    let sample = channel[i] ?? 0;
    if (extra) sample = (sample + (extra[i] ?? 0)) * 0.5;
    const s = Math.max(-1, Math.min(1, sample));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    offset += 2;
  }

  return new Blob([arrayBuffer], { type: "audio/wav" });
}

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
