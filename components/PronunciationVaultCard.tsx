"use client";

import Link from "next/link";
import { usePronunciationVault } from "@/hooks/usePronunciationVault";

export default function PronunciationVaultCard() {
  const { total, critical, needsPractice, href } = usePronunciationVault();

  return (
    <Link href={href} className="pronunciation-vault-card">
      <span className="pronunciation-vault-icon" aria-hidden>
        🎤
      </span>
      <div className="pronunciation-vault-body">
        <strong>Banco de pronúncia</strong>
        {total > 0 ? (
          <span>
            {total} palavra{total > 1 ? "s" : ""} salva{total > 1 ? "s" : ""}
            {critical > 0 ? ` · ${critical} crítica${critical > 1 ? "s" : ""}` : ""}
            {needsPractice > critical ? ` · ${needsPractice - critical} para revisar` : ""}
          </span>
        ) : (
          <span>Grave no Voice Coach ou adicione palavras manualmente no banco de pronúncia</span>
        )}
      </div>
      <span className="pronunciation-vault-cta">{total > 0 ? "Treinar →" : "Ver →"}</span>
    </Link>
  );
}
