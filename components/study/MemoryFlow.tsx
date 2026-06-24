import { Fragment } from "react";
import { parseMemoryFlow } from "@/lib/utils";

type Props = {
  memory: string;
  memoryLabels: string[];
  expanded?: boolean;
};

export default function MemoryFlow({ memory, memoryLabels, expanded = false }: Props) {
  const parts = parseMemoryFlow(memory);
  return (
    <div className="memory-flow">
      {parts.map((part, i) => (
        <Fragment key={`${part}-${i}`}>
          {i > 0 && <span className="arrow">→</span>}
          {expanded ? (
            <span className="pill-stack">
              <span className="pill pill-short">{part}</span>
              {memoryLabels[i] && <span className="pill-label">{memoryLabels[i]}</span>}
            </span>
          ) : (
            <span className="pill">{part}</span>
          )}
        </Fragment>
      ))}
    </div>
  );
}
