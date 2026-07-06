export class PronunciationRecordingError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "PronunciationRecordingError";
    this.code = code;
  }
}
