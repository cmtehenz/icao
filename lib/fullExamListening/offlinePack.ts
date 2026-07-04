/**
 * Offline packs for Escutar Prova — Azure neural MP3s + original ATC tracks.
 * Same voices as online; no device speechSynthesis fallback.
 */

import { getExamPlaylist } from "@/data/fullExams";
import { synthesizeExamMp3, type AzureVoiceRole } from "@/lib/azure/azureTts";
import type { ExamAudioItem, FullExamId } from "./types";

export const OFFLINE_AUDIO_CACHE = "icao-escutar-prova-audio-v1";
const META_KEY = "icao_escutar_prova_offline_v1";
export const OFFLINE_CHANGE_EVENT = "icao-escutar-prova-offline-change";

export type ExamOfflineStatus = {
  ready: boolean;
  itemCount: number;
  downloadedAt: string | null;
};

type OfflineMeta = {
  exams: Partial<Record<FullExamId, ExamOfflineStatus>>;
};

export type DownloadProgress = {
  done: number;
  total: number;
  label: string;
};

function emptyStatus(): ExamOfflineStatus {
  return { ready: false, itemCount: 0, downloadedAt: null };
}

function loadMeta(): OfflineMeta {
  if (typeof window === "undefined") return { exams: {} };
  try {
    const raw = localStorage.getItem(META_KEY);
    if (!raw) return { exams: {} };
    return { exams: {}, ...JSON.parse(raw) } as OfflineMeta;
  } catch {
    return { exams: {} };
  }
}

function saveMeta(meta: OfflineMeta): void {
  localStorage.setItem(META_KEY, JSON.stringify(meta));
  window.dispatchEvent(new Event(OFFLINE_CHANGE_EVENT));
}

export function getExamOfflineStatus(examId: FullExamId): ExamOfflineStatus {
  return loadMeta().exams[examId] ?? emptyStatus();
}

export function listOfflineReadyExams(): FullExamId[] {
  const meta = loadMeta();
  return (Object.keys(meta.exams) as FullExamId[]).filter((id) => meta.exams[id]?.ready);
}

function hashKey(input: string): string {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `${(h >>> 0).toString(16)}-${input.length}`;
}

/** Stable cache URL for a TTS clip (Azure MP3). */
export function ttsCacheRequest(role: AzureVoiceRole, text: string): Request {
  const key = hashKey(`${role}\n${text.trim()}`);
  return new Request(`/__offline-exam-audio__/tts/${role}/${key}.mp3`, { method: "GET" });
}

function atcCacheRequest(src: string): Request {
  return new Request(src, { method: "GET" });
}

async function openCache(): Promise<Cache> {
  return caches.open(OFFLINE_AUDIO_CACHE);
}

export async function getCachedTtsBlob(
  role: AzureVoiceRole,
  text: string,
): Promise<Blob | null> {
  const trimmed = text.trim();
  if (!trimmed || typeof caches === "undefined") return null;
  try {
    const cache = await openCache();
    const hit = await cache.match(ttsCacheRequest(role, trimmed));
    if (!hit?.ok) return null;
    return hit.blob();
  } catch {
    return null;
  }
}

export async function putCachedTtsBlob(
  role: AzureVoiceRole,
  text: string,
  blob: Blob,
): Promise<void> {
  const trimmed = text.trim();
  if (!trimmed || !blob.size || typeof caches === "undefined") return;
  try {
    const cache = await openCache();
    await cache.put(
      ttsCacheRequest(role, trimmed),
      new Response(blob, {
        headers: { "Content-Type": "audio/mpeg", "Cache-Control": "max-age=31536000" },
      }),
    );
  } catch {
    /* quota / private mode */
  }
}

export async function getCachedAtcBlob(src: string): Promise<Blob | null> {
  if (!src || typeof caches === "undefined") return null;
  try {
    const cache = await openCache();
    const hit = await cache.match(atcCacheRequest(src));
    if (!hit?.ok) return null;
    return hit.blob();
  } catch {
    return null;
  }
}

export async function putCachedAtcFromResponse(src: string, response: Response): Promise<void> {
  if (!src || !response.ok || typeof caches === "undefined") return;
  try {
    const cache = await openCache();
    await cache.put(atcCacheRequest(src), response.clone());
  } catch {
    /* ignore */
  }
}

function voiceForItem(item: ExamAudioItem): AzureVoiceRole {
  return item.speaker === "male_candidate" ? "male_candidate" : "female_examiner";
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Unique TTS texts + ATC URLs to download for one exam. */
export function collectPackJobs(examId: FullExamId): Array<
  | { kind: "tts"; role: AzureVoiceRole; text: string; label: string }
  | { kind: "atc"; src: string; label: string }
> {
  const items = getExamPlaylist(examId);
  const jobs: Array<
    | { kind: "tts"; role: AzureVoiceRole; text: string; label: string }
    | { kind: "atc"; src: string; label: string }
  > = [];
  const seenTts = new Set<string>();
  const seenAtc = new Set<string>();

  const addTts = (role: AzureVoiceRole, text: string, label: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const key = `${role}\n${trimmed}`;
    if (seenTts.has(key)) return;
    seenTts.add(key);
    jobs.push({ kind: "tts", role, text: trimmed, label });
  };

  for (const item of items) {
    if (item.type === "pause") continue;

    if (item.type === "original_audio" && item.audioSrc) {
      if (!seenAtc.has(item.audioSrc)) {
        seenAtc.add(item.audioSrc);
        jobs.push({
          kind: "atc",
          src: item.audioSrc,
          label: item.label ?? "ATC audio",
        });
      }
      continue;
    }

    if (!item.text?.trim()) continue;
    const role = voiceForItem(item);
    addTts(role, item.text, item.label ?? item.type);

    if (item.type === "model_answer") {
      for (const sentence of splitSentences(item.text)) {
        addTts("male_candidate", sentence, `${item.label ?? "Model"} (sentence)`);
      }
    }
  }

  return jobs;
}

export async function isExamPackReady(examId: FullExamId): Promise<boolean> {
  const status = getExamOfflineStatus(examId);
  if (!status.ready) return false;

  const jobs = collectPackJobs(examId);
  if (!jobs.length) return false;

  for (const job of jobs) {
    if (job.kind === "tts") {
      const blob = await getCachedTtsBlob(job.role, job.text);
      if (!blob) return false;
    } else {
      const blob = await getCachedAtcBlob(job.src);
      if (!blob) return false;
    }
  }
  return true;
}

export async function downloadExamPack(
  examId: FullExamId,
  onProgress?: (p: DownloadProgress) => void,
  signal?: AbortSignal,
): Promise<void> {
  const jobs = collectPackJobs(examId);
  const total = jobs.length;
  let done = 0;

  const report = (label: string) => {
    onProgress?.({ done, total, label });
  };

  report("Preparando…");

  for (const job of jobs) {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

    if (job.kind === "atc") {
      report(job.label);
      const existing = await getCachedAtcBlob(job.src);
      if (!existing) {
        const res = await fetch(job.src, { credentials: "same-origin" });
        if (!res.ok) {
          throw new Error(`Falha ao baixar áudio ATC: ${job.label}`);
        }
        await putCachedAtcFromResponse(job.src, res);
      }
    } else {
      report(job.label);
      const existing = await getCachedTtsBlob(job.role, job.text);
      if (!existing) {
        const blob = await synthesizeExamMp3(job.text, job.role);
        if (!blob) {
          throw new Error(
            "Falha ao gerar voz Azure. Verifique a conexão e as chaves do servidor.",
          );
        }
        await putCachedTtsBlob(job.role, job.text, blob);
      }
    }

    done += 1;
    report(job.label);
  }

  const meta = loadMeta();
  meta.exams[examId] = {
    ready: true,
    itemCount: total,
    downloadedAt: new Date().toISOString(),
  };
  saveMeta(meta);
}

export async function deleteExamPack(examId: FullExamId): Promise<void> {
  const meta = loadMeta();
  const otherReady = (Object.keys(meta.exams) as FullExamId[]).filter(
    (id) => id !== examId && meta.exams[id]?.ready,
  );

  const keepUrls = new Set<string>();
  for (const otherId of otherReady) {
    for (const job of collectPackJobs(otherId)) {
      if (job.kind === "tts") {
        keepUrls.add(ttsCacheRequest(job.role, job.text).url);
      } else {
        keepUrls.add(atcCacheRequest(job.src).url);
      }
    }
  }

  const jobs = collectPackJobs(examId);
  if (typeof caches !== "undefined") {
    try {
      const cache = await openCache();
      await Promise.all(
        jobs.map(async (job) => {
          if (job.kind === "tts") {
            const req = ttsCacheRequest(job.role, job.text);
            if (!keepUrls.has(req.url)) await cache.delete(req);
          } else {
            const req = atcCacheRequest(job.src);
            if (!keepUrls.has(req.url)) await cache.delete(req);
          }
        }),
      );
    } catch {
      /* ignore */
    }
  }

  delete meta.exams[examId];
  saveMeta(meta);
}
