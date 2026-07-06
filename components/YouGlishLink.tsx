import { youGlishUrl } from "@/lib/youglish";

type Props = {
  word: string;
  className?: string;
  compact?: boolean;
  label?: string;
};

export default function YouGlishLink({
  word,
  className = "",
  compact = false,
  label,
}: Props) {
  const href = youGlishUrl(word);
  const text =
    label ?? (compact ? "▶ YouGlish" : "▶ Ouvir no YouGlish");
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`youglish-link ${compact ? "youglish-link-compact" : ""} ${className}`.trim()}
      title={`Ouvir "${word}" no YouGlish`}
    >
      {text}
    </a>
  );
}
