"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  loadVault,
  pickWarmupWords,
  VAULT_CHANGE_EVENT,
  type VaultWord,
} from "@/lib/pronunciationVault";

const DISMISS_KEY = "icao_part2_warmup_dismissed";

type Props = {
  context?: string;
};

export default function PronunciationWarmupBanner({ context = "part2" }: Props) {
  const [words, setWords] = useState<VaultWord[]>([]);
  const [dismissed, setDismissed] = useState(false);

  const refresh = useCallback(() => {
    setWords(loadVault());
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener(VAULT_CHANGE_EVENT, refresh);
    return () => window.removeEventListener(VAULT_CHANGE_EVENT, refresh);
  }, [refresh]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setDismissed(sessionStorage.getItem(DISMISS_KEY) === context);
  }, [context]);

  const warmupWords = useMemo(() => pickWarmupWords(words, 3), [words]);

  if (dismissed || !warmupWords.length) return null;

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, context);
    setDismissed(true);
  };

  return (
    <section className="pronunciation-warmup-banner" aria-label="Warm-up de pronúncia">
      <div>
        <strong>Warm-up — 2 min antes de gravar</strong>
        <p>
          Pronúncia fraca distorce o Azure. Treine estas palavras primeiro ({warmupWords.length}):
        </p>
        <ul className="pronunciation-warmup-words">
          {warmupWords.map((w) => (
            <li key={w.word}>
              <Link href={`/pronunciation?word=${encodeURIComponent(w.word)}`}>
                {w.word}
              </Link>
              <span>{w.lastAccuracy}%</span>
            </li>
          ))}
        </ul>
      </div>
      <button type="button" className="btn secondary btn-sm" onClick={dismiss}>
        Já treinei →
      </button>
    </section>
  );
}
