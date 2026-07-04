"use client";

import { useCallback, useRef } from "react";
import QuickNotesButtons from "@/components/Part2Trainer/QuickNotesButtons";

type Props = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export default function QuickNotesPad({ value, onChange, disabled }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertAtCursor = useCallback(
    (code: string) => {
      const el = textareaRef.current;
      if (!el || disabled) return;

      const start = el.selectionStart ?? value.length;
      const end = el.selectionEnd ?? value.length;
      const before = value.slice(0, start);
      const after = value.slice(end);
      const prefix = before.length > 0 && !before.endsWith("\n") ? "\n" : "";
      const insertion = `${prefix}${code}`;

      const next = `${before}${insertion}${after}`;
      onChange(next);

      requestAnimationFrame(() => {
        const pos = start + insertion.length;
        el.focus();
        el.setSelectionRange(pos, pos);
      });
    },
    [value, onChange, disabled],
  );

  return (
    <aside className="quick-notes-pad">
      <div className="quick-notes-pad-head">
        <h3>ICAO Quick Notes</h3>
        <p className="quick-notes-hint">Rascunho — não salva após a situação</p>
      </div>

      <textarea
        ref={textareaRef}
        className="quick-notes-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Anote códigos ou digite livremente…"
        rows={4}
        spellCheck={false}
        autoComplete="off"
        aria-label="ICAO quick notes scratchpad"
      />

      <QuickNotesButtons onInsert={insertAtCursor} disabled={disabled} />
    </aside>
  );
}
