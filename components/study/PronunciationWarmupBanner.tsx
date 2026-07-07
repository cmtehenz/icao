"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  isWarmupSatisfiedToday,
  part2WarmupMessage,
  PART2_WARMUP_CHANGE_EVENT,
  warmupWords,
} from "@/lib/part2Warmup";
import { pronunciationMissionLink } from "@/lib/pronunciationDailyMission";
import { VAULT_CHANGE_EVENT, VAULT_PASS_SCORE } from "@/lib/pronunciationVault";

export default function PronunciationWarmupBanner() {
  const [required, setRequired] = useState(false);
  const [satisfied, setSatisfied] = useState(true);
  const [words, setWords] = useState(warmupWords(3));

  const refresh = useCallback(() => {
    const list = warmupWords(3);
    setWords(list);
    setSatisfied(isWarmupSatisfiedToday());
    setRequired(list.length > 0 && !isWarmupSatisfiedToday());
  }, []);

  useEffect(() => {
    refresh();
    const events = [PART2_WARMUP_CHANGE_EVENT, VAULT_CHANGE_EVENT];
    for (const ev of events) window.addEventListener(ev, refresh);
    return () => {
      for (const ev of events) window.removeEventListener(ev, refresh);
    };
  }, [refresh]);

  const message = useMemo(() => part2WarmupMessage(), [required, satisfied, words]);

  if (!required || satisfied || !words.length) return null;

  return (
    <section className="pronunciation-warmup-banner mandatory" aria-label="Warm-up obrigatório">
      <div>
        <strong>Warm-up obrigatório antes de gravar</strong>
        <p>{message || `Treine ao menos uma palavra (≥${VAULT_PASS_SCORE}%) antes de gravar no Part 2.`}</p>
        <ul className="pronunciation-warmup-words">
          {words.map((w) => (
            <li key={w.word}>
              <Link href={pronunciationMissionLink(w.word)}>
                {w.word}
              </Link>
              <span>{w.lastAccuracy}%</span>
            </li>
          ))}
        </ul>
      </div>
      <Link href="/word-mission" className="btn green btn-sm">
        Ir treinar →
      </Link>
    </section>
  );
}
