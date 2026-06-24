import { Fragment, type ReactNode } from "react";

export const CONNECTOR_PHRASES = [
  "From my point of view",
  "From my experience",
  "In my opinion",
  "One of the main reasons is",
  "First of all",
  "In addition",
  "Additionally",
  "For example",
  "As a result",
  "Therefore",
  "Finally",
  "Overall",
  "Also",
] as const;

const SORTED = [...CONNECTOR_PHRASES].sort((a, b) => b.length - a.length);

type Segment = { text: string; connector: boolean };

function splitByConnectors(text: string): Segment[] {
  const segments: Segment[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    let matched: { phrase: string; index: number } | null = null;
    const lower = remaining.toLowerCase();

    for (const phrase of SORTED) {
      const idx = lower.indexOf(phrase.toLowerCase());
      if (idx !== -1 && (matched === null || idx < matched.index)) {
        matched = { phrase, index: idx };
      }
    }

    if (!matched) {
      segments.push({ text: remaining, connector: false });
      break;
    }

    if (matched.index > 0) {
      segments.push({ text: remaining.slice(0, matched.index), connector: false });
    }

    const len = matched.phrase.length;
    segments.push({
      text: remaining.slice(matched.index, matched.index + len),
      connector: true,
    });
    remaining = remaining.slice(matched.index + len);
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
