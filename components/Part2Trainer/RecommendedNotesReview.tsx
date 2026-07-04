"use client";

import type { RecommendedNotes } from "@/lib/exams/types";
import { checkStudentNotes } from "@/utils/checkNotes";

type Props = {
  open: boolean;
  studentNotes: string;
  recommendedNotes: RecommendedNotes;
  situationTitle?: string;
  onContinue: () => void;
};

function scoreClass(score: string): string {
  if (score === "Excellent") return "quick-notes-score-excellent";
  if (score === "Good") return "quick-notes-score-good";
  return "quick-notes-score-review";
}

export default function RecommendedNotesReview({
  open,
  studentNotes,
  recommendedNotes,
  situationTitle,
  onContinue,
}: Props) {
  if (!open) return null;

  const result = checkStudentNotes(studentNotes, recommendedNotes);
  const displayStudent = studentNotes.trim() || "(no notes written)";

  return (
    <div className="modal-backdrop" role="presentation">
      <div
        className="modal modal-wide recommended-notes-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="recommended-notes-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="recommended-notes-title">Recommended Notes</h2>
        {situationTitle && <p className="modal-sub">{situationTitle}</p>}

        <div className={`recommended-notes-score ${scoreClass(result.score)}`}>
          <span className="recommended-notes-score-label">Note Score</span>
          <strong>{result.score}</strong>
        </div>

        <div className="recommended-notes-grid">
          <section className="recommended-notes-card">
            <h3>A) Student Notes</h3>
            <pre className="recommended-notes-content">{displayStudent}</pre>
          </section>

          <section className="recommended-notes-card recommended-notes-card-ideal">
            <h3>B) Recommended Notes</h3>
            <pre className="recommended-notes-content">
              {recommendedNotes.idealNotes.join("\n")}
            </pre>
          </section>

          <section className="recommended-notes-card recommended-notes-card-missing">
            <h3>C) Missing Information</h3>
            {result.missingCodes.length === 0 ? (
              <p className="recommended-notes-empty">None — great job!</p>
            ) : (
              <ul className="recommended-notes-list">
                {result.missingCodes.map((code) => (
                  <li key={code}>{code}</li>
                ))}
              </ul>
            )}
          </section>

          <section className="recommended-notes-card recommended-notes-card-extra">
            <h3>D) Extra / Unnecessary Notes</h3>
            {result.extraNotes.length === 0 ? (
              <p className="recommended-notes-empty">None</p>
            ) : (
              <ul className="recommended-notes-list">
                {result.extraNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {result.matchedCodes.length > 0 && (
          <p className="recommended-notes-matched">
            Matched: {result.matchedCodes.join(", ")}
          </p>
        )}

        <div className="modal-actions">
          <button type="button" className="btn green btn-large" onClick={onContinue}>
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}
