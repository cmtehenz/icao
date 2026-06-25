import { youGlishUrl } from "@/lib/youglish";

type Props = {
  word: string;
  className?: string;
  compact?: boolean;
};

export default function YouGlishLink({ word, className = "", compact = false }: Props) {
  const href = youGlishUrl(word);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`youglish-link ${compact ? "youglish-link-compact" : ""} ${className}`.trim()}
      title={`Ouvir "${word}" no YouGlish`}
    >
      {compact ? "▶ YouGlish" : "▶ Ouvir no YouGlish"}
    </a>
  );
}
