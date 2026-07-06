# ADR-001: Canonical Mission Engine

| Field | Value |
|-------|-------|
| **Status** | Proposed → **Locked on approval** |
| **Date** | July 2026 |
| **Deciders** | Tech Lead, Product Architect |
| **Supersedes** | — |
| **Related** | ADR-004, ADR-005, Section 03, mission-flow-matrix |

---

## Context

Sprint 0 identified two competing orchestrators:

- **`lib/dailyMission.ts`** — matrix order (pronunciation → vocabulary → part1 → part2 → mock if intense); used by Captain Delta and debrief flows.
- **`lib/academy/flightMission.ts`** — adaptive leg lists for `FlightAcademyDashboard`; order does not match the Mission Flow Matrix.

The Flight Manual defines one Mission Engine (Section 03). The codebase must have one canonical entry point.

---

## Decision

**`lib/dailyMission.ts` is the canonical Mission Engine.**

It is the **only** module allowed to:

- Define daily mission leg **order**
- Export `getDailyMissionSummary()`, `getNextMissionAction()`, `isDailyMissionComplete()`
- Decide when the intense-mode simulado leg is required

Per-leg modules remain separate files:

| Leg | Module |
|-----|--------|
| Pronunciation | `lib/pronunciationDailyMission.ts` |
| Vocabulary | `lib/vocabDailyMission.ts` |
| Part 1 | `lib/part1DailyMission.ts` |
| Part 2 | `lib/part2DailyMission.ts` |
| Mock (intense) | `lib/simulateDailyMission.ts` |

Future legs (Mission Recall, Flight Debrief) register **only** inside `dailyMission.ts`.

### Internal refactor rule

Sprint 1 may extract a private leg registry (e.g. `lib/missionEngine/legs.ts`) **if and only if**:

- All public imports continue to use `@/lib/dailyMission`
- No second public orchestrator is introduced

---

## Alternatives considered

| Alternative | Rejected because |
|-------------|------------------|
| **`lib/academy/flightMission.ts` as engine** | Violates matrix order; couples gamification to orchestration |
| **New `lib/missionEngine/index.ts` as public API** | Unnecessary churn; `dailyMission.ts` already is the API |
| **UI-owned orchestration** | Breaks Captain Delta, debrief, and server sync consistency |
| **Per-route orchestration** | Student would see different “next step” per screen |

---

## Consequences

**Positive**

- Single source of truth aligned with [mission-flow-matrix.md](../mission-flow-matrix.md)
- Captain Delta, Flight Instructor, and home CTAs stay consistent
- Sprint 3+ legs slot in one file

**Negative**

- `dailyMission.ts` will grow; mitigated by private leg registry pattern
- Sprint 1 must migrate all consumers off `flightMission.ts` leg lists

**Compliance**

- `lib/academy/flightMission.ts` → deprecated (ADR-007)
- Any import of `buildDailyFlightMission()` for **leg order** is forbidden after Sprint 1

---

## Verification

- [ ] `grep buildDailyFlightMission` shows no home/orchestration usage
- [ ] `getNextMissionAction()` order matches matrix for standard + intense
- [ ] [runtime-map.md](../runtime-map.md) lists `dailyMission.ts` as sole orchestrator
