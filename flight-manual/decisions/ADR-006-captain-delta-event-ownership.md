# ADR-006: Captain Delta Event Ownership

| Field | Value |
|-------|-------|
| **Status** | Proposed → **Locked on approval** |
| **Date** | July 2026 |
| **Deciders** | Tech Lead |
| **Related** | Section 02, ADR-005, runtime-map |

---

## Context

Captain Delta reacts to browser events for coaching, debrief, and visual highlights. Event names and payloads are defined in multiple places:

- `lib/captainDelta/events.ts` — core coaching events
- `lib/captainDelta/examiner/events.ts` — simulado examiner
- `lib/captainDelta/visual/events.ts` — visual coaching
- Ad-hoc `window.dispatchEvent` strings in trainers

Without ownership rules, Sprint 1+ will add duplicate listeners and break context isolation.

---

## Decision

### Event bus model

Captain Delta uses a **browser CustomEvent bus** (not Redux). Ownership is split by namespace:

### Core coaching (mission-wide)

| Role | File |
|------|------|
| **Constants + emitters** | `lib/captainDelta/events.ts` |
| **Payload types** | `lib/captainDelta/types.ts` |
| **Primary subscriber** | `components/CaptainDelta/CaptainDeltaProvider.tsx` |

| Event constant | Purpose |
|----------------|---------|
| `CAPTAIN_DELTA_SUGGESTION` | Proactive tip (currently mostly disabled) |
| `CAPTAIN_DELTA_AFTER_ANSWER` | Post-recording coach card |
| `CAPTAIN_DELTA_DEBRIEF` | Structured debrief display |

**Rule:** New **breaking** core events require ADR-013+ per [event-governance.md](../event-governance.md). Minor events: update [event-catalog.md](../event-catalog.md) only.

### Examiner namespace (simulado only)

| Role | File |
|------|------|
| Constants + emitters | `lib/captainDelta/examiner/events.ts` |
| Subscriber | `CaptainDeltaProvider` + `components/CaptainDelta/Examiner/*` |

Examiner events **must not** fire during daily mission legs (except mock exam leg).

### Visual namespace

| Role | File |
|------|------|
| Constants + emitters | `lib/captainDelta/visual/events.ts` |
| Bridge | `components/CaptainDelta/Visual/CaptainDeltaVisualBridge.tsx` |

### Mission leg change events (NOT Captain Delta)

Per-leg `*_DAILY_MISSION_EVENT` constants stay in their leg modules. They are **mission state events**, not Captain Delta events.

`DailyMissionPanel` and `dailyMission.ts` consumers listen to leg events to refresh summary — **CaptainDeltaProvider must not** own mission checklist refresh (avoid coupling).

### Memory store events

| Event | Owner |
|-------|-------|
| `CAPTAIN_DELTA_MEMORY_EVENT` | `lib/captainDelta/memory/store.ts` |

Memory events notify UI widgets (readiness, briefing) — not a substitute for coaching events.

---

## Alternatives considered

| Alternative | Rejected because |
|-------------|------------------|
| **All events in Provider** | Untestable; circular imports |
| **React Context only** | Trainers in deep trees already use emit pattern |
| **Single events.ts for everything** | Examiner/visual isolation requirements (Section 09) |

---

## Consequences

**Positive**

- Clear import path for trainers emitting debrief
- Examiner mode isolation preserved
- Sprint 7 conversation can add `emitCaptainDeltaAfterAnswer` variants without new bus

**Negative**

- Contributors must check three event files by domain

---

## Verification

- [ ] No string literal `icao-captain-delta-*` outside `lib/captainDelta/**`
- [ ] Examiner events only from simulado runner
- [ ] Provider subscribes to all core events in one `useEffect`
