# ADR-005: Mission Orchestration Ownership

| Field | Value |
|-------|-------|
| **Status** | Proposed → **Locked on approval** |
| **Date** | July 2026 |
| **Deciders** | Tech Lead, Product Architect |
| **Related** | ADR-001, ADR-004, ADR-002, mission-flow-matrix |

---

## Context

**Orchestration** is the runtime coordination of legs: ordering, gating, CTAs, briefing copy inputs, and future Begin Flight / Timeline.

**Progression** (ADR-004) is the decision logic. **Orchestration** is the system that exposes it to UI, Captain Delta, sync, and logging.

Sprint 0 showed orchestration split across `dailyMission.ts`, `flightMission.ts`, `FlightAcademyDashboard`, `AcademySessionBridge`, and `lib/academy/briefing.ts`.

---

## Decision

### Orchestration owner: `lib/dailyMission.ts`

`dailyMission.ts` is the **orchestration facade** for the entire Mission Engine.

### Consumers (read-only)

These modules **consume** orchestration — they do not orchestrate:

| Consumer | Allowed calls |
|----------|---------------|
| `components/study/DailyMissionPanel.tsx` | `getDailyMissionSummary`, `getNextMissionAction` |
| `components/home/HomePage.tsx` | Via DailyMissionPanel only |
| `lib/captainDelta/briefing.ts` | `getDailyMissionSummary`, `getNextMissionAction` |
| `lib/captainDelta/memory/sessionClose.ts` | `getNextMissionAction` |
| `lib/flightInstructor/dailyDebrief.ts` | `getNextMissionAction` |
| `CaptainDeltaProvider.tsx` | `getNextMissionAction` for CTA hints |
| `lib/dailyMissionSync.ts` | Leg loaders; completion must align with `isDailyMissionComplete` |

### Orchestration vs pedagogy

| Layer | Owner | Example |
|-------|-------|---------|
| **Leg order** | `dailyMission.ts` | Pronunciation before Vocabulary |
| **Weak-area emphasis** | Captain Delta memory / insights | “Focus pronunciation today” copy |
| **Intra-leg pedagogy** | Mission chapters + trainers | PEEL levels, vault graduation |

Adaptive priorities from `lib/captainDelta/memory/adaptive.ts` may influence **copy and insights** — **never** leg order.

### Sprint 1 leg registry (implementation pattern)

Orchestration internally may use:

```typescript
// Private to lib/dailyMission.ts (or lib/missionEngine/legs.ts)
const LEG_PIPELINE: MissionLeg[] = [ ... ]; // matrix order
```

Public API remains the three exported functions from ADR-001.

### Future legs

| Leg | Sprint | Insertion point in pipeline |
|-----|--------|----------------------------|
| Mission Recall | 3 | After part2, before mock (intense) / before debrief (standard) |
| Flight Debrief | 5 | Terminal leg |
| Begin Flight briefing | 2 | Leg 0 — UI gate before leg 1, orchestration flag in dailyMission |

---

## Alternatives considered

| Alternative | Rejected because |
|-------------|------------------|
| **Orchestration in CaptainDeltaProvider** | God object; server cannot call |
| **Orchestration in HomePage** | Not reusable by debrief/API |
| **Separate orchestrator per mode** | Duplicates matrix rules |

---

## Consequences

**Positive**

- Clear boundary: orchestration = `dailyMission.ts`, presentation = `DailyMissionPanel`
- Academy layer decoupled
- Mission Timeline (Sprint 2) reads same summary object

**Negative**

- `AcademySessionBridge` deprecated — session start flows through home CTA

---

## Verification

- [ ] `buildDailyFlightMission` not used for CTA or leg list on home
- [ ] Captain briefing uses `dailyMission` not `flightMission`
- [ ] New leg added only via `dailyMission.ts` pipeline change + ADR if order changes
