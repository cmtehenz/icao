"use client";

import Link from "next/link";

/** Shown when the student is not signed in — Captain is unavailable, not broken. */
export default function CaptainDeltaAuthHint() {
  return (
    <aside className="cd-auth-hint" aria-label="Captain Delta requires sign-in">
      <span className="cd-auth-hint-icon" aria-hidden>
        👨‍✈️
      </span>
      <div className="cd-auth-hint-copy">
        <strong>Captain Delta</strong>
        <p>Sign in to get coaching, voice tips, and mission guidance.</p>
        <Link href="/login" className="btn secondary btn-sm">
          Sign in
        </Link>
      </div>
    </aside>
  );
}
