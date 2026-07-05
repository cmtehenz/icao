# Sprint 1 Report — First Flight Experience

**Date:** 2026-07-05  
**Status:** Complete  
**Architecture:** Locked (ADR-001–012) — no ADR changes required

---

## Goal

When the student opens ICAO Delta, Home must feel like entering a professional flight academy: Captain briefing, a single mission CTA, matrix-ordered checklist, and read-only academy widgets below.

---

## Files changed

### New

| File | Purpose |
|------|---------|
| `components/home/MissionCTA.tsx` | Begin Flight / Continue Flight from `getNextMissionAction()` |
| `components/home/CaptainBriefing.tsx` | Captain Delta home briefing via `buildTodayBriefing()` |
| `components/home/AcademyHomeWidgets.tsx` | Read-only progress, stats, career, logbook — no orchestration |
| `lib/home/missionRefreshEvents.ts` | Shared mission-state refresh event list |
| `lib/dailyMission.test.ts` | Mission engine unit tests |
| `components/home/HomePage.test.ts` | Home composition guard tests |
| `vitest.config.ts` | Test runner config |
| `prisma/migrations/20260705160000_daily_mission_pronunciation/migration.sql` | `pronunciation` JSON on `DailyMissionDay` |

### Modified

| File | Change |
|------|--------|
| `components/home/HomePage.tsx` | Composition only: briefing → CTA → panel → widgets |
| `lib/dailyMissionSync.ts` | Pronunciation in bundle, merge, apply |
| `lib/pronunciationDailyMission.ts` | Participates in server sync path |
| `app/api/daily-mission/route.ts` | Read/write `pronunciation` field |
| `prisma/schema.prisma` | `pronunciation Json?` on `DailyMissionDay` |
| `components/AuthProvider.tsx` | Sync on `PRONUNCIATION_DAILY_MISSION_EVENT` |
| `components/academy/AcademySessionBridge.tsx` | Logbook title from `getDailyMissionSummary()`; `@deprecated` |
| `components/academy/FlightAcademyDashboard.tsx` | `@deprecated` (not mounted on home) |
| `lib/academy/flightMission.ts` | `@deprecated` |
| `lib/academy/briefing.ts` | `@deprecated` |
| `app/globals.css` | Home flight academy + mission CTA styles |
| `package.json` | `vitest`, `test` / `test:watch` scripts |
| `flight-manual/CURRENT-PRODUCT.md` | Shipped home experience |
| `flight-manual/IMPLEMENTATION-STATUS.md` | Begin Flight + pronunciation sync status |
| `flight-manual/architecture/runtime-map.md` | Home composition map |
| `docs/database.md` | `DailyMissionDay` pronunciation field |

### Unchanged (by design)

- `lib/dailyMission.ts` — already canonical; no logic changes
- `components/study/DailyMissionPanel.tsx` — checklist unchanged; now primary panel on home
- `FlightAcademyDashboard.tsx` — retained for reference; not imported from home

---

## Behavior implemented

1. **Home composition (ADR-010)** — `HomePage` imports four components only; no mission business logic.
2. **Primary CTA (ADR-001)** — `MissionCTA` calls `getNextMissionAction()` exclusively; shows **Begin Flight** or **Continue Flight**.
3. **Captain briefing (ADR-009)** — `CaptainBriefing` renders `buildTodayBriefing()` read-only; exam countdown visible.
4. **Mission checklist** — `DailyMissionPanel` remains the matrix-ordered leg list (pronunciation → vocab → part1 → part2 → simulado if intense).
5. **Academy widgets (ADR-011)** — progress, stats, career, recent flights below the mission panel; no leg ordering.
6. **Pronunciation sync (ADR-003)** — `DailyMissionDay.pronunciation` + merge/apply in `dailyMissionSync.ts`.
7. **Deprecations (ADR-007)** — JSDoc on `flightMission`, `FlightAcademyDashboard`, `AcademySessionBridge`, `academy/briefing`.

---

## Tests added

| Suite | Coverage |
|-------|----------|
| `lib/dailyMission.test.ts` | `getDailyMissionSummary()` — standard (4 legs), intense (5 legs), incomplete, complete |
| `lib/dailyMission.test.ts` | `getNextMissionAction()` — pronunciation first, vocab, part1, complete, intense simulado |
| `components/home/HomePage.test.ts` | No `FlightAcademyDashboard`, no `buildDailyFlightMission`, no `getNextMissionAction` in HomePage |

**Run:** `npm test` — 14 tests passing.

---

## Risks

| Risk | Mitigation |
|------|------------|
| DB migration not applied in prod | Run `npm run db:migrate:deploy` before release |
| `FlightAcademyDashboard` still in repo | Marked deprecated; grep confirms home path clean |
| Intense-mode simulado still local-only | By design — not in `DailyMissionDay`; completion via `syncDailyMissionLog` |
| Academy widgets duplicate some dashboard data | Acceptable Sprint 1 scope; widgets are read-only |
| Captain briefing not spoken | Text-only per current voice-off product state |

---

## Remaining gaps (out of Sprint 1 scope)

- Mission Recall leg (Section 08)
- Mission Timeline UI
- TTS / auto-play Captain briefing
- Vocabulary L1–L4 mission parity
- Full removal of deprecated `FlightAcademyDashboard` (Sprint 2+ cleanup)
- `requestDailyMissionSync()` not wired from all leg saves (AuthProvider listens to leg change events instead)

---

## Next recommended sprint

**Sprint 2 — Mission Recall + Debrief polish** (per `IMPLEMENTATION-ROADMAP.md`):

1. Add Mission Recall leg to `getNextMissionAction()` before simulado (intense).
2. Wire Flight Debrief as post-mission step on home completion state.
3. Remove or redirect remaining `buildDailyFlightMission()` consumers outside deprecated files.
4. Captain Delta contextual tips on mission routes (read-only, ADR-009).

---

## Verification checklist

- [x] Home mounts `DailyMissionPanel` as primary experience
- [x] `FlightAcademyDashboard` not on home
- [x] `HomePage` has no business logic
- [x] CTA from `getNextMissionAction()` only
- [x] Matrix order unchanged in `dailyMission.ts`
- [x] Captain briefing on home
- [x] Academy widgets below, no orchestration
- [x] Pronunciation in `DailyMissionDay` sync
- [x] Tests for summary, next action, home composition
- [x] `CURRENT-PRODUCT.md` and `IMPLEMENTATION-STATUS.md` updated
