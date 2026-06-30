"use client";

import { useEffect, useState } from "react";
import type { PeelBlockId } from "@/lib/peelBlocks";
import {
  getWeakPeelBlockIds,
  peelBlockLabel,
  getPeelBlockHistory,
  PEEL_BLOCK_HISTORY_EVENT,
} from "@/lib/peelBlockHistory";
import { SHADOW_PEEL_PASS_SCORE } from "@/lib/studyActivityRecord";

type Props = {
  cardNum: string;
  onTrainBlock: (blockId: PeelBlockId) => void;
};

export default function PeelBlockWeakDetail({ cardNum, onTrainBlock }: Props) {
  const [weak, setWeak] = useState<PeelBlockId[]>([]);

  useEffect(() => {
    const refresh = () => setWeak(getWeakPeelBlockIds(cardNum));
    refresh();
    window.addEventListener(PEEL_BLOCK_HISTORY_EVENT, refresh);
    return () => window.removeEventListener(PEEL_BLOCK_HISTORY_EVENT, refresh);
  }, [cardNum]);

  if (!weak.length) return null;

  const history = getPeelBlockHistory(cardNum);

  return (
    <section className="peel-weak-detail" aria-label="Blocos PEEL fracos">
      <h4>Blocos PEEL para revisar</h4>
      <p className="peel-weak-detail-sub">
        Abaixo de {SHADOW_PEEL_PASS_SCORE}% no shadow — treine bloco a bloco antes da gravação livre.
      </p>
      <ul className="peel-weak-detail-list">
        {weak.map((id) => {
          const record = history[id];
          return (
            <li key={id} className="peel-weak-detail-item">
              <div>
                <strong>{peelBlockLabel(id)}</strong>
                {record && <span className="peel-weak-detail-pct">{record.lastAccuracy}%</span>}
              </div>
              <button type="button" className="btn orange btn-sm" onClick={() => onTrainBlock(id)}>
                Treinar bloco
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
