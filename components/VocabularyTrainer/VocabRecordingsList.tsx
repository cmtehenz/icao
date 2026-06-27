"use client";

import EvaluationAudioPlayer from "@/components/EvaluationAudioPlayer";
import type { VocabSavedRecording } from "@/utils/spacedRepetition";

type Props = {
  recordings: VocabSavedRecording[];
  title?: string;
};

function formatWhen(iso: string): string {
  try {
    return new Date(iso).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function VocabRecordingsList({ recordings, title = "Suas gravações" }: Props) {
  if (!recordings.length) return null;

  return (
    <section className="vocab-recordings-list" aria-label={title}>
      <h3 className="vocab-recordings-title">{title}</h3>
      <ul className="vocab-recordings-items">
        {recordings.map((item) => (
          <li key={item.evaluationId} className="vocab-recording-item">
            <div className="vocab-recording-meta">
              <strong>L{item.level}</strong>
              <span>{item.score}%</span>
              <span className="vocab-recording-date">{formatWhen(item.recordedAt)}</span>
            </div>
            <EvaluationAudioPlayer evaluationId={item.evaluationId} />
          </li>
        ))}
      </ul>
    </section>
  );
}
