/**
 * Single continuous audio for Escutar Prova (Full Listening).
 * iOS suspends JS between clips when the screen locks — one stream keeps playing.
 *
 * Clips are decoded and merged to WAV (not naive MP3 concat) so Azure TTS and
 * original ATC files with different encodings all play correctly.
 */

import { getExamPlaylist } from "@/data/fullExams";
import { synthesizeExamMp3, type AzureVoiceRole } from "@/lib/azure/azureTts";
import { mergeClipsToWav } from "@/lib/fullExamListening/audioMerge";
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

/** Bump when stream format or Part 1 model answers change (invalidates cached exam audio). */
const STREAM_VERSION = 3;
const STREAM_META_PREFIX = `icao_escutar_stream_meta_v${STREAM_VERSION}_`;

function voiceForItem(item: ExamAudioItem): AzureVoiceRole {
  return item.speaker === "male_candidate" ? "male_candidate" : "female_examiner";
}

function streamCacheRequest(examId: FullExamId): Request {
  return new Request(
    `/__offline-exam-audio__/stream/v${STREAM_VERSION}/${examId}/full.wav`,
    { method: "GET" },
  );
}

function streamMetaKey(examId: FullExamId): string {
  return `${STREAM_META_PREFIX}${examId}`;
}

async function resolveItemBlob(item: ExamAudioItem): Promise<Blob | null> {
  if (item.type === "pause") return null;

  if (item.type === "original_audio") {
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
    const meta = JSON.parse(raw) as {
      segments: StreamSegment[];
      duration: number;
      version?: number;
    };
    if (meta.version !== STREAM_VERSION || !meta.segments?.length) return null;
    if (!blob.type.includes("wav") && blob.size > 0) {
      // Reject legacy MP3-concat blobs if any slipped through
      const head = new Uint8Array(await blob.slice(0, 4).arrayBuffer());
      const isRiff =
        head[0] === 0x52 && head[1] === 0x49 && head[2] === 0x46 && head[3] === 0x46;
      if (!isRiff) return null;
    }
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
        headers: { "Content-Type": "audio/wav", "Cache-Control": "max-age=31536000" },
      }),
    );
    localStorage.setItem(
      streamMetaKey(stream.examId),
      JSON.stringify({
        version: STREAM_VERSION,
        segments: stream.segments,
        duration: stream.duration,
      }),
    );
  } catch {
    /* quota */
  }
}

export async function invalidateContinuousStream(examId: FullExamId): Promise<void> {
  try {
    localStorage.removeItem(streamMetaKey(examId));
    // Also clear legacy v1 keys
    localStorage.removeItem(`icao_escutar_stream_meta_v1_${examId}`);
    if (typeof caches !== "undefined") {
      const cache = await caches.open(OFFLINE_AUDIO_CACHE);
      await cache.delete(streamCacheRequest(examId));
      await cache.delete(
        new Request(`/__offline-exam-audio__/stream/${examId}/full.mp3`, { method: "GET" }),
      );
    }
  } catch {
    /* ignore */
  }
}

export async function invalidateAllContinuousStreams(): Promise<void> {
  const ids: FullExamId[] = ["exam1", "exam2", "exam3", "exam4"];
  await Promise.all(ids.map((id) => invalidateContinuousStream(id)));
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
  const clips: Array<{ blob: Blob; itemIndex: number }> = [];

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

    clips.push({ blob, itemIndex });
    done += 1;
    onProgress?.({ done, total, label: item.label ?? item.type });
  }

  if (!clips.length) {
    throw new Error("Nenhum áudio para montar o stream contínuo.");
  }

  onProgress?.({ done: total, total, label: "Mesclando áudios (ATC + vozes)…" });

  const merged = await mergeClipsToWav(clips, signal);

  const stream: ContinuousStream = {
    examId,
    blob: merged.blob,
    segments: merged.segments,
    duration: merged.duration,
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
