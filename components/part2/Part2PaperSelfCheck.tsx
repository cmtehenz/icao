"use client";

import type { RecommendedNotes } from "@/lib/exams/types";

type Props = {
  open: boolean;
  recommendedNotes: RecommendedNotes;
  situationTitle?: string;
  onContinue: () => void;
};

export default function Part2PaperSelfCheck({
  open,
  recommendedNotes,
  situationTitle,
  onContinue,
}: Props) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" role="presentation">
      <div
        className="modal modal-wide recommended-notes-modal part2-paper-self-check"
        role="dialog"
        aria-modal="true"
        aria-labelledby="paper-self-check-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="paper-self-check-title">Check your paper notes</h2>
        {situationTitle && <p className="modal-sub">{situationTitle}</p>}
        <p className="modal-sub">
          Compare what you wrote on paper with the ideal shorthand for this situation. Missing a code?
          Note it for next time — no typing required.
        </p>

        <section className="recommended-notes-card recommended-notes-card-ideal">
          <h3>Ideal notes (reference)</h3>
          <pre className="recommended-notes-content">{recommendedNotes.idealNotes.join("\n")}</pre>
        </section>

        {recommendedNotes.requiredCodes.length > 0 && (
          <section className="part2-paper-self-check-required">
            <h3>Must-have codes</h3>
            <ul className="part2-paper-notes-codes part2-paper-notes-codes-inline">
              {recommendedNotes.requiredCodes.map((code) => (
                <li key={code}>{code}</li>
              ))}
            </ul>
          </section>
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
