"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import CaptainDeltaAuthHint from "@/components/CaptainDelta/CaptainDeltaAuthHint";
import CaptainDeltaFloatingAssistant from "@/components/CaptainDelta/CaptainDeltaFloatingAssistant";
import { CaptainDeltaProvider } from "@/components/CaptainDelta/CaptainDeltaProvider";
import CaptainDeltaVisualBridge from "@/components/CaptainDelta/Visual/CaptainDeltaVisualBridge";
import CaptainDeltaVisualMission from "@/components/CaptainDelta/Visual/CaptainDeltaVisualMission";
import { CaptainDeltaVisualProvider } from "@/components/CaptainDelta/Visual/CaptainDeltaVisualProvider";
import CaptainDeltaMemoryBridge from "@/components/CaptainDelta/Memory/CaptainDeltaMemoryBridge";
import { CaptainDeltaExaminerProvider } from "@/components/CaptainDelta/Examiner/CaptainDeltaExaminerProvider";
import CaptainDeltaExaminerBridge from "@/components/CaptainDelta/Examiner/CaptainDeltaExaminerBridge";
import CaptainDeltaRoleIndicator from "@/components/CaptainDelta/Examiner/CaptainDeltaRoleIndicator";
import AcademySessionBridge from "@/components/academy/AcademySessionBridge";
import MissionFlowCaptainBridge from "@/components/CaptainDelta/MissionFlowCaptainBridge";
import PronunciationVaultBadge from "@/components/PronunciationVaultBadge";
import StudyActivityToast from "@/components/study/StudyActivityToast";
import { StudyGoalBar } from "@/components/study/StudyGoalBar";
import MissionFocusLayout from "@/components/layout/MissionFocusLayout";
import { AIPresenceProvider } from "@/components/aiPresence/AIPresenceProvider";
import { usePronunciationVault } from "@/hooks/usePronunciationVault";
import { isMissionFocusRoute } from "@/lib/missionFocusRoutes";
import { isNavActive, NAV_ITEMS } from "@/lib/navigation";

function LegacyAppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const vault = usePronunciationVault();
  const { user, logout } = useAuth();

  const showVaultBadge = (href: string) => href === "/word-mission";

  const handleLogout = async () => {
    await logout();
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      <div className="app-layout">
        <aside className="app-sidebar" aria-label="Main navigation">
          <div className="app-sidebar-brand">
            <span className="app-sidebar-logo">✈</span>
            <div>
              <strong>ICAO Delta</strong>
              <span>Flight Academy</span>
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

        <div className="app-shell">
          <div className="app-main">
            <div className="app-content">{children}</div>
          </div>
        </div>
      </div>

      <StudyGoalBar />

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
    </>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const isLoginPage = pathname === "/login";
  const missionFocus = isMissionFocusRoute(pathname);

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

  return (
    <CaptainDeltaProvider>
      <CaptainDeltaExaminerProvider>
        <CaptainDeltaVisualProvider>
          <CaptainDeltaVisualBridge />
          <CaptainDeltaVisualMission />
          <CaptainDeltaMemoryBridge />
          <CaptainDeltaExaminerBridge />
          <MissionFlowCaptainBridge />
          <AcademySessionBridge />
          <CaptainDeltaRoleIndicator />

          {missionFocus ? (
            <AIPresenceProvider>
              <MissionFocusLayout>{children}</MissionFocusLayout>
            </AIPresenceProvider>
          ) : (
            <LegacyAppLayout>{children}</LegacyAppLayout>
          )}

          <StudyActivityToast />
          {user ? <CaptainDeltaFloatingAssistant /> : <CaptainDeltaAuthHint />}
        </CaptainDeltaVisualProvider>
      </CaptainDeltaExaminerProvider>
    </CaptainDeltaProvider>
  );
}
