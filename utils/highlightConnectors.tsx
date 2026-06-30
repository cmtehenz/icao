import { Fragment, type ReactNode } from "react";
import { ALL_CONNECTOR_PHRASES } from "@/lib/connectors";

type Segment = { text: string; connector: boolean };

function splitByConnectors(text: string): Segment[] {
  const segments: Segment[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    let matched: { phrase: string; index: number } | null = null;
    const lower = remaining.toLowerCase();

    for (const phrase of ALL_CONNECTOR_PHRASES) {
      const core = phrase.replace(/[,.\s]+$/, "").trim();
      const idx = lower.indexOf(core.toLowerCase());
      if (idx !== -1 && (matched === null || idx < matched.index)) {
        matched = { phrase: remaining.slice(idx, idx + core.length), index: idx };
      }
    }

    if (!matched) {
      segments.push({ text: remaining, connector: false });
      break;
    }

    if (matched.index > 0) {
      segments.push({ text: remaining.slice(0, matched.index), connector: false });
    }

    segments.push({
      text: matched.phrase,
      connector: true,
    });
    remaining = remaining.slice(matched.index + matched.phrase.length);
  }

  return segments;
}

export function highlightConnectors(text: string): ReactNode {
  const segments = splitByConnectors(text);
  return (
    <>
      {segments.map((seg, i) =>
        seg.connector ? (
          <mark key={i} className="connector-highlight">
            {seg.text}
          </mark>
        ) : (
          <Fragment key={i}>{seg.text}</Fragment>
        ),
      )}
    </>
  );
}
