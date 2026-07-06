# ADR-007: Deprecated Modules

| Field | Value |
|-------|-------|
| **Status** | Proposed → **Locked on approval** |
| **Date** | July 2026 |
| **Deciders** | Tech Lead |
| **Related** | ADR-001, ADR-002, ADR-005, Sprint 1 roadmap |

---

## Context

Sprint 0 identified modules that contradict the locked architecture or are orphaned. Deprecation is **scheduled removal** — not immediate delete in Sprint 0 (no code). Sprint 1 implements replacements then removes imports.

---

## Decision

### Deprecated — mission orchestration (remove in Sprint 1)

| Module | Reason | Replacement |
|--------|--------|-------------|
| `lib/academy/flightMission.ts` | Invents leg order; duplicates `dailyMission.ts` | `lib/dailyMission.ts` |
| `lib/academy/briefing.ts` | Depends on `buildDailyFlightMission()` legs | `lib/captainDelta/briefing.ts` |
| `components/academy/AcademySessionBridge.tsx` | Starts sessions from `flightMission` | Home CTA via `getNextMissionAction()` |
| `components/academy/FlightAcademyDashboard.tsx` | Wrong home orchestration | `DailyMissionPanel` + `HomePage` (ADR-002) |

### Deprecated — home wiring (change in Sprint 1)

| Module | Action |
|--------|--------|
| `components/home/HomePage.tsx` | **Rewrite** — mount `DailyMissionPanel`, not `FlightAcademyDashboard` |

### Deprecated — API duplicate (remove when confirmed unused)

| Module | Replacement |
|--------|-------------|
| `app/api/speech-token/route.ts` | `app/api/azure-speech-token/route.ts` |

### Deprecated — orphan UI (remove Sprint 1 or 16)

| Module | Notes |
|--------|-------|
| `components/Part1Simulator.tsx` | Zero imports |
| `components/IcaoStructureApp.tsx` | `/structure` redirects to `/` |
| `icao_part1.html` | Pre-Next.js legacy |

### Deprecated — evaluate alias (low priority)

| Module | Replacement |
|--------|-------------|
| `app/api/evaluate-answer/route.ts` | `app/api/evaluate/route.ts` |

### NOT deprecated

| Module | Role after lock |
|--------|-----------------|
| `lib/academy/store.ts` | Gamification, phases, XP |
| `lib/academy/achievements.ts` | Achievements |
| `lib/academy/logbook.ts` | Logbook data (UI Sprint 13) |
| `lib/academy/stats.ts` | Statistics |
| `lib/captainDelta/memory/adaptive.ts` | Weak-area **copy** only (ADR-005) |
| `components/study/DailyMissionPanel.tsx` | **Canonical** home mission UI |

---

## Removal policy

1. **Sprint 1:** Remove deprecated imports from home path; add `@deprecated` JSDoc to `flightMission.ts` functions used for leg order.
2. **Sprint 1:** Delete `FlightAcademyDashboard` from `HomePage` import chain.
3. **Sprint 16:** Physical file delete after grep confirms zero references.
4. **Never** delete `lib/academy/` folder — only orchestration paths inside it.

---

## Alternatives considered

| Alternative | Rejected because |
|-------------|------------------|
| **Delete everything in Sprint 1** | Loses academy widgets not yet extracted |
| **Keep both home UIs behind flag** | Perpetuates dual truth |
| **Merge flightMission into dailyMission** | Academy coupling remains |

---

## Consequences

**Positive**

- Deprecation list is explicit for code review
- Sprint 1 scope is bounded

**Negative**

- Short period where deprecated files exist with JSDoc warnings

---

## Verification

- [ ] `HomePage` does not import `FlightAcademyDashboard` after Sprint 1
- [ ] `grep buildDailyFlightMission` only hits deprecated files + tests marking deprecation
- [ ] `speech-token` route removed or 410 after caller audit
