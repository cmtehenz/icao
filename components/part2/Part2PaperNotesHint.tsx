"use client";

import type { RecommendedNotes } from "@/lib/exams/types";
import { paperNotesHintForStep } from "@/lib/part2Mastery/paperNotesHint";

type Props = {
  step: number;
  recommendedNotes?: RecommendedNotes;
  /** Inside mission card (Part 1 style) vs legacy sidebar. */
  inline?: boolean;
};

export default function Part2PaperNotesHint({ step, recommendedNotes, inline = false }: Props) {
  const hint = paperNotesHintForStep(step, recommendedNotes);

  if (inline) {
    return (
      <section className="part2-paper-notes-inline" aria-label="Paper notes hint">
        <div className="part2-paper-notes-inline-head">
          <span aria-hidden>📝</span>
          <strong>Paper &amp; pen</strong>
          <span className="part2-paper-notes-kicker">Jot on paper — not on screen</span>
        </div>
        {hint.codes.length > 0 ? (
          <ol className="part2-paper-notes-codes part2-paper-notes-codes-inline-list">
            {hint.codes.map((code) => (
              <li key={code}>{code}</li>
            ))}
          </ol>
        ) : (
          <p className="sub part2-paper-notes-empty">
            Squawk, altitude, heading, frequency — your shorthand as you listen.
          </p>
        )}
      </section>
    );
  }

  return (
    <aside className="part2-paper-notes" aria-label="Paper notes hint">
      <div className="part2-paper-notes-head">
        <span className="part2-paper-notes-icon" aria-hidden>
          📝
        </span>
        <div>
          <h3>Paper &amp; pen</h3>
          <p className="part2-paper-notes-kicker">Like the real SDEA — not on screen</p>
        </div>
      </div>

      <p className="part2-paper-notes-captain">{hint.captainLine}</p>

      {hint.codes.length > 0 ? (
        <ol className="part2-paper-notes-codes">
          {hint.codes.map((code) => (
            <li key={code}>{code}</li>
          ))}
        </ol>
      ) : (
        <p className="part2-paper-notes-empty sub">
          Jot squawk, altitude, heading, frequency, problem, intention — your shorthand.
        </p>
      )}

      <p className="part2-paper-notes-reminder sub">
        Captain Delta suggests codes only. You write on paper — the app does not save your notes.
      </p>
    </aside>
  );
}
