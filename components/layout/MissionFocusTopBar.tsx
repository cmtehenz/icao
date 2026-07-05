"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

type Props = {
  /** Show link back to today's flight (mission sub-routes). */
  showFlightCta?: boolean;
};

export default function MissionFocusTopBar({ showFlightCta = false }: Props) {
  const { user } = useAuth();

  return (
    <header className="mission-focus-topbar">
      <div className="mission-focus-topbar-inner wrap">
        <Link href="/" className="mission-focus-brand">
          <span className="mission-focus-brand-icon" aria-hidden>
            ✈
          </span>
          <div className="mission-focus-brand-text">
            <strong>ICAO Delta</strong>
            <span>Captain Delta · Flight Academy</span>
          </div>
        </Link>

        <div className="mission-focus-topbar-actions">
          {showFlightCta && (
            <Link href="/" className="btn purple btn-sm mission-focus-cta">
              Today&apos;s Flight
            </Link>
          )}
          {user ? (
            <Link href="/conta" className="mission-focus-profile" title="Account settings">
              <span aria-hidden>👤</span>
              <span className="mission-focus-profile-name">
                {user.name || user.email.split("@")[0]}
              </span>
            </Link>
          ) : (
            <Link href="/login" className="btn secondary btn-sm">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
