"use client";

import Link from "next/link";
import { usePronunciationVault } from "@/hooks/usePronunciationVault";

/** Alerta compacto — só quando há palavras críticas ou para revisar. */
export default function PronunciationVaultAlert() {
  const { total, critical, needsPractice, href } = usePronunciationVault();

  if (total === 0 || (critical === 0 && needsPractice === 0)) return null;

  const label =
    critical > 0
      ? `${critical} palavra${critical > 1 ? "s" : ""} crítica${critical > 1 ? "s" : ""} no banco`
      : `${needsPractice} para revisar`;

  return (
    <Link href={href} className="pronunciation-vault-alert">
      <span className="pronunciation-vault-alert-icon" aria-hidden>
        🎤
      </span>
      <span className="pronunciation-vault-alert-text">{label}</span>
      <span className="pronunciation-vault-alert-cta">Treinar →</span>
    </Link>
  );
}
