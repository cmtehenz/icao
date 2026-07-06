# ADR-003: Mission State Ownership

| Field | Value |
|-------|-------|
| **Status** | Proposed → **Locked on approval** |
| **Date** | July 2026 |
| **Deciders** | Tech Lead |
| **Related** | ADR-001, ADR-004, Section 13, runtime-map |

---

## Context

Mission state is scattered across localStorage keys, Prisma `DailyMissionDay`, academy store, and simulado history. Sprint 0 flagged pronunciation daily as local-only and dual vocab stores.

Without a lock, Sprint 1 could sync state to the wrong layer or duplicate completion flags.

---

## Decision

Mission state follows a **three-tier model**:

### Tier 1 — Per-leg authoritative state (client)

Each leg module owns **read/write** of its daily payload:

| Leg | Module | localStorage key |
|-----|--------|------------------|
| Pronunciation | `lib/pronunciationDailyMission.ts` | `icao_pronunciation_daily_mission_v1` |
| Vocabulary | `lib/vocabDailyMission.ts` | `icao_vocab_daily_mission_v2` |
| Part 1 | `lib/part1DailyMission.ts` | `icao_part1_daily_mission_v2` |
| Part 2 | `lib/part2DailyMission.ts` | `icao_part2_daily_mission_v2` |
| Mock (intense) | `lib/simulado/progress.ts` | `icao-simulado-history` |

Each module **must**:

- Scope state to `todayKey()` from `lib/studyTime.ts`
- Dispatch a `*_DAILY_MISSION_EVENT` on mutation
- Expose `getOrCreate*DailyMission()`, `*DailyMissionProgress()`, `save*DailyMission()`

### Tier 2 — Aggregate mission state (derived)

| Concern | Owner | Storage |
|---------|-------|---------|
| Day complete flag | `lib/dailyMissionLog.ts` | `icao_daily_mission_log_v1` |
| Completion logic | `lib/dailyMission.ts` | Derived from leg progress + intense simulado |
| Study mode | `lib/studyTime.ts` | `icao_study_plan_mode_v1` |
| Today's exam | `lib/dailyExamRotation.ts` | Derived (23C–26C) |

**No leg module** writes to `dailyMissionLog` directly except through established completion hooks called from `dailyMission.ts` or leg completion handlers.

### Tier 3 — Server mirror (authenticated)

| Concern | Owner | Storage |
|---------|-------|---------|
| Bundle sync | `lib/dailyMissionSync.ts` | — |
| API | `app/api/daily-mission/route.ts` | Prisma `DailyMissionDay` |
| Merge | `mergeDailyMissionBundles()` | part1, part2, vocab JSON blobs |

**Sprint 1 requirement:** Extend Tier 3 to include **pronunciation daily** in `DailyMissionDay` (schema migration).

### Explicit exclusions

Mission leg state **must not** live in:

- `lib/academy/store.ts` (`icao_academy_v5`)
- `lib/academy/flightMission.ts`
- Captain Delta memory (`icao_captain_delta_memory_v3`) — may **read** mission summary, not **author** leg completion

Vocabulary SRS (`utils/spacedRepetition.ts`) is **learning state**, not daily mission state — consolidated in Sprint 4, not Sprint 1.

---

## Alternatives considered

| Alternative | Rejected because |
|-------------|------------------|
| **Single `missionState.json` blob** | Breaks per-leg modules and incremental sync |
| **Server-only mission state** | Offline PWA requirement; latency |
| **Academy store as mission source** | Wrong domain; caused TD-02 |
| **Immediate `lib/memory/` migration** | Sprint 15 scope; too large for Sprint 1 |

---

## Consequences

**Positive**

- Clear write boundaries per leg
- Server sync scope is explicit
- Sprint 1 pronunciation sync has defined target

**Negative**

- Multiple localStorage keys remain until unified memory (Sprint 15)
- `dailyMissionSync.missionsComplete()` must be updated when pronunciation joins bundle

---

## Verification

- [ ] Pronunciation daily in `DailyMissionDay` after Sprint 1
- [ ] No mission completion flags in `lib/academy/store.ts`
- [ ] `loadLocalDailyMissionBundle()` includes all synced legs
