# Sprint 1 — First Flight Experience

**Implementation phase begins here.**

**Prerequisites:** ADR-001 through ADR-012 approved · [ARCHITECTURE-LOCK.md](./ARCHITECTURE-LOCK.md)

**Full roadmap:** [IMPLEMENTATION-ROADMAP.md](../IMPLEMENTATION-ROADMAP.md)

---

## Objective

When a pilot opens ICAO Delta, they immediately feel they entered a **professional flight academy** — not an English app or a module picker.

One mission. One Captain. One Begin Flight button. Matrix order respected.

---

## Student experience target

```
Open app
    → Home (composition only)
    → Captain briefing (read-only context)
    → Single Begin Flight / Continue Flight CTA
    → First incomplete leg (pronunciation → vocab → part1 → part2 → [mock if intense])
```

No adaptive leg shuffle. No duplicate orchestration.

---

## Acceptance criteria

| # | Criterion | ADR |
|---|-----------|-----|
| 1 | `DailyMissionPanel` is **primary** home surface | ADR-002 |
| 2 | Single **Begin Flight** CTA → `getNextMissionAction()?.href` only | ADR-010 |
| 3 | Captain Delta **briefing** block (read-only; uses `dailyMission` summary) | ADR-009 |
| 4 | Leg order matches [mission-flow-matrix.md](./mission-flow-matrix.md) | ADR-001, ADR-005 |
| 5 | `HomePage.tsx` contains **no business logic** | ADR-010 |
| 6 | Mission Engine owns **progression** (`dailyMission.ts`) | ADR-004 |
| 7 | Captain **reacts** to events; never writes mission state | ADR-008, ADR-009 |
| 8 | No `buildDailyFlightMission()` on home path | ADR-007 |
| 9 | Pronunciation daily added to server sync bundle | [mission-state-sync.md](./mission-state-sync.md) |
| 10 | Vitest baseline: `getNextMissionAction()` standard + intense | Roadmap |
| 11 | `CURRENT-PRODUCT.md` + `IMPLEMENTATION-STATUS.md` updated | ADR-012 |
| 12 | `runtime-map.md` updated for home + sync | ADR-012 |

---

## In scope

- Rewire `HomePage` → `DailyMissionPanel` primary  
- Deprecate `FlightAcademyDashboard` as home root  
- Extract `AcademyHomeWidgets` (read-only gamification below panel)  
- `MissionCTA` + `CaptainBriefing` components  
- Pronunciation `DailyMissionDay` schema + sync  
- Remove home imports of `flightMission.ts` leg order  
- `@deprecated` JSDoc on deprecated modules (ADR-007)

## Out of scope (later sprints)

- Mission Timeline UI (Sprint 2)  
- Mission Recall (Sprint 3)  
- Unified Flight Debrief terminal leg (Sprint 5)  
- Captain voice TTS (Sprint 14)  
- Physical delete of deprecated files (Sprint 16)

---

## Files expected to change (implementation phase)

| Area | Files |
|------|-------|
| Home | `components/home/HomePage.tsx`, new `MissionCTA`, `CaptainBriefing`, `AcademyHomeWidgets` |
| Mission | `lib/dailyMission.ts` (leg registry refactor optional) |
| Sync | `lib/dailyMissionSync.ts`, `prisma/schema.prisma`, `app/api/daily-mission` |
| Captain | `lib/captainDelta/briefing.ts` |
| Deprecated | Stop importing `FlightAcademyDashboard`, `flightMission` from home |
| Tests | `lib/dailyMission.test.ts` (new) |
| Docs | CURRENT-PRODUCT, IMPLEMENTATION-STATUS, runtime-map |

---

## Definition of done

Sprint 1 is complete when all acceptance criteria are checked and a pilot can:

1. Open `/` and see today’s mission checklist in matrix order.  
2. Tap **Begin Flight** and land on the correct next leg.  
3. Complete a leg and return to see updated progress without wrong leg order.  
4. Switch intense mode and see mock appear **after** part2 in CTA chain.  
5. Log in on second device and see pronunciation daily sync (after Sprint 1 sync work).

---

## Authorization

| Gate | Status |
|------|--------|
| Architecture Lock ADR-001–012 | ✅ Locked |
| Sprint 0 report | ✅ Complete |
| This sprint spec | ✅ Approved with Architecture Final Review |

**Software Implementation Phase — Sprint 1 authorized.**
