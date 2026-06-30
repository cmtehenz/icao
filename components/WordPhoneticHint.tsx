import { getPhoneticHint } from "@/lib/wordPhoneticHint";

type Props = {
  word: string;
  className?: string;
};

/** Muted phonetic hint beside an English word (e.g. passing → pé-sing). */
export default function WordPhoneticHint({ word, className }: Props) {
  const hint = getPhoneticHint(word);
  if (!hint) return null;

  return (
    <span
      className={className ? `word-phonetic-hint ${className}` : "word-phonetic-hint"}
      title="Como pronunciar (aproximação para brasileiros)"
    >
      {" /* "}
      {hint}
      {" */"}
    </span>
  );
}
