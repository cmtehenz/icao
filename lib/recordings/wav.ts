/** Encode a mono/stereo AudioBuffer as 16-bit PCM WAV (plays on iPhone). */

function writeString(view: DataView, offset: number, str: string): void {
  for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
}

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
  const extra = buffer.numberOfChannels > 1 ? buffer.getChannelData(1) : null;

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
