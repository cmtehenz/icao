type Props = {
  count: number;
  className?: string;
};

export default function PronunciationVaultBadge({ count, className = "" }: Props) {
  if (!count) return null;
  return (
    <span className={`app-nav-badge ${className}`.trim()} aria-label={`${count} palavras para treinar`}>
      {count > 99 ? "99+" : count}
    </span>
  );
}
