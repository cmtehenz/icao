"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  onProfile: () => void;
  onConnectors: () => void;
  onPhrases: () => void;
  onPrevious: () => void;
};

export default function Part1ToolsMenu({ onProfile, onConnectors, onPhrases, onPrevious }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const pick = (fn: () => void) => {
    fn();
    setOpen(false);
  };

  return (
    <div className="part1-tools-menu" ref={ref}>
      <button
        type="button"
        className="btn secondary icon-btn"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Ferramentas"
      >
        ⋯
      </button>
      {open && (
        <div className="part1-tools-dropdown" role="menu">
          <button type="button" role="menuitem" onClick={() => pick(onPrevious)}>
            ← Anterior
          </button>
          <button type="button" role="menuitem" onClick={() => pick(onProfile)}>
            Profile
          </button>
          <button type="button" role="menuitem" onClick={() => pick(onConnectors)}>
            Connectors
          </button>
          <button type="button" role="menuitem" onClick={() => pick(onPhrases)}>
            Resumo oral
          </button>
        </div>
      )}
    </div>
  );
}
