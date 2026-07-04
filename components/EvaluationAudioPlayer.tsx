"use client";

import { useEffect, useRef, useState } from "react";
import { filenameForAudioBlob } from "@/lib/recordings/mime";
import { isIosDevice } from "@/lib/recordings/platform";
import { isWebmLike, toUniversalPlayableBlob } from "@/lib/recordings/toPlayableBlob";

type Props = {
  evaluationId: string;
  className?: string;
};

async function migrateToWav(evaluationId: string, wavBlob: Blob): Promise<void> {
  try {
    const form = new FormData();
    form.append("audio", wavBlob, filenameForAudioBlob(wavBlob));
    await fetch(`/api/evaluations/${evaluationId}/audio`, {
      method: "POST",
      body: form,
      credentials: "same-origin",
    });
  } catch {
    /* best-effort migration for older WebM files */
  }
}

export default function EvaluationAudioPlayer({ evaluationId, className }: Props) {
  const [src, setSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const url = `/api/evaluations/${evaluationId}/audio`;

    async function load() {
      setLoading(true);
      setError(null);
      setSrc(null);

      try {
        const res = await fetch(url, { credentials: "same-origin" });
        if (!res.ok) {
          const data = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(data.error ?? `Erro ${res.status}`);
        }

        const contentType = (res.headers.get("Content-Type") ?? "").toLowerCase();
        let blob = await res.blob();
        const type = (contentType || blob.type || "").toLowerCase();

        if (isWebmLike(type)) {
          const converted = await toUniversalPlayableBlob(
            type && !blob.type ? new Blob([blob], { type }) : blob,
          );
          if (converted.type.includes("wav")) {
            blob = converted;
            void migrateToWav(evaluationId, converted);
          } else if (isIosDevice()) {
            setError(
              "Esta gravação antiga está em WebM (não toca no iPhone). Grave de novo no app — as novas já salvam em formato compatível. Se puder, abra esta avaliação no computador uma vez para converter automaticamente.",
            );
            return;
          }
        }

        const playableBlob =
          blob.type ? blob : new Blob([blob], { type: type || "audio/wav" });
        const blobUrl = URL.createObjectURL(playableBlob);
        blobUrlRef.current = blobUrl;
        if (!cancelled) setSrc(blobUrl);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Erro ao carregar áudio.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, [evaluationId]);

  if (loading) {
    return <p className="exam-audio-missing">Carregando áudio…</p>;
  }

  if (error) {
    return <p className="exam-audio-missing">{error}</p>;
  }

  if (!src) return null;

  return (
    <audio
      className={className ?? "exam-audio evaluation-audio"}
      controls
      preload="metadata"
      playsInline
      src={src}
      onError={() =>
        setError("Não foi possível reproduzir o áudio neste dispositivo.")
      }
    />
  );
}
