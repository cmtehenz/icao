"use client";

import Link from "next/link";
import WordPhoneticHint from "@/components/WordPhoneticHint";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  loadVault,
  pickWarmupWords,
  VAULT_CHANGE_EVENT,
  VAULT_PASS_SCORE,
  type VaultWord,
} from "@/lib/pronunciationVault";

const DEFAULT_TOP_N = 5;

type Props = {
  limit?: number;
};

export default function VaultWeakWordsPanel({ limit = DEFAULT_TOP_N }: Props) {
  const [words, setWords] = useState<VaultWord[]>([]);

  const refresh = useCallback(() => setWords(loadVault()), []);

  useEffect(() => {
    refresh();
    window.addEventListener(VAULT_CHANGE_EVENT, refresh);
    return () => window.removeEventListener(VAULT_CHANGE_EVENT, refresh);
  }, [refresh]);

  const weak = useMemo(() => pickWarmupWords(words, limit), [words, limit]);

  if (!weak.length) {
    return (
      <section className="account-section vault-weak-panel">
        <h2>Top palavras fracas</h2>
        <p className="sub">
          Nenhuma palavra crítica no banco — ótimo! Continue treinando shadow para manter a pronúncia.
        </p>
      </section>
    );
  }

  return (
    <section className="account-section vault-weak-panel">
      <h2>Top {Math.min(weak.length, limit)} palavras fracas</h2>
      <p className="sub">
        Priorize estas antes de gravar no Part 2 (meta ≥{VAULT_PASS_SCORE}% no Azure).
      </p>
      <ol className="vault-weak-top-list">
        {weak.map((w, i) => (
          <li key={w.word} className={`vault-weak-top-item ${w.lastAccuracy < 60 ? "bad" : "warn"}`}>
            <span className="vault-weak-rank">{i + 1}</span>
            <div className="vault-weak-body">
              <Link href={`/pronunciation?word=${encodeURIComponent(w.word)}`}>
                {w.word}
                <WordPhoneticHint word={w.word} className="vault-word-phonetic" />
              </Link>
              <span className="vault-weak-scores">
                última {w.lastAccuracy}% · pior {w.lowestAccuracy}%
              </span>
              {w.context && <span className="vault-weak-context">{w.context}</span>}
            </div>
            <Link
              href={`/pronunciation?word=${encodeURIComponent(w.word)}`}
              className="btn green btn-sm"
            >
              Treinar
            </Link>
          </li>
        ))}
      </ol>
      <Link href="/pronunciation" className="btn secondary btn-sm vault-weak-all">
        Ver banco completo →
      </Link>
    </section>
  );
}
