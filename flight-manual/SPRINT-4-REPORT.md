# Sprint 4 Report — Recall Speech + Debrief Depth

**Date:** 2026-07-05  
**Status:** Complete  
**Architecture:** Frozen — no Mission Engine changes

---

## Goal

Make Mission Recall more real with speech capture, improve Flight Debrief usefulness, sync recall/debrief across devices, extend Flight Progress Strip to main mission routes, and remove duplicate Captain copy on Home.

---

## Files changed

### New

| File | Purpose |
|------|---------|
| `hooks/useRecallSpeech.ts` | Mic capture + Azure STT for recall items |
| `components/FlightProgressStrip/MissionRouteProgress.tsx` | Compact strip wrapper for mission routes |
| `prisma/migrations/20260705180000_daily_mission_recall_debrief/` | `recall` + `debrief` JSON on `DailyMissionDay` |
| `lib/dailyMissionSync.test.ts` | Merge/sync tests for recall/debrief |
| `components/FlightProgressStrip/MissionRouteProgress.test.ts` | Strip on main route apps |

### Modified

| File | Change |
|------|--------|
| `lib/missionRecall/missionRecallTypes.ts` | `MissionRecallAnswer`, `answers` map |
| `lib/missionRecall/missionRecallProgress.ts` | Transcript storage, speech/manual methods |
| `components/MissionRecall/MissionRecallApp.tsx` | Record answer UI + fallback |
| `lib/flightDebrief/flightDebriefTypes.ts` | `recallResult`, `strongestArea`, `weakestArea` |
| `lib/flightDebrief/buildFlightDebrief.ts` | Deeper debrief builder |
| `components/FlightDebrief/FlightDebriefApp.tsx` | New debrief sections |
| `lib/dailyMissionSync.ts` | Bundle recall/debrief, merge, apply |
| `app/api/daily-mission/route.ts` | Persist recall/debrief JSON |
| `components/AuthProvider.tsx` | Sync on recall/debrief events |
| `prisma/schema.prisma` | `recall`, `debrief` fields |
| Mission route apps | `MissionRouteProgress` on pron/vocab/part1/part2 |
| `components/home/HomePage.tsx` | Strip without Captain copy |
| `components/FlightProgressStrip/FlightProgressStrip.tsx` | Default `showCaptainCopy={false}` |
| `lib/captainDelta/briefing.ts` | Captain briefs (unchanged phase coaching) |
| `app/globals.css` | Recall speech/transcript styles |

### Docs

| File | Change |
|------|--------|
| `flight-manual/CURRENT-PRODUCT.md` | Sprint 4 shipped behavior |
| `flight-manual/IMPLEMENTATION-STATUS.md` | Recall speech, debrief sync |
| `flight-manual/architecture/runtime-map.md` | Sync fields + route strip |

---

## Features shipped

### 1. Mission Recall speech

- **Record answer** — MediaRecorder → `/api/stt` → transcript saved per item
- **Mark as answered** — unchanged fallback
- Local `answers` map: `method`, `transcript`, `answeredAt`
- No pronunciation scoring (by design)

### 2. Recall/debrief sync

- `DailyMissionDay.recall` + `DailyMissionDay.debrief` JSON columns
- `mergeMissionRecallState` / `mergeFlightDebriefState` in bundle merge
- Offline-first: localStorage primary, debounced push when logged in
- AuthProvider listens to `MISSION_RECALL_EVENT` + `FLIGHT_DEBRIEF_EVENT`

### 3. Flight Progress Strip coverage

`MissionRouteProgress` on:

- `/pronunciation`
- `/vocabulario`
- `/part1`
- `/part2`

### 4. Home Captain copy

- **CaptainBriefing** — greeting, phase line, coaching copy, next action
- **FlightProgressStrip** — phase track + “You are here” only (no duplicate Captain block)

### 5. Flight Debrief depth

- Completed legs list
- Recall result (items, confidence, spoken count)
- Strongest area / weakest area (from `buildDifficultyInsights`)
- One priority improvement
- Tomorrow focus

---

## Tests

| Suite | Tests |
|-------|-------|
| `lib/missionRecall/missionRecallProgress.test.ts` | 4 (+2 transcript/fallback) |
| `lib/dailyMissionSync.test.ts` | 3 (new) |
| `components/FlightProgressStrip/MissionRouteProgress.test.ts` | 4 (new) |
| `lib/flightDebrief/buildFlightDebrief.test.ts` | 2 (extended) |
| Prior sprints | 28 |

**Total:** 41 tests passing (`npm test`)

---

## Build status

`npm run build` — **passes**

Run migration in deployed environments:

```bash
npm run db:migrate:deploy
```

---

## Known limitations

| Limitation | Notes |
|------------|-------|
| No recall speech scoring | Transcript stored only — no pass/fail vs model answer |
| STT requires auth + Azure | Unauthenticated users can still use manual fallback |
| Debrief insights depend on local practice history | Weak/strong areas empty if little data |
| No Replay Debrief clips | Deferred per sprint scope |
| Captain voice still off | Not in Sprint 4 scope |

---

## Next recommended sprint

**Sprint 5 — Captain voice + vocabulary mission parity** (implementation only):

1. Re-enable rules-based Captain TTS for phase transitions
2. Vocabulary L1–L4 mission parity with pronunciation
3. Replay Debrief clip foundation (20s max)
4. Recall transcript review in Flight Debrief

---

## Definition of done

- [x] Azure speech recording in Mission Recall
- [x] Transcript stored locally per item
- [x] Manual fallback still works
- [x] Recall/debrief in `DailyMissionDay` + sync
- [x] Flight progress strip on main mission routes
- [x] Home Captain copy deduplicated
- [x] Flight Debrief depth fields
- [x] Tests pass
- [x] Build passes
- [x] Docs updated
