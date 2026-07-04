"use client";

import CaptainDeltaTarget from "@/components/CaptainDelta/Visual/CaptainDeltaTarget";
import { keywordTargetId } from "@/lib/captainDelta/visual/types";

type Props = {
  keywords: string[];
  hidden?: boolean;
};

export default function KeywordsPanel({ keywords, hidden }: Props) {
  if (hidden) return null;
  return (
    <section className="keywords-panel">
      <h3>Keywords</h3>
      <p className="keywords-hint">Use these words to build your answer — speak out loud without reading the script.</p>
      <ul className="keywords-list keywords-list-study">
        {keywords.map((kw) => (
          <li key={kw}>
            <CaptainDeltaTarget id={keywordTargetId(kw)}>{kw}</CaptainDeltaTarget>
          </li>
        ))}
      </ul>
    </section>
  );
}
