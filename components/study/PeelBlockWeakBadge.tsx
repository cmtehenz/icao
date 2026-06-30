"use client";

import { useEffect, useState } from "react";
import type { PeelBlockId } from "@/lib/peelBlocks";
import {
  getWeakPeelBlockIds,
  peelBlockLabel,
  PEEL_BLOCK_HISTORY_EVENT,
} from "@/lib/peelBlockHistory";

type Props = {
  cardNum: string;
  compact?: boolean;
};

export default function PeelBlockWeakBadge({ cardNum, compact = false }: Props) {
  const [weak, setWeak] = useState<PeelBlockId[]>([]);

  useEffect(() => {
    const refresh = () => setWeak(getWeakPeelBlockIds(cardNum));
    refresh();
    window.addEventListener(PEEL_BLOCK_HISTORY_EVENT, refresh);
    return () => window.removeEventListener(PEEL_BLOCK_HISTORY_EVENT, refresh);
  }, [cardNum]);

  if (!weak.length) return null;

  if (compact) {
    return (
      <span className="peel-weak-badge compact" title={`Blocos fracos: ${weak.map(peelBlockLabel).join(", ")}`}>
        {weak.length} bloco{weak.length > 1 ? "s" : ""} fraco{weak.length > 1 ? "s" : ""}
      </span>
    );
  }

  return (
    <span className="peel-weak-badge">
      Fraco: {weak.slice(0, 2).map(peelBlockLabel).join(", ")}
      {weak.length > 2 ? ` +${weak.length - 2}` : ""}
    </span>
  );
}
