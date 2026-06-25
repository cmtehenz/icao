export function normalizeRecordingMime(mimeType: string, filename: string): string {
  const mime = mimeType.trim().toLowerCase();
  const name = filename.toLowerCase();

  if (mime.startsWith("audio/")) return mime;
  if (mime === "video/webm" || name.endsWith(".webm")) return "audio/webm";
  if (mime === "application/octet-stream") {
    if (name.endsWith(".ogg")) return "audio/ogg";
    if (name.endsWith(".mp4") || name.endsWith(".m4a")) return "audio/mp4";
    return "audio/webm";
  }
  if (!mime && name.endsWith(".webm")) return "audio/webm";
  return mime || "audio/webm";
}

export function isAllowedRecordingMime(mimeType: string, filename: string): boolean {
  return normalizeRecordingMime(mimeType, filename).startsWith("audio/");
}

export function extensionForRecordingMime(mimeType: string): string {
  if (mimeType.includes("ogg")) return "ogg";
  if (mimeType.includes("mp4")) return "mp4";
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
