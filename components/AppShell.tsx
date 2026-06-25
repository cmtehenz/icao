"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import PronunciationVaultBadge from "@/components/PronunciationVaultBadge";
import { usePronunciationVault } from "@/hooks/usePronunciationVault";
import { isNavActive, NAV_ITEMS } from "@/lib/navigation";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const vault = usePronunciationVault();

  const showVaultBadge = (href: string) => href === "/pronunciation";

  return (
    <div className="app-shell">
      <aside className="app-sidebar" aria-label="Main navigation">
        <div className="app-sidebar-brand">
          <span className="app-sidebar-logo">✈</span>
          <div>
            <strong>ICAO Delta</strong>
            <span>Helicopter trainer</span>
          </div>
        </div>
        <nav className="app-sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const active = isNavActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`app-sidebar-link ${active ? "active" : ""}`}
              >
                <span className="app-nav-icon" aria-hidden>
                  {item.icon}
                  {showVaultBadge(item.href) && (
                    <PronunciationVaultBadge count={vault.total} />
                  )}
                </span>
                <span className="app-sidebar-link-text">
                  <strong>{item.label}</strong>
                  <small>{item.description}</small>
                </span>
              </Link>
            );
          })}
        </nav>
        <p className="app-sidebar-foot">PWA · Study daily</p>
      </aside>

      <div className="app-main">
        <div className="app-content">{children}</div>
      </div>

      <nav className="app-bottom-nav" aria-label="Mobile navigation">
        {NAV_ITEMS.map((item) => {
          const active = isNavActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`app-bottom-link ${active ? "active" : ""}`}
            >
              <span className="app-bottom-icon" aria-hidden>
                {item.icon}
                {showVaultBadge(item.href) && (
                  <PronunciationVaultBadge count={vault.total} />
                )}
              </span>
              <span className="app-bottom-label">{item.shortLabel}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
