export function normalizeRecordingMime(mimeType: string, filename: string): string {
  const mime = mimeType.trim().toLowerCase();
  const name = filename.toLowerCase();

  if (mime.startsWith("audio/")) return mime;
  if (mime === "video/webm" || name.endsWith(".webm")) return "audio/webm";
  if (mime === "video/mp4" || name.endsWith(".mp4") || name.endsWith(".m4a")) return "audio/mp4";
  if (mime === "application/octet-stream") {
    if (name.endsWith(".wav")) return "audio/wav";
    if (name.endsWith(".ogg")) return "audio/ogg";
    if (name.endsWith(".mp4") || name.endsWith(".m4a")) return "audio/mp4";
    return "audio/webm";
  }
  if (!mime && name.endsWith(".wav")) return "audio/wav";
  if (!mime && name.endsWith(".webm")) return "audio/webm";
  return mime || "audio/wav";
}

export function isAllowedRecordingMime(mimeType: string, filename: string): boolean {
  return normalizeRecordingMime(mimeType, filename).startsWith("audio/");
}

export function extensionForRecordingMime(mimeType: string): string {
  if (mimeType.includes("wav")) return "wav";
  if (mimeType.includes("ogg")) return "ogg";
  if (mimeType.includes("mp4") || mimeType.includes("m4a") || mimeType.includes("aac")) {
    return "mp4";
  }
  return "webm";
}

/** Garante type audio/* no blob antes do upload (Chrome às vezes manda video/webm ou vazio). */
export function normalizeClientAudioBlob(blob: Blob): Blob {
  const type = blob.type.trim().toLowerCase();
  if (type.startsWith("audio/")) return blob;
  const normalized = normalizeRecordingMime(type, "recording.webm");
  if (normalized.startsWith("audio/")) {
    return new Blob([blob], { type: normalized });
  }
  return new Blob([blob], { type: "audio/webm" });
}

export function filenameForAudioBlob(blob: Blob): string {
  const type = normalizeRecordingMime(blob.type, "recording.webm");
  return `recording.${extensionForRecordingMime(type)}`;
}

/** MIME para reprodução no Safari/iOS (exige audio/mp4 ou wav, não video/mp4 / webm). */
export function playbackContentType(mimeType: string, audioKey: string): string {
  const normalized = normalizeRecordingMime(mimeType, audioKey);
  if (normalized.includes("wav")) return "audio/wav";
  if (normalized.includes("mp4") || normalized.includes("m4a") || normalized.includes("aac")) {
    return "audio/mp4";
  }
  if (normalized.includes("mpeg") || normalized.includes("mp3")) return "audio/mpeg";
  if (normalized.includes("ogg")) return "audio/ogg";
  if (normalized.includes("webm")) return "audio/webm";
  return normalized || "audio/wav";
}
