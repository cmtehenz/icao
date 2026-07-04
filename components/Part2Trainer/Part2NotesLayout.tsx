"use client";

import QuickNotesPad from "@/components/Part2Trainer/QuickNotesPad";

type Props = {
  notes: string;
  onNotesChange: (value: string) => void;
  children: React.ReactNode;
};

export default function Part2NotesLayout({ notes, onNotesChange, children }: Props) {
  return (
    <div className="part2-sim-layout">
      <div className="part2-sim-main">{children}</div>
      <QuickNotesPad value={notes} onChange={onNotesChange} />
    </div>
  );
}
