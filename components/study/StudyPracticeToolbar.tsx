"use client";

import { useEffect, useRef, useState } from "react";

export type PracticePhase = "full" | "keywords" | "answer";

type Props = {
  phase: PracticePhase;
  showKeywords: boolean;
  speaking: boolean;
  onPrimary: () => void;
  onToggleKeywordsVisible: () => void;
  onResetPractice: () => void;
};

export default function StudyPracticeToolbar({
  phase,
  showKeywords,
  speaking,
  onPrimary,
  onToggleKeywordsVisible,
  onResetPractice,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [menuOpen]);

  const primaryLabel =
    phase === "full"
      ? "Praticar"
      : phase === "keywords"
        ? "Revelar resposta PEEL"
        : speaking
          ? "Parar áudio"
          : "Ouvir modelo";

  return (
    <div className="study-practice-toolbar">
      <button type="button" className="btn purple btn-large study-practice-primary" onClick={onPrimary}>
        {primaryLabel}
      </button>

      <div className="study-practice-menu-wrap" ref={menuRef}>
        <button
          type="button"
          className="btn secondary icon-btn study-practice-menu-btn"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-label="Mais opções de estudo"
        >
          ⋯
        </button>
        {menuOpen && (
          <div className="study-practice-menu" role="menu">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                onToggleKeywordsVisible();
                setMenuOpen(false);
              }}
            >
              {showKeywords ? "Esconder keywords" : "Mostrar keywords"}
            </button>
            {phase !== "full" && (
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  onResetPractice();
                  setMenuOpen(false);
                }}
              >
                Reiniciar prática
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
