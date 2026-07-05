"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import PostExamPanel from "@/components/academy/PostExamPanel";
import { evaluateAchievements } from "@/lib/academy/achievements";
import { buildFlightBriefing } from "@/lib/academy/briefing";
import { buildCareerGoals } from "@/lib/academy/career";
import { communityComingSoon } from "@/lib/academy/community";
import {
  buildDailyFlightMission,
  firstFlightLegHref,
} from "@/lib/academy/flightMission";
import { loadLogbookFlights } from "@/lib/academy/logbook";
import { buildMonthlyAcademyReport } from "@/lib/academy/monthlyReport";
import {
  getAcademyPhase,
  getCaptainPersonality,
  phaseLabel,
} from "@/lib/academy/personality";
import { ACADEMY_CHANGE_EVENT, loadAcademyStore } from "@/lib/academy/store";
import { computeAcademyStatistics } from "@/lib/academy/stats";
import { buildExamReadiness } from "@/lib/captainDelta/memory/readiness";
import { CAPTAIN_DELTA_MEMORY_EVENT } from "@/lib/captainDelta/memory/store";
import { STUDY_ACTIVITY_RECORDED_EVENT } from "@/lib/studyActivityRecord";
import { daysUntilExam } from "@/lib/captainDelta/examDate";

function formatFlightDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

function resultLabel(result: string): string {
  if (result === "excellent") return "Excellent";
  if (result === "good") return "Good";
  return "Developing";
}

export default function FlightAcademyDashboard() {
  const { user, loading } = useAuth();
  const [tick, setTick] = useState(0);
  const refresh = useCallback(() => setTick((n) => n + 1), []);

  useEffect(() => {
    const events = [
      ACADEMY_CHANGE_EVENT,
      CAPTAIN_DELTA_MEMORY_EVENT,
      STUDY_ACTIVITY_RECORDED_EVENT,
    ];
    for (const ev of events) window.addEventListener(ev, refresh);
    return () => {
      for (const ev of events) window.removeEventListener(ev, refresh);
    };
  }, [refresh]);

  const firstName =
    user?.name?.split(" ")[0] || user?.email?.split("@")[0] || "Pilot";

  const briefing = useMemo(() => buildFlightBriefing(firstName), [firstName, tick]);
  const mission = useMemo(() => buildDailyFlightMission(), [tick]);
  const startHref = useMemo(() => firstFlightLegHref(mission), [mission]);
  const readiness = useMemo(() => buildExamReadiness(), [tick]);
  const stats = useMemo(() => computeAcademyStatistics(), [tick]);
  const achievements = useMemo(() => evaluateAchievements(), [tick]);
  const flights = useMemo(() => loadLogbookFlights(12), [tick]);
  const career = useMemo(() => buildCareerGoals(), [tick]);
  const monthly = useMemo(() => buildMonthlyAcademyReport(), [tick]);
  const personality = useMemo(() => getCaptainPersonality(), [tick]);
  const phase = useMemo(() => getAcademyPhase(), [tick]);
  const store = useMemo(() => loadAcademyStore(), [tick]);
  const daysLeft = daysUntilExam();

  const progressMetrics = [
    { label: "Coverage", value: readiness.coverage },
    { label: "Confidence", value: readiness.confidence },
    { label: "Pronunciation", value: readiness.pronunciation },
    { label: "Fluency", value: readiness.fluency },
    { label: "Vocabulary", value: readiness.vocabulary },
    { label: "Structure", value: readiness.structure },
    { label: "Interactions", value: readiness.interaction },
  ];

  if (loading) {
    return (
      <div className="wrap cda-dashboard">
        <p>Loading academy…</p>
      </div>
    );
  }

  const showPostExamPrompt = daysLeft <= 0 && store.postExamLevel == null;

  return (
    <div className="wrap cda-dashboard">
      <header className="cda-hero">
        <div className="cda-captain-badge" aria-hidden>
          👨‍✈️
        </div>
        <div className="cda-hero-copy">
          <p className="cda-hero-label">Captain Delta</p>
          <h1>{briefing.greeting}</h1>
          <p className="cda-hero-welcome">Welcome back.</p>
        </div>
        <div className="cda-exam-countdown">
          <span>ICAO Exam</span>
          <strong>{daysLeft} days</strong>
          <span>remaining</span>
        </div>
      </header>

      <p className="cda-phase-pill">{phaseLabel(phase)} · {personality.tone}</p>

      {showPostExamPrompt && <PostExamPanel />}

      <section className="cda-mission-card" aria-label="Today's flight mission">
        <header>
          <h2>{mission.title}</h2>
          <p className="cda-mission-time">
            Estimated time · <strong>{mission.totalMinutes} minutes</strong>
          </p>
        </header>

        <ol className="cda-route">
          {mission.legs.map((leg, i) => (
            <li key={`${leg.id}-${i}`}>
              {leg.label}
              {i < mission.legs.length - 1 && (
                <span className="cda-route-arrow" aria-hidden>
                  ↓
                </span>
              )}
            </li>
          ))}
        </ol>

        <div className="cda-mission-meta">
          <span>Difficulty: {briefing.difficulty}</span>
          <span>Objective: {briefing.objective}</span>
        </div>

        <Link href={startHref} className="btn purple btn-large cda-start-flight">
          Start Flight
        </Link>
      </section>

      <section className="cda-briefing" aria-label="Flight briefing">
        <h2>Flight briefing</h2>
        <ul>
          <li>
            <span>Weather</span> {briefing.weather}
          </li>
          <li>
            <span>Mission difficulty</span> {briefing.difficulty}
          </li>
          <li>
            <span>Today&apos;s objective</span> {briefing.objective}
          </li>
          <li>
            <span>Estimated flight time</span> {briefing.estimatedMinutes} minutes
          </li>
        </ul>
        <p className="cda-briefing-ready">{briefing.readyLine}</p>
      </section>

      <section className="cda-progress" aria-label="Progress">
        <header className="cda-section-head">
          <h2>Progress</h2>
          <p>
            Estimated ICAO <strong>{readiness.estimatedIcao.toFixed(1)}</strong>
          </p>
        </header>
        <div className="cda-progress-grid">
          {progressMetrics.map((m) => (
            <div key={m.label} className="cda-progress-metric">
              <span>{m.label}</span>
              <strong>{m.value}%</strong>
              <div className="cda-progress-bar" aria-hidden>
                <div style={{ width: `${m.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="cda-stats" aria-label="Academy statistics">
        <h2>Academy statistics</h2>
        <div className="cda-stats-grid">
          <div>
            <span>Flight hours studied</span>
            <strong>{stats.hoursStudied}h</strong>
          </div>
          <div>
            <span>Hours speaking English</span>
            <strong>{stats.hoursSpeaking}h</strong>
          </div>
          <div>
            <span>Questions answered</span>
            <strong>{stats.questionsAnswered}</strong>
          </div>
          <div>
            <span>Mock exams completed</span>
            <strong>{stats.mockExamsCompleted}</strong>
          </div>
          <div>
            <span>Best streak</span>
            <strong>{stats.bestStreak} days</strong>
          </div>
          <div>
            <span>Current streak</span>
            <strong>{stats.currentStreak} days</strong>
          </div>
        </div>
      </section>

      <section className="cda-career" aria-label="Career mode">
        <h2>Career mode</h2>
        <div className="cda-career-grid">
          <article className="cda-career-current">
            <p className="cda-career-label">Current goal</p>
            <h3>{career.current.title}</h3>
            {career.current.progress != null && (
              <>
                <div className="cda-career-bar" aria-hidden>
                  <div style={{ width: `${career.current.progress}%` }} />
                </div>
                <p>{career.current.progress}% complete</p>
              </>
            )}
            {career.current.description && (
              <p className="cda-career-desc">{career.current.description}</p>
            )}
          </article>
          <article>
            <p className="cda-career-label">Next goal</p>
            <h3>{career.next.title}</h3>
            {career.next.description && (
              <p className="cda-career-desc">{career.next.description}</p>
            )}
          </article>
          <article>
            <p className="cda-career-label">Future goal</p>
            <h3>{career.future.title}</h3>
            {career.future.description && (
              <p className="cda-career-desc">{career.future.description}</p>
            )}
          </article>
        </div>
      </section>

      <details className="cda-panel">
        <summary>Flight logbook</summary>
        {flights.length === 0 ? (
          <p className="cda-empty">Complete your first flight to open the logbook.</p>
        ) : (
          <ul className="cda-logbook">
            {flights.map((f) => (
              <li key={f.flightNumber} className="cda-logbook-entry">
                <header>
                  <strong>Flight #{f.flightNumber}</strong>
                  <span>{formatFlightDate(f.date)}</span>
                </header>
                <dl>
                  <div>
                    <dt>Duration</dt>
                    <dd>{f.durationMinutes} minutes</dd>
                  </div>
                  <div>
                    <dt>Mission</dt>
                    <dd>{f.mission}</dd>
                  </div>
                  <div>
                    <dt>Result</dt>
                    <dd>{resultLabel(f.result)}</dd>
                  </div>
                </dl>
                <blockquote>&ldquo;{f.captainNotes}&rdquo; — Captain Delta</blockquote>
              </li>
            ))}
          </ul>
        )}
      </details>

      <details className="cda-panel">
        <summary>Achievements</summary>
        <ul className="cda-achievements">
          {achievements.map((a) => (
            <li key={a.id} className={a.unlockedAt ? "unlocked" : "locked"}>
              <span className="cda-achievement-icon" aria-hidden>
                {a.icon}
              </span>
              <div>
                <strong>{a.title}</strong>
                <p>{a.description}</p>
                {a.unlockedAt && (
                  <time dateTime={a.unlockedAt}>
                    Unlocked {new Date(a.unlockedAt).toLocaleDateString()}
                  </time>
                )}
              </div>
            </li>
          ))}
        </ul>
      </details>

      <details className="cda-panel">
        <summary>Flight history</summary>
        <ul className="cda-timeline">
          {flights.map((f) => (
            <li key={f.flightNumber}>
              <time>{formatFlightDate(f.date)}</time>
              <span>Flight {f.flightNumber}</span>
              <span className="cda-timeline-mission">{f.mission}</span>
            </li>
          ))}
        </ul>
        {flights.length === 0 && (
          <p className="cda-empty">Your flight timeline will appear here.</p>
        )}
      </details>

      <details className="cda-panel">
        <summary>Monthly report — {monthly.monthLabel}</summary>
        <dl className="cda-monthly">
          <div>
            <dt>Speaking hours</dt>
            <dd>{monthly.speakingHours}h</dd>
          </div>
          <div>
            <dt>Vocabulary sessions</dt>
            <dd>{monthly.vocabularySessions}</dd>
          </div>
          <div>
            <dt>Most improved</dt>
            <dd>{monthly.mostImproved}</dd>
          </div>
          <div>
            <dt>Weakest area</dt>
            <dd>{monthly.weakestArea}</dd>
          </div>
          <div>
            <dt>ICAO evolution</dt>
            <dd>
              {monthly.icaoFrom.toFixed(1)} → {monthly.icaoTo.toFixed(1)}
            </dd>
          </div>
        </dl>
        <h3>Captain&apos;s recommendations</h3>
        <ul className="cda-recommendations">
          {monthly.recommendations.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </details>

      <details className="cda-panel cda-community">
        <summary>Academy community — coming soon</summary>
        <p>Modular architecture ready for future features:</p>
        <ul>
          {communityComingSoon().map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </details>

      <footer className="cda-footer">
        <Link href="/simulado">Mock exam →</Link>
        <Link href="/conta">Account & calendar →</Link>
      </footer>
    </div>
  );
}
