export function isIosDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return (
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

/**
 * Prefer MP4/AAC when available (iOS). Elsewhere Chrome usually only supports WebM;
 * we convert WebM → WAV before upload so iPhone can play later.
 */
export function recordingMimeCandidates(): string[] {
  if (isIosDevice()) {
    return [
      "audio/mp4",
      "audio/aac",
      "video/mp4",
      "audio/webm;codecs=opus",
      "audio/webm",
    ];
  }
  return [
    "audio/mp4",
    "audio/aac",
    "audio/webm;codecs=opus",
    "audio/webm",
    "video/webm;codecs=opus",
    "video/webm",
  ];
}

export function preferredRecorderMime(): string | undefined {
  if (typeof MediaRecorder === "undefined") return undefined;
  for (const mime of recordingMimeCandidates()) {
    if (MediaRecorder.isTypeSupported(mime)) return mime;
  }
  return undefined;
}
