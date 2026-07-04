"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import CaptainDeltaFloatingAssistant from "@/components/CaptainDelta/CaptainDeltaFloatingAssistant";
import { CaptainDeltaProvider } from "@/components/CaptainDelta/CaptainDeltaProvider";
import PronunciationVaultBadge from "@/components/PronunciationVaultBadge";
import StudyActivityToast from "@/components/study/StudyActivityToast";
import { StudyGoalBar } from "@/components/study/StudyGoalBar";
import { usePronunciationVault } from "@/hooks/usePronunciationVault";
import { isNavActive, NAV_ITEMS } from "@/lib/navigation";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const vault = usePronunciationVault();
  const { user, loading, logout } = useAuth();

  const isLoginPage = pathname === "/login";
  const showVaultBadge = (href: string) => href === "/pronunciation";

  if (isLoginPage) {
    return <div className="auth-shell">{children}</div>;
  }

  if (loading) {
    return (
      <div className="auth-shell auth-loading">
        <p>Carregando…</p>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push("/login");
    router.refresh();
  };

  return (
    <CaptainDeltaProvider>
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
        {user && (
          <div className="app-sidebar-account">
            <Link href="/conta" className="app-sidebar-user">
              <span>👤</span>
              <span>{user.name || user.email.split("@")[0]}</span>
            </Link>
            <button type="button" className="app-sidebar-logout" onClick={handleLogout}>
              Sair
            </button>
          </div>
        )}
        <p className="app-sidebar-foot">PWA · Study daily</p>
      </aside>

      <div className="app-main">
        <div className="app-content">{children}</div>
      </div>

      <StudyGoalBar />
      <StudyActivityToast />
      {user && <CaptainDeltaFloatingAssistant />}

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
    </CaptainDeltaProvider>
  );
}
