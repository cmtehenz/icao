export function isIosDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return (
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

/** iOS grava e reproduz melhor em MP4/AAC; WebM costuma falhar no player nativo. */
export function prefersMp4Recording(): boolean {
  return isIosDevice();
}

export function recordingMimeCandidates(): string[] {
  if (prefersMp4Recording()) {
    return [
      "audio/mp4",
      "audio/aac",
      "video/mp4",
      "audio/webm;codecs=opus",
      "audio/webm",
    ];
  }
  return [
    "audio/webm;codecs=opus",
    "audio/webm",
    "video/webm;codecs=opus",
    "video/webm",
    "audio/mp4",
  ];
}

export function preferredRecorderMime(): string | undefined {
  if (typeof MediaRecorder === "undefined") return undefined;
  for (const mime of recordingMimeCandidates()) {
    if (MediaRecorder.isTypeSupported(mime)) return mime;
  }
  return undefined;
}
