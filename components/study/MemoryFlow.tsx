import { Fragment } from "react";
import { parseMemoryFlow } from "@/lib/utils";

type Props = {
  memory: string;
  memoryLabels: string[];
  memoryIcons?: string[];
  expanded?: boolean;
};

export default function MemoryFlow({ memory, memoryLabels, memoryIcons, expanded = false }: Props) {
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
          ) : memoryIcons?.[i] ? (
            <span className="pill pill-icon" title={memoryLabels[i] ?? part}>
              {memoryIcons[i]}
            </span>
          ) : (
            <span className="pill">{part}</span>
          )}
        </Fragment>
      ))}
    </div>
  );
}
