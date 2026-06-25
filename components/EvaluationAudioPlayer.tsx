"use client";

import { useEffect, useRef, useState } from "react";
import { isIosDevice } from "@/lib/recordings/platform";

type Props = {
  evaluationId: string;
  className?: string;
};

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
        if (isIosDevice() && contentType.includes("webm")) {
          setError(
            "Este áudio foi gravado em WebM, que o iPhone não reproduz. Grave novamente no app para ouvir aqui.",
          );
          return;
        }

        const blob = await res.blob();
        const type = contentType || blob.type;
        const playableBlob =
          type && !blob.type ? new Blob([blob], { type }) : blob;
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
      src={src}
      onError={() =>
        setError("Não foi possível reproduzir o áudio neste dispositivo.")
      }
    />
  );
}
