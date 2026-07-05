# ADR-008: Single Source of Truth (Mission State)

| Field | Value |
|-------|-------|
| **Status** | **Locked** |
| **Date** | July 2026 |
| **Deciders** | Chief Product Architect, Staff Engineer |
| **Supersedes** | — (extends ADR-003, ADR-004) |
| **Related** | ADR-009, [mission-state-sync.md](../mission-state-sync.md) |

---

## Context

Mission state is written from trainers, sync layers, academy store, and Captain Delta memory. Without a write-authority lock, Sprint 1+ will reintroduce dual orchestration and silent mission completion.

The Flight Manual requires one Mission Engine (Section 03). The student never chooses the next activity (Rule 2, Section 99).

---

## Decision

### Mission Engine is the only write authority for mission state

**Mission Engine domain** (the only code allowed to **mutate** daily mission state):

| Module | Role |
|--------|------|
| `lib/dailyMission.ts` | Orchestration, completion derivation |
| `lib/pronunciationDailyMission.ts` | Pronunciation leg mutations |
| `lib/vocabDailyMission.ts` | Vocabulary leg mutations |
| `lib/part1DailyMission.ts` | Part 1 leg mutations |
| `lib/part2DailyMission.ts` | Part 2 leg mutations |
| `lib/simulateDailyMission.ts` | Intense mock leg completion |
| `lib/dailyMissionLog.ts` | Day-complete flag |
| `lib/dailyMissionSync.ts` | Server merge apply (remote → local) |

Future legs (Recall, Debrief) add modules **inside this domain** and register in `dailyMission.ts`.

### Read-only consumers (must never mutate mission state)

| Layer | Allowed | Forbidden |
|-------|---------|-----------|
| **Captain Delta** | Read `getDailyMissionSummary()`, `getNextMissionAction()` for copy/CTAs | `save*DailyMission()`, mark complete, skip legs |
| **UI (Home, panels)** | Read APIs; navigate via `getNextMissionAction()?.href` | Local leg-order logic; writing mission keys |
| **Learning Memory** | Record sessions **after** missions; read for personalization | Authoritative mission completion |
| **Achievements** | React to `STUDY_ACTIVITY_RECORDED_EVENT` | Unlock mission legs; mark daily complete |
| **Mission Timeline** | Read summary for display (Sprint 2+) | Advance legs; hide incomplete legs as complete |
| **Flight Instructor / Evaluate** | Persist evaluations | Mark part1/part2 daily mission done |

### Mutation rule

Mission state may change **only** through:

1. **Official leg APIs** — e.g. `savePronunciationDailyMission()`, `markVocabTermComplete()`, functions exported from `*DailyMission.ts` modules  
2. **Sync apply** — `applyDailyMissionBundle()` after server merge (Mission Engine sync layer)  
3. **Future Mission Engine commands** — e.g. `missionEngine.completeLeg('pronunciation')` if refactored — still within Mission Engine domain

Direct `localStorage.setItem` on mission keys from outside Mission Engine domain is **forbidden**.

---

## Rationale

| Principle | Why |
|-----------|-----|
| **One flight, one controller** | Section 03 — Captain plans; engine executes |
| **Decoupled Captain** | Instructor interprets; does not grade-by-fiat (ADR-009) |
| **Testable progression** | Single write surface → Vitest on leg APIs + `getNextMissionAction()` |
| **Multi-device integrity** | Sync layer applies server truth without UI inventing merges |

---

## Future examples

| Scenario | Correct | Incorrect |
|----------|---------|-----------|
| Student finishes pronunciation word | `pronunciationDailyMission.ts` marks word → emits `PRONUNCIATION_DAILY_MISSION_EVENT` | Captain Delta sets `completedWords` in memory store |
| Captain suggests “continue to vocabulary” | Read `getNextMissionAction()` for href | Captain calls `saveVocabDailyMission()` |
| Achievement “5-day streak” | `lib/academy/achievements.ts` reads study log | Achievement marks `dailyMissionLog` complete |
| Timeline shows leg 3 active | Timeline reads `getDailyMissionSummary()` | Timeline sets `part1.coachDone` |
| Offline practice completes | Leg API writes local cache → `requestDailyMissionSync()` | UI writes Prisma directly |
| Mission Recall (Sprint 3) | `lib/missionRecall.ts` records recall pass; engine updates pipeline | Recall component skips to mock without engine |

---

## Sync alignment

Local storage is an **optimistic cache**. Server is **authoritative for authenticated shared state** when online. See [mission-state-sync.md](../mission-state-sync.md).

Until Sprint 1 completes pronunciation sync, local remains sole source for that leg — documented gap, not permission for other layers to write.

---

## Alternatives rejected

| Alternative | Why rejected |
|-------------|--------------|
| Captain completes missions when student answers well | Violates instructor vs examiner separation |
| UI writes mission state for speed | Causes TD-01/TD-02 class bugs |
| Learning Memory as mission store | Conflates pedagogy memory with leg completion |

---

## Verification

- [ ] No `save*DailyMission` imports in `lib/captainDelta/**` (except sync)
- [ ] No mission key writes in `components/home/**`
- [ ] Achievements do not import `*DailyMission.ts` save functions
