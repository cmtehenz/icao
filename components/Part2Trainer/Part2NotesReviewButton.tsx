"use client";

import { useState } from "react";
import RecommendedNotesReview from "@/components/Part2Trainer/RecommendedNotesReview";
import type { RecommendedNotes } from "@/lib/exams/types";

type Props = {
  studentNotes: string;
  recommendedNotes?: RecommendedNotes;
  situationTitle: string;
};

export default function Part2NotesReviewButton({
  studentNotes,
  recommendedNotes,
  situationTitle,
}: Props) {
  const [open, setOpen] = useState(false);

  if (!recommendedNotes) return null;

  return (
    <>
      <button type="button" className="btn secondary btn-sm" onClick={() => setOpen(true)}>
        Comparar notas →
      </button>
      <RecommendedNotesReview
        open={open}
        studentNotes={studentNotes}
        recommendedNotes={recommendedNotes}
        situationTitle={situationTitle}
        onContinue={() => setOpen(false)}
      />
    </>
  );
}
