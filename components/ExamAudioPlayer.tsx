"use client";

type Props = {
  src: string;
  label?: string;
  autoPlay?: boolean;
  onEnded?: () => void;
};

export default function ExamAudioPlayer({ src, label = "Ouvir áudio da prova", autoPlay, onEnded }: Props) {
  if (!src) {
    return (
      <p className="exam-audio-missing">
        Áudio não encontrado. Execute <code>npm run setup:audio</code>.
      </p>
    );
  }

  return (
    <div className="exam-audio-player">
      <audio
        key={src}
        controls
        preload="metadata"
        autoPlay={autoPlay}
        src={src}
        className="exam-audio"
        onEnded={onEnded}
      >
        Seu navegador não suporta áudio.
      </audio>
      <span className="exam-audio-label">{label}</span>
    </div>
  );
}
