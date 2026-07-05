# Sprint 3 Report — Flight Progress Strip + Mission UX Polish

**Date:** 2026-07-05  
**Status:** Complete  
**Architecture:** Frozen — no Mission Engine or ADR changes

---

## Goal

Ship a read-only **Flight Progress Strip** driven by `getDailyMissionSummary()` — aviation phase labels, current/completed/upcoming states, optional Check Ride in standard mode, estimated remaining time, and Captain Delta flight-phase copy.

---

## Files changed

### New — Flight progress

| File | Purpose |
|------|---------|
| `lib/flightProgress/flightProgressTypes.ts` | Phase IDs, aviation labels, Captain copy definitions |
| `lib/flightProgress/flightProgressStatus.ts` | Current phase detection + phase status from summary |
| `lib/flightProgress/flightProgressEstimatedTime.ts` | Remaining time estimate (display only) |
| `lib/flightProgress/buildFlightProgress.ts` | View model builder from `DailyMissionSummary` |
| `lib/flightProgress/flightProgressCopy.ts` | Captain briefing lines per phase |
| `lib/flightProgress/buildFlightProgress.test.ts` | 9 unit tests |
| `components/FlightProgressStrip/FlightProgressStrip.tsx` | Mobile-first progress UI |
| `components/FlightProgressStrip/FlightProgressStrip.module.css` | Strip styles |
| `components/FlightProgressStrip/index.ts` | Barrel export |

### Modified

| File | Change |
|------|--------|
| `components/home/HomePage.tsx` | Insert `FlightProgressStrip` after `CaptainBriefing` |
| `lib/captainDelta/briefing.ts` | Flight phase line + Captain copy in home briefing |
| `components/MissionRecall/MissionRecallApp.tsx` | Compact strip on recall screen |
| `components/FlightDebrief/FlightDebriefApp.tsx` | Compact strip on debrief screen |
| `components/home/HomePage.test.ts` | Asserts `FlightProgressStrip` in composition |

### Docs

| File | Change |
|------|--------|
| `flight-manual/CURRENT-PRODUCT.md` | Shipped strip + briefing phase |
| `flight-manual/IMPLEMENTATION-STATUS.md` | Mission Timeline → partial (strip foundation) |
| `flight-manual/architecture/runtime-map.md` | `lib/flightProgress` + UI paths |

---

## Features shipped

### Flight Progress Strip

Phases (aviation → mission):

| Aviation | Mission |
|----------|---------|
| ENGINE START | Pronunciation |
| TAXI | Vocabulary |
| TAKEOFF | Part 1 |
| CRUISE | Part 2 |
| SYSTEMS CHECK | Mission Recall |
| CHECK RIDE | Mock Exam (required intense / optional standard) |
| LANDING | Flight Debrief |
| SHUTDOWN | Mission Complete |

- **You are here** highlights current phase
- Completed / upcoming phases from summary flags only (no duplicated orchestration)
- **~N min remaining** from leg estimates with in-phase proration
- Captain phase copy on home strip; compact strip on recall/debrief routes

### Home layout (ADR-010)

```
CaptainBriefing → FlightProgressStrip → MissionCTA → DailyMissionPanel → AcademyHomeWidgets
```

### Captain Delta

- `buildTodayBriefing()` includes current flight phase and phase-specific coaching line
- Strip shows inline Captain copy on home

---

## Tests

| Suite | Tests |
|-------|-------|
| `lib/flightProgress/buildFlightProgress.test.ts` | 9 (new) |
| `lib/dailyMission.test.ts` | 11 |
| `components/home/HomePage.test.ts` | 5 |
| Other Sprint 2 suites | 7 |

**Total:** 32 tests passing (`npm test`)

---

## Build status

`npm run build` — **passes**

---

## Known limitations

| Limitation | Notes |
|------------|-------|
| Estimates are heuristic | Fixed minutes per leg — not tied to real session timers |
| No strip on Part 1/2/pronunciation routes | Only home, recall, debrief (simple integration) |
| Not full Mission Timeline LT | No leg drill-down, confidence gates, or timeline events |
| Duplicate Captain copy | Briefing + strip both show phase coaching on home |
| Standard Check Ride always "Optional" | Student can still open simulado separately |

---

## Next recommended sprint

**Sprint 4 — Recall speech + debrief depth** (implementation only):

1. Azure speech capture in Mission Recall
2. Server sync fields for recall/debrief on `DailyMissionDay`
3. Compact Flight Progress Strip on pronunciation / Part 1 / Part 2 headers
4. Captain voice re-enable (rules-based) for phase transitions

---

## Definition of done

- [x] `lib/flightProgress/` builder from `getDailyMissionSummary()`
- [x] `FlightProgressStrip` component with aviation phases
- [x] Home integration (correct order)
- [x] Mission recall + debrief integration
- [x] Captain flight-phase copy in briefing
- [x] Tests pass
- [x] Build passes
- [x] CURRENT-PRODUCT, IMPLEMENTATION-STATUS, runtime-map updated
- [x] SPRINT-3-REPORT created
