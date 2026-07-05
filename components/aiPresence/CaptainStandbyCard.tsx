"use client";

import type { CaptainStandbyCopy } from "@/lib/aiPresence/types";

type Props = {
  copy: CaptainStandbyCopy;
  onDismiss: () => void;
};

/** Shown when FAB opens without an active coaching message. */
export default function CaptainStandbyCard({ copy, onDismiss }: Props) {
  return (
    <article className="cd-coach-card cd-standby-card" aria-label="Captain Delta standby">
      <header className="cd-coach-card-head">
        <span className="cd-coach-card-badge cd-standby-badge">👨‍✈️ {copy.title}</span>
        <span className="cd-standby-pulse" aria-hidden />
      </header>
      <div className="cd-coach-card-body">
        <p className="cd-coach-line">{copy.body}</p>
        {copy.hint && <p className="cd-standby-hint">{copy.hint}</p>}
      </div>
      <button type="button" className="btn secondary btn-sm cd-standby-close" onClick={onDismiss}>
        Continue mission
      </button>
    </article>
  );
}
