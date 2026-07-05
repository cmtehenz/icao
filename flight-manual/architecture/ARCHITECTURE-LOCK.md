# Architecture Lock — Finalized

**Status:** 🔒 **FINALIZED** — ADR-001 through ADR-013 locked  
**Platform freeze:** [ARCHITECTURE-FREEZE.md](../ARCHITECTURE-FREEZE.md) · [RFC-003](./rfc/RFC-003-architecture-stress-test-platform-freeze.md)
**Date:** July 2026  
**Phase:** Software Implementation Phase authorized  
**Review:** [ARCHITECTURE-FINAL-REVIEW.md](./ARCHITECTURE-FINAL-REVIEW.md)  
**Sprint 1:** [sprint-1-first-flight-experience.md](./sprint-1-first-flight-experience.md)

**Authority:** [mission-flow-matrix.md](./mission-flow-matrix.md) · [runtime-map.md](./runtime-map.md) · [IMPLEMENTATION-ROADMAP.md](../IMPLEMENTATION-ROADMAP.md)

---

## Locked answers

### 1. Which file becomes the canonical Mission Engine?

**`lib/dailyMission.ts`**

**Why:** It is the only module that implements the Mission Flow Matrix leg order, exposes the public orchestration API (`getDailyMissionSummary`, `getNextMissionAction`, `isDailyMissionComplete`), and is already consumed by Captain Delta, Flight Instructor, and session-close flows. Per-leg modules (`*DailyMission.ts`) are **data providers**, not engines. A future `lib/missionEngine/` folder may exist only as a **private implementation detail** re-exported through `dailyMission.ts` — never as a second public orchestrator.

→ [ADR-001](./adr/ADR-001-canonical-mission-engine.md)

---

### 2. Which component becomes the canonical Home Experience?

**`components/study/DailyMissionPanel.tsx`** mounted as the **primary surface** of **`components/home/HomePage.tsx`**.

**Why:** `DailyMissionPanel` is the only home component bound to `getDailyMissionSummary()` and the matrix leg checklist. `FlightAcademyDashboard` invents leg order via `lib/academy/flightMission.ts`, which violates Section 03 and the Mission Flow Matrix. Academy gamification (streak, achievements, logbook preview) may appear **below** the mission panel as secondary widgets — not as an alternate mission controller.

→ [ADR-002](./adr/ADR-002-canonical-home-experience.md)

---

### 3. Where does mission state live?

| Layer | Owner | Storage |
|-------|-------|---------|
| **Per-leg state** | `lib/pronunciationDailyMission.ts`, `lib/vocabDailyMission.ts`, `lib/part1DailyMission.ts`, `lib/part2DailyMission.ts`, `lib/simulateDailyMission.ts` | localStorage (versioned keys) |
| **Aggregate completion** | `lib/dailyMission.ts` + `lib/dailyMissionLog.ts` | Derived + `icao_daily_mission_log_v1` |
| **Server mirror** | `lib/dailyMissionSync.ts` → `app/api/daily-mission/route.ts` | PostgreSQL `DailyMissionDay` |
| **Study mode** | `lib/studyTime.ts` | `icao_study_plan_mode_v1` |
| **Exam context** | `lib/dailyExamRotation.ts` | Derived from calendar |

Mission state **does not** live in `lib/academy/store.ts` or `lib/academy/flightMission.ts`.

→ [ADR-003](./adr/ADR-003-mission-state-ownership.md)

---

### 4. Who owns mission progression?

**`lib/dailyMission.ts`** owns all **progression decisions** (which leg is next, whether the day is complete).

Per-leg modules own **state mutations** only (e.g. `markPronunciationWordComplete`) and must emit their change events. They must **never** compute next leg or redirect the student.

→ [ADR-004](./adr/ADR-004-mission-progression-ownership.md)

---

### 5. Who owns mission orchestration?

**`lib/dailyMission.ts`** owns orchestration.

**UI rule:** Home, Captain Delta CTAs, and briefing copy call `getNextMissionAction()` — they do not build leg lists locally.

**Sprint 1+ extension:** New legs (Recall, Debrief) register in `dailyMission.ts` only, in matrix order per [mission-flow-matrix.md](./mission-flow-matrix.md).

→ [ADR-005](./adr/ADR-005-mission-orchestration-ownership.md)

---

### 6. Who owns Captain Delta events?

| Concern | Owner |
|---------|-------|
| **Event names + emitters** | `lib/captainDelta/events.ts` |
| **Payload types** | `lib/captainDelta/types.ts` |
| **Subscription + UI reaction** | `components/CaptainDelta/CaptainDeltaProvider.tsx` |
| **Examiner events** | `lib/captainDelta/examiner/events.ts` (examiner namespace only) |
| **Visual events** | `lib/captainDelta/visual/events.ts` (visual namespace only) |

No new `CAPTAIN_DELTA_*` or `icao-captain-delta-*` events outside these files without a new ADR.

→ [ADR-006](./adr/ADR-006-captain-delta-event-ownership.md)

---

### 7. Which files become deprecated?

| File | Status | Replacement |
|------|--------|-------------|
| `lib/academy/flightMission.ts` | **Deprecated** (leg ordering) | `lib/dailyMission.ts` |
| `components/academy/FlightAcademyDashboard.tsx` | **Deprecated** as home root | `DailyMissionPanel` + `HomePage` |
| `lib/academy/briefing.ts` | **Deprecated** (uses flightMission legs) | `lib/captainDelta/briefing.ts` + `dailyMission.ts` |
| `components/academy/AcademySessionBridge.tsx` | **Deprecated** (flightMission session) | Captain Delta + `dailyMission.ts` |
| `app/api/speech-token/route.ts` | **Deprecated** | `app/api/azure-speech-token/route.ts` |
| `components/Part1Simulator.tsx` | **Deprecated** (orphan) | `components/study/FlashcardApp.tsx` |
| `components/IcaoStructureApp.tsx` | **Deprecated** (orphan) | — |
| `icao_part1.html` | **Deprecated** (legacy) | `/part1` route |

**Not deprecated:** `lib/academy/*` stats, achievements, logbook — academy **layer** remains; only mission-orchestration paths inside academy are deprecated.

→ [ADR-007](./adr/ADR-007-deprecated-modules.md)

---

## ADR index

| ADR | Title |
|-----|-------|
| [ADR-001](./adr/ADR-001-canonical-mission-engine.md) | Canonical Mission Engine |
| [ADR-002](./adr/ADR-002-canonical-home-experience.md) | Canonical Home Experience |
| [ADR-003](./adr/ADR-003-mission-state-ownership.md) | Mission State Ownership |
| [ADR-004](./adr/ADR-004-mission-progression-ownership.md) | Mission Progression Ownership |
| [ADR-005](./adr/ADR-005-mission-orchestration-ownership.md) | Mission Orchestration Ownership |
| [ADR-006](./adr/ADR-006-captain-delta-event-ownership.md) | Captain Delta Event Ownership |
| [ADR-007](./adr/ADR-007-deprecated-modules.md) | Deprecated Modules |
| [ADR-008](./adr/ADR-008-single-source-of-truth.md) | Single Source of Truth |
| [ADR-009](./adr/ADR-009-captain-authority.md) | Captain Authority |
| [ADR-010](./adr/ADR-010-home-page-responsibility.md) | Home Page Responsibility |
| [ADR-011](./adr/ADR-011-feature-ownership.md) | Feature Ownership |
| [ADR-012](./adr/ADR-012-flight-manual-freeze.md) | Flight Manual Freeze |
| [ADR-013](./adr/ADR-013-training-programs-architecture.md) | Training Programs Architecture |

**Also locked:** [mission-state-sync.md](./mission-state-sync.md) · [event-catalog.md](./event-catalog.md) · [RFC-001](./rfc/RFC-001-educational-intelligence-architecture.md) · [RFC-002](./rfc/RFC-002-training-programs-architecture.md) · [RFC-003](./rfc/RFC-003-architecture-stress-test-platform-freeze.md) · [ARCHITECTURE-FREEZE.md](../ARCHITECTURE-FREEZE.md)

---

## Amendment process

1. No architectural decision in this lock may change without a new ADR (**ADR-014+**).  
2. Platform layers (ME, Captain, EIA, TPA) are frozen per [ARCHITECTURE-FREEZE.md](../ARCHITECTURE-FREEZE.md).  
3. ADRs require Tech Lead + Product Architect approval.  
3. Flight Manual remains frozen (ADR-012); implementation adapts to manual.  
4. Update [runtime-map.md](./runtime-map.md) and [CURRENT-PRODUCT.md](../CURRENT-PRODUCT.md) each sprint — not this lock.

---

## Approval

| Role | Approved | Date |
|------|----------|------|
| Tech Lead | ✅ | July 2026 |
| Product Architect | ✅ | July 2026 |

**Sprint 1 — First Flight Experience authorized.** See [ARCHITECTURE-FINAL-REVIEW.md](./ARCHITECTURE-FINAL-REVIEW.md).
