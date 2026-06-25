import { get, put } from "@vercel/blob";
import fs from "fs/promises";
import path from "path";

const RECORDINGS_DIR =
  process.env.RECORDINGS_DIR ?? path.join(process.cwd(), "data", "recordings");

const BLOB_PREFIX = "recordings";

export function isBlobStorageEnabled(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

export function isBlobAudioKey(audioKey: string): boolean {
  return audioKey.startsWith("https://");
}

export function mimeTypeForKey(audioKey: string): string {
  if (audioKey.endsWith(".ogg")) return "audio/ogg";
  if (audioKey.endsWith(".mp4")) return "audio/mp4";
  return "audio/webm";
}

export function extensionForMime(mimeType: string): string {
  if (mimeType.includes("ogg")) return "ogg";
  if (mimeType.includes("mp4")) return "mp4";
  return "webm";
}

function localRecordingPath(audioKey: string): string {
  if (audioKey.includes("..") || path.isAbsolute(audioKey) || isBlobAudioKey(audioKey)) {
    throw new Error("Invalid audio key");
  }
  const full = path.resolve(RECORDINGS_DIR, audioKey);
  const root = path.resolve(RECORDINGS_DIR);
  if (!full.startsWith(root + path.sep) && full !== root) {
    throw new Error("Invalid audio key");
  }
  return full;
}

function blobPathname(userId: string, evaluationId: string, ext: string): string {
  return `${BLOB_PREFIX}/${userId}/${evaluationId}.${ext}`;
}

async function saveRecordingToBlob(
  userId: string,
  evaluationId: string,
  buffer: Buffer,
  mimeType: string,
): Promise<string> {
  const ext = extensionForMime(mimeType);
  const pathname = blobPathname(userId, evaluationId, ext);
  const result = await put(pathname, buffer, {
    access: "private",
    contentType: mimeType,
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  return result.url;
}

async function saveRecordingToDisk(
  userId: string,
  evaluationId: string,
  buffer: Buffer,
  mimeType: string,
): Promise<string> {
  const ext = extensionForMime(mimeType);
  const audioKey = `${userId}/${evaluationId}.${ext}`;
  const fullPath = localRecordingPath(audioKey);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, buffer);
  return audioKey;
}

export async function saveRecording(
  userId: string,
  evaluationId: string,
  buffer: Buffer,
  mimeType: string,
): Promise<string> {
  if (isBlobStorageEnabled()) {
    return saveRecordingToBlob(userId, evaluationId, buffer, mimeType);
  }
  return saveRecordingToDisk(userId, evaluationId, buffer, mimeType);
}

export type RecordingBody =
  | { kind: "stream"; stream: ReadableStream<Uint8Array>; mimeType: string }
  | { kind: "buffer"; buffer: Buffer; mimeType: string };

async function readRecordingFromBlob(audioKey: string): Promise<RecordingBody | null> {
  const result = await get(audioKey, { access: "private" });
  if (!result || result.statusCode !== 200 || !result.stream) {
    return null;
  }
  return {
    kind: "stream",
    stream: result.stream,
    mimeType: result.blob.contentType || mimeTypeForKey(audioKey),
  };
}

async function readRecordingFromDisk(audioKey: string): Promise<RecordingBody | null> {
  try {
    const buffer = await fs.readFile(localRecordingPath(audioKey));
    return { kind: "buffer", buffer, mimeType: mimeTypeForKey(audioKey) };
  } catch {
    return null;
  }
}

export async function readRecording(audioKey: string): Promise<RecordingBody | null> {
  if (isBlobAudioKey(audioKey)) {
    return readRecordingFromBlob(audioKey);
  }
  return readRecordingFromDisk(audioKey);
}

/** @deprecated use readRecording — kept for compatibility */
export async function readRecordingBuffer(
  audioKey: string,
): Promise<{ buffer: Buffer; mimeType: string } | null> {
  const body = await readRecording(audioKey);
  if (!body) return null;
  if (body.kind === "buffer") {
    return { buffer: body.buffer, mimeType: body.mimeType };
  }
  const chunks: Uint8Array[] = [];
  const reader = body.stream.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }
  return { buffer: Buffer.concat(chunks), mimeType: body.mimeType };
}

export function recordingStorageMode(): "blob" | "local" {
  return isBlobStorageEnabled() ? "blob" : "local";
}
