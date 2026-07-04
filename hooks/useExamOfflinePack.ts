"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FullExamId } from "@/lib/fullExamListening/types";
import {
  deleteExamPack,
  downloadExamPack,
  getExamOfflineStatus,
  isExamPackReady,
  OFFLINE_CHANGE_EVENT,
  type DownloadProgress,
  type ExamOfflineStatus,
} from "@/lib/fullExamListening/offlinePack";

export function useExamOfflinePack(examId: FullExamId) {
  const [status, setStatus] = useState<ExamOfflineStatus>(() => getExamOfflineStatus(examId));
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState<DownloadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const refresh = useCallback(async () => {
    const meta = getExamOfflineStatus(examId);
    if (meta.ready) {
      const ok = await isExamPackReady(examId);
      if (!ok) {
        setStatus({ ready: false, itemCount: 0, downloadedAt: null });
        return;
      }
    }
    setStatus(getExamOfflineStatus(examId));
  }, [examId]);

  useEffect(() => {
    void refresh();
    const onChange = () => void refresh();
    window.addEventListener(OFFLINE_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(OFFLINE_CHANGE_EVENT, onChange);
  }, [refresh]);

  const download = useCallback(async () => {
    if (downloading) return;
    setDownloading(true);
    setError(null);
    setProgress({ done: 0, total: 0, label: "Iniciando…" });
    const ac = new AbortController();
    abortRef.current = ac;
    try {
      await downloadExamPack(examId, setProgress, ac.signal);
      await refresh();
    } catch (e) {
      if ((e as Error).name === "AbortError") {
        setError(null);
      } else {
        setError(e instanceof Error ? e.message : "Falha ao baixar a prova.");
      }
    } finally {
      abortRef.current = null;
      setDownloading(false);
      setProgress(null);
    }
  }, [downloading, examId, refresh]);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const remove = useCallback(async () => {
    await deleteExamPack(examId);
    await refresh();
  }, [examId, refresh]);

  return { status, downloading, progress, error, download, cancel, remove, refresh };
}
