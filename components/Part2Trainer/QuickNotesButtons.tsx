"use client";

import { QUICK_NOTE_CATEGORIES } from "@/lib/part2/quickNotesCodes";

type Props = {
  onInsert: (code: string) => void;
  disabled?: boolean;
};

export default function QuickNotesButtons({ onInsert, disabled }: Props) {
  return (
    <div className="quick-notes-buttons">
      {QUICK_NOTE_CATEGORIES.map((category) => (
        <div key={category.id} className="quick-notes-group">
          <span className={`quick-notes-group-label quick-notes-color-${category.color}`}>
            {category.label}
          </span>
          <div className="quick-notes-group-btns">
            {category.codes.map((code) => (
              <button
                key={`${category.id}-${code}`}
                type="button"
                className={`quick-note-btn quick-notes-color-${category.color}`}
                disabled={disabled}
                onClick={() => onInsert(code)}
                title={code}
              >
                {code}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
