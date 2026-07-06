# ADR-002: Canonical Home Experience

| Field | Value |
|-------|-------|
| **Status** | Proposed → **Locked on approval** |
| **Date** | July 2026 |
| **Deciders** | Tech Lead, Product Architect |
| **Related** | ADR-001, ADR-005, Section 03A, mission-flow-matrix |

---

## Context

The home route (`app/page.tsx` → `HomePage` → `FlightAcademyDashboard`) shows:

- Adaptive mission legs from `buildDailyFlightMission()` (wrong order)
- Academy gamification (achievements, logbook, readiness)
- “Start Flight” href from `firstFlightLegHref(mission)` — not `getNextMissionAction()`

`DailyMissionPanel` already implements:

- Full leg checklist from `getDailyMissionSummary()`
- Study mode toggle (standard / intense)
- Links derived from per-leg mission modules
- Difficulty insights and daily debrief panel

It is built but **not mounted** on `/`.

Section 03A requires Begin Flight + visible mission plan. Section 03 requires Captain-controlled sequence — not a module picker.

---

## Decision

**Canonical Home Experience:**

```
app/page.tsx
    → components/home/HomePage.tsx
        → components/study/DailyMissionPanel.tsx   (PRIMARY — mission authority)
        → [optional] academy widgets section         (SECONDARY — gamification only)
```

### Rules

1. **`DailyMissionPanel`** is the **primary** home surface — mission checklist, next CTA, study mode.
2. **Primary CTA** must use `getNextMissionAction()` from `lib/dailyMission.ts` — not `firstFlightLegHref()`.
3. **Academy widgets** (streak, achievements, logbook preview, readiness radar) may render **below** the mission panel as read-only or motivational UI — they **must not** define leg order or override the CTA.
4. **`FlightAcademyDashboard`** is **deprecated** as the home root (ADR-007). Its useful widgets are extracted in Sprint 1, not deleted wholesale.

### Sprint 1 composition target

`HomePage` renders:

- `DailyMissionPanel` (full width primary)
- Optional `AcademyHomeWidgets` (new thin wrapper extracting non-orchestration pieces from deprecated dashboard)

---

## Alternatives considered

| Alternative | Rejected because |
|-------------|------------------|
| **Keep `FlightAcademyDashboard` as home** | Perpetuates wrong leg order (TD-01, TD-02) |
| **Merge dashboard into dailyMission.ts** | Mixes UI with orchestration |
| **New `MissionBoard` component replacing both** | Extra churn; `DailyMissionPanel` already matches spec |
| **Sidebar nav as “home”** | Student must not choose modules (Rule 2, Section 99) |

---

## Consequences

**Positive**

- Home matches Mission Flow Matrix immediately
- One CTA path for student and Captain Delta
- `DailyMissionPanel` investment is finally used

**Negative**

- Sprint 1 UI work to compose HomePage and extract academy widgets
- Temporary visual regression until design system catches up (Sprint 2 Begin Flight)

**Compliance**

- Remove `FlightAcademyDashboard` from `HomePage` in Sprint 1
- `QUICK_LINKS` module picker demoted to sidebar nav only — never primary home CTA

---

## Verification

- [ ] `/` renders `DailyMissionPanel`
- [ ] Start / Continue button href === `getNextMissionAction()?.href`
- [ ] Leg checklist order === matrix (pronunciation before vocabulary before part1…)
