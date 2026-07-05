# Sprint 2 Report — Mission Recall + Flight Debrief Foundation

**Date:** 2026-07-05  
**Status:** Complete  
**Architecture:** Locked (ADR-001–012) — no ADR changes

---

## Goal

Close the daily mission loop per [mission-flow-matrix.md](./architecture/mission-flow-matrix.md):

```
Mission legs → Mission Recall → Mock Exam (intense) → Flight Debrief → Mission complete
```

---

## Files changed

### New — Mission Recall

| File | Purpose |
|------|---------|
| `lib/missionRecall/missionRecallTypes.ts` | Types for items, state, progress |
| `lib/missionRecall/buildMissionRecall.ts` | Build recall items from today's mission only |
| `lib/missionRecall/missionRecallProgress.ts` | Local state, resume, completion |
| `lib/missionRecall/missionRecallScoring.ts` | Recall confidence stars + short feedback |
| `lib/missionRecall/events.ts` | Start/complete events + Captain suggestions |
| `lib/missionRecall/buildMissionRecall.test.ts` | Builder tests |
| `lib/missionRecall/missionRecallProgress.test.ts` | Progress/resume tests |
| `components/MissionRecall/MissionRecallApp.tsx` | One-item-at-a-time recall UI |
| `app/mission-recall/page.tsx` | Route |

### New — Flight Debrief

| File | Purpose |
|------|---------|
| `lib/flightDebrief/flightDebriefTypes.ts` | Debrief summary + state types |
| `lib/flightDebrief/buildFlightDebrief.ts` | Summary from daily mission state |
| `lib/flightDebrief/flightDebriefProgress.ts` | Debrief completion state |
| `lib/flightDebrief/events.ts` | Available/complete events |
| `lib/flightDebrief/buildFlightDebrief.test.ts` | Debrief builder tests |
| `components/FlightDebrief/FlightDebriefApp.tsx` | End-of-flight debrief UI |
| `app/flight-debrief/page.tsx` | Route |

### New — Captain integration

| File | Purpose |
|------|---------|
| `components/CaptainDelta/MissionFlowCaptainBridge.tsx` | Reacts to recall/debrief/mission-complete (read-only) |

### Modified

| File | Change |
|------|--------|
| `lib/dailyMission.ts` | Recall + debrief in summary, next action, completion |
| `components/study/DailyMissionPanel.tsx` | Recall + debrief checklist cards |
| `lib/home/missionRefreshEvents.ts` | Recall/debrief refresh events |
| `components/AppShell.tsx` | Mount `MissionFlowCaptainBridge` |
| `lib/dailyMission.test.ts` | Updated matrix order tests |
| `app/globals.css` | Recall + debrief styles |
| `flight-manual/architecture/event-catalog.md` | New mission flow events |
| `flight-manual/CURRENT-PRODUCT.md` | Shipped behavior |
| `flight-manual/IMPLEMENTATION-STATUS.md` | Recall/debrief status |
| `flight-manual/architecture/runtime-map.md` | Runtime diagram |

---

## Features implemented

### Mission Recall (Section 08 foundation)

- Builds items from today's pronunciation words, vocabulary terms, Part 1 question, Part 2 scenarios, and one surprise question
- No new content — `sourceRef` ties each item to today's mission
- Local progress with resume (`answeredIds`)
- Recall confidence score (1–5 stars) on completion
- UI: fast pace, one prompt at a time, "Mark as answered" fallback, short Captain feedback

### Mission Engine integration

- `getNextMissionAction()` order: … → Part 2 → **Mission Recall** → Mock (intense) → **Flight Debrief**
- Intense mode blocks Mock Exam until Recall is complete
- `isDailyMissionComplete()` requires debrief after all required legs
- `DailyMissionPanel` shows Recall and Debrief cards

### Flight Debrief (Section 10 foundation)

- Summarizes completed legs, recall confidence, one priority improvement, next action, tomorrow focus
- Debrief available only when base legs + recall (+ mock if intense) are done
- "Complete today's flight" marks debrief done → triggers `syncDailyMissionLog()`

### Captain Delta (ADR-009)

- Reacts via `MissionFlowCaptainBridge` — suggestions only, no state mutation
- Events: recall start/complete, debrief available/complete, mission log complete

---

## Tests added

| Suite | Tests |
|-------|-------|
| `lib/missionRecall/buildMissionRecall.test.ts` | 3 |
| `lib/missionRecall/missionRecallProgress.test.ts` | 2 |
| `lib/flightDebrief/buildFlightDebrief.test.ts` | 2 |
| `lib/dailyMission.test.ts` | 11 (updated) |

**Total:** 23 tests passing (`npm test`)

---

## Build status

`npm run build` — **passes** (includes `/mission-recall` and `/flight-debrief` routes)

---

## Known limitations

| Limitation | Notes |
|------------|-------|
| No Azure speech scoring in Recall | "Mark as answered" fallback only |
| No model answers in Recall UI | By design (Section 08) |
| Recall/debrief state local-only | Server sync not added (prepared via same patterns as other legs) |
| No Replay Debrief audio clip | Section 10 replay moment not implemented |
| Surprise question is template-based | Not AI-generated |
| Part 2 recall prompts are generic | Derived from scenario structure, not full situation replay |
| DailyMissionDay sync unchanged | Recall/debrief not in Prisma bundle yet |

---

## Technical debt

- Recall item builder depends on `getOrCreate*` side effects in browser
- `FlightDebriefApp` uses `window.location.href` for post-complete redirect (simple; could use router)
- Duplicate Captain suggestions from `events.ts` and `MissionFlowCaptainBridge` (harmless but could consolidate)
- Standard mode section count in UI copy updated; streak/points logic unchanged

---

## Next recommended sprint

**Sprint 3 — Recall polish + Debrief depth + sync** (per roadmap):

1. Azure speech capture in Mission Recall with short Captain feedback
2. Replay Debrief clip selection (20s max) from today's recordings
3. Server sync fields for recall + debrief on `DailyMissionDay` (optional JSON blobs)
4. Mission Timeline UI foundation
5. Remove remaining `buildDailyFlightMission()` consumers outside deprecated files

---

## Definition of done

- [x] Mission Recall engine exists
- [x] Mission Recall UI exists
- [x] Mission Recall integrated into Mission Engine
- [x] DailyMissionPanel shows Mission Recall
- [x] `getNextMissionAction` routes to Mission Recall correctly
- [x] Flight Debrief foundation exists
- [x] Debrief appears as mission closing leg
- [x] Mission completion requires Debrief
- [x] Captain Delta reacts but does not mutate state
- [x] Tests pass
- [x] Build passes
- [x] CURRENT-PRODUCT updated
- [x] IMPLEMENTATION-STATUS updated
- [x] SPRINT-2-REPORT created
