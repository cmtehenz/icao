# ADR-010: Home Page Responsibility

| Field | Value |
|-------|-------|
| **Status** | **Locked** |
| **Date** | July 2026 |
| **Deciders** | Chief Product Architect, Staff Engineer |
| **Related** | ADR-002, ADR-005, ADR-008, ADR-009 |

---

## Context

`FlightAcademyDashboard` mixed gamification, orchestration, and business rules. Sprint 1 requires a home that feels like a flight academy without becoming a second Mission Engine.

---

## Decision

### `components/home/HomePage.tsx` responsibilities

Home **only**:

| Allowed | Description |
|---------|-------------|
| **Assemble components** | Layout: mission panel, optional academy widgets, shell spacing |
| **Request data** | Pass props none — children call Mission Engine read APIs themselves OR receive data via thin hooks that wrap **read-only** engine calls |
| **Display mission** | Render `DailyMissionPanel` as primary column |

Home **must not** contain:

| Forbidden | Belongs to |
|-----------|------------|
| Business logic | `lib/dailyMission.ts`, leg modules |
| `getNextMissionAction()` branching | `DailyMissionPanel` or dedicated `MissionCTA` child — **not** `HomePage` |
| Leg order arrays | Mission Engine |
| Progress mutation | Leg trainers via Mission Engine APIs |
| Completion evaluation | `isDailyMissionComplete()` in engine — Home reads result only |
| `buildDailyFlightMission()` | Deprecated (ADR-007) |

### Component layering

```
HomePage.tsx          → composition only (zero mission logic)
    ├── DailyMissionPanel.tsx   → mission presentation (reads engine; study mode via studyTime)
    ├── MissionCTA.tsx          → [Sprint 1] single Begin Flight button → getNextMissionAction()
    ├── CaptainBriefing.tsx     → [Sprint 1] read-only briefing slot
    └── AcademyHomeWidgets.tsx  → [Sprint 1] streak/achievements read-only
```

`DailyMissionPanel` is **mission presentation**, not Home. It may:

- Call `getDailyMissionSummary()` / `getNextMissionAction()` (read)
- Listen to `*_DAILY_MISSION_EVENT` for re-render
- Toggle study mode via `lib/studyTime.ts` (settings — not leg completion)

`DailyMissionPanel` must **not**:

- Build leg lists independently
- Mark legs complete
- Override CTA href

### Single Begin Flight CTA (Sprint 1)

One primary button on home:

- Label: Begin Flight / Continue Flight (copy from Section 03A)
- `href`: `getNextMissionAction()?.href` exclusively
- Briefing: Captain Delta read-only block above or beside CTA

---

## Rationale

| Concern | Why separate Home |
|---------|-------------------|
| **Ten-year maintenance** | UI layout changes without touching orchestration |
| **Testability** | Engine unit tests without React |
| **Rule 2** | Student does not pick modules from home logic |
| **ADR-008** | Home is read-only for mission state |

---

## Verification

- [ ] `HomePage.tsx` under 50 lines; no `@/lib/*DailyMission` save imports
- [ ] `grep getNextMissionAction HomePage` → zero (only in children)
- [ ] No `buildDailyFlightMission` in `components/home/**`
