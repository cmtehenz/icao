/**
 * Single continuous MP3 for Escutar Prova (Full Listening).
 * iOS suspends JS between clips when the screen locks — one stream keeps playing.
 */

import { getExamPlaylist } from "@/data/fullExams";
import { synthesizeExamMp3, type AzureVoiceRole } from "@/lib/azure/azureTts";
import {
  getCachedAtcBlob,
  getCachedTtsBlob,
  putCachedAtcFromResponse,
  putCachedTtsBlob,
  OFFLINE_AUDIO_CACHE,
} from "@/lib/fullExamListening/offlinePack";
import type { ExamAudioItem, FullExamId } from "./types";

export type StreamSegment = {
  itemIndex: number;
  start: number;
  end: number;
};

export type ContinuousStream = {
  examId: FullExamId;
  blob: Blob;
  segments: StreamSegment[];
  duration: number;
};

export type StreamBuildProgress = {
  done: number;
  total: number;
  label: string;
};

const STREAM_META_PREFIX = "icao_escutar_stream_meta_v1_";

function voiceForItem(item: ExamAudioItem): AzureVoiceRole {
  return item.speaker === "male_candidate" ? "male_candidate" : "female_examiner";
}

function streamCacheRequest(examId: FullExamId): Request {
  return new Request(`/__offline-exam-audio__/stream/${examId}/full.mp3`, { method: "GET" });
}

function streamMetaKey(examId: FullExamId): string {
  return `${STREAM_META_PREFIX}${examId}`;
}

async function resolveItemBlob(item: ExamAudioItem): Promise<Blob | null> {
  if (item.type === "pause" || item.type === "original_audio") {
    if (item.type === "pause") return null;
    const src = item.audioSrc;
    if (!src) return null;
    const cached = await getCachedAtcBlob(src);
    if (cached) return cached;
    const res = await fetch(src, { credentials: "same-origin" });
    if (!res.ok) return null;
    void putCachedAtcFromResponse(src, res.clone());
    return res.blob();
  }

  const text = item.text?.trim();
  if (!text) return null;
  const role = voiceForItem(item);
  let blob = await getCachedTtsBlob(role, text);
  if (!blob) {
    blob = await synthesizeExamMp3(text, role);
    if (blob) void putCachedTtsBlob(role, text, blob);
  }
  return blob;
}

function getMp3Duration(blob: Blob): Promise<number> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(blob);
    const audio = new Audio();
    const finish = (sec: number) => {
      URL.revokeObjectURL(url);
      audio.removeAttribute("src");
      resolve(sec);
    };
    audio.preload = "metadata";
    audio.addEventListener("loadedmetadata", () => {
      const d = audio.duration;
      finish(Number.isFinite(d) && d > 0 ? d : 0);
    });
    audio.addEventListener("error", () => finish(0));
    audio.src = url;
  });
}

/** Playable playlist items for continuous Full Listening (skips pauses). */
export function continuousPlayableIndices(items: ExamAudioItem[]): number[] {
  return items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => {
      if (item.type === "pause") return false;
      if (item.type === "original_audio") return !!item.audioSrc;
      return !!item.text?.trim();
    })
    .map(({ index }) => index);
}

export async function loadCachedContinuousStream(
  examId: FullExamId,
): Promise<ContinuousStream | null> {
  if (typeof caches === "undefined") return null;
  try {
    const cache = await caches.open(OFFLINE_AUDIO_CACHE);
    const hit = await cache.match(streamCacheRequest(examId));
    if (!hit?.ok) return null;
    const blob = await hit.blob();
    const raw = localStorage.getItem(streamMetaKey(examId));
    if (!raw) return null;
    const meta = JSON.parse(raw) as { segments: StreamSegment[]; duration: number };
    if (!meta.segments?.length) return null;
    return { examId, blob, segments: meta.segments, duration: meta.duration };
  } catch {
    return null;
  }
}

async function saveContinuousStream(stream: ContinuousStream): Promise<void> {
  if (typeof caches === "undefined") return;
  try {
    const cache = await caches.open(OFFLINE_AUDIO_CACHE);
    await cache.put(
      streamCacheRequest(stream.examId),
      new Response(stream.blob, {
        headers: { "Content-Type": "audio/mpeg", "Cache-Control": "max-age=31536000" },
      }),
    );
    localStorage.setItem(
      streamMetaKey(stream.examId),
      JSON.stringify({ segments: stream.segments, duration: stream.duration }),
    );
  } catch {
    /* quota */
  }
}

export async function invalidateContinuousStream(examId: FullExamId): Promise<void> {
  try {
    localStorage.removeItem(streamMetaKey(examId));
    if (typeof caches !== "undefined") {
      const cache = await caches.open(OFFLINE_AUDIO_CACHE);
      await cache.delete(streamCacheRequest(examId));
    }
  } catch {
    /* ignore */
  }
}

export async function buildContinuousStream(
  examId: FullExamId,
  onProgress?: (p: StreamBuildProgress) => void,
  signal?: AbortSignal,
): Promise<ContinuousStream> {
  const cached = await loadCachedContinuousStream(examId);
  if (cached) return cached;

  const items = getExamPlaylist(examId);
  const indices = continuousPlayableIndices(items);
  const total = indices.length;
  const parts: Blob[] = [];
  const segments: StreamSegment[] = [];
  let cursor = 0;

  let done = 0;
  for (const itemIndex of indices) {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
    const item = items[itemIndex];
    onProgress?.({
      done,
      total,
      label: item.label ?? item.type,
    });

    const blob = await resolveItemBlob(item);
    if (!blob || blob.size === 0) {
      throw new Error(`Falha ao preparar áudio: ${item.label ?? item.id}`);
    }

    const duration = await getMp3Duration(blob);
    const start = cursor;
    const end = cursor + (duration > 0 ? duration : 0.5);
    segments.push({ itemIndex, start, end });
    cursor = end;
    parts.push(blob);
    done += 1;
    onProgress?.({ done, total, label: item.label ?? item.type });
  }

  if (!parts.length) {
    throw new Error("Nenhum áudio para montar o stream contínuo.");
  }

  const stream: ContinuousStream = {
    examId,
    blob: new Blob(parts, { type: "audio/mpeg" }),
    segments,
    duration: cursor,
  };

  await saveContinuousStream(stream);
  return stream;
}

export function segmentIndexAtTime(segments: StreamSegment[], time: number): number {
  if (!segments.length) return 0;
  for (let i = segments.length - 1; i >= 0; i--) {
    if (time >= segments[i].start - 0.05) return i;
  }
  return 0;
}

export function findSegmentForItem(
  segments: StreamSegment[],
  itemIndex: number,
): StreamSegment | null {
  return segments.find((s) => s.itemIndex === itemIndex) ?? null;
}

/** Nearest playable segment at or after itemIndex. */
export function nearestSegmentFromItem(
  segments: StreamSegment[],
  itemIndex: number,
): StreamSegment | null {
  const exact = findSegmentForItem(segments, itemIndex);
  if (exact) return exact;
  return segments.find((s) => s.itemIndex >= itemIndex) ?? segments[segments.length - 1] ?? null;
}
