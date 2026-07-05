# Mission State Synchronization

**Authoritative sync model — post Architecture Lock.**

**Related:** ADR-008, ADR-003, [runtime-map.md](./runtime-map.md)

---

## Preferred architecture

```
Mission Engine (leg APIs write)
        ↓
Optimistic Local Storage (cache)
        ↓
Background Sync (requestDailyMissionSync)
        ↓
Server (PostgreSQL via API)
        ↓
Conflict Resolution (merge functions)
        ↓
Local Update (applyDailyMissionBundle)
```

---

## Principles

| Principle | Rule |
|-----------|------|
| **Local first** | App works offline; writes hit localStorage immediately |
| **Server authoritative** | For authenticated users, merged server bundle wins on conflict |
| **Cache semantics** | localStorage is a **cache**, not the long-term source of truth for logged-in users |
| **Engine-only writes** | Only Mission Engine domain mutates mission keys (ADR-008) |
| **Event-driven refresh** | Leg modules emit `*_DAILY_MISSION_EVENT`; UI re-reads summary |

---

## Layers

### 1. Mission Engine (origin)

Leg completion flows:

```
Trainer UI action
    → leg API (e.g. markVocabTermComplete)
    → save*DailyMission(state)
    → localStorage
    → emit *_DAILY_MISSION_EVENT
    → requestDailyMissionSync() [if authenticated]
```

### 2. Optimistic local storage

| Leg | Key | Synced today |
|-----|-----|--------------|
| Pronunciation | `icao_pronunciation_daily_mission_v1` | ❌ → Sprint 1 |
| Vocabulary | `icao_vocab_daily_mission_v2` | ✅ |
| Part 1 | `icao_part1_daily_mission_v2` | ✅ |
| Part 2 | `icao_part2_daily_mission_v2` | ✅ |
| Day log | `icao_daily_mission_log_v1` | Partial via bundle log |
| Mock | `icao-simulado-history` | ❌ (Sprint 15 candidate) |

### 3. Background sync

| Component | Role |
|-----------|------|
| `requestDailyMissionSync()` | Dispatches `DAILY_MISSION_SYNC_EVENT` |
| `AuthProvider` | Listens; GET/PUT `/api/daily-mission` |
| `loadLocalDailyMissionBundle()` | Packages local state for upload |
| `mergeDailyMissionBundles()` | Conflict resolution |

Trigger sync after:

- Leg mutation (debounced)
- Login / session restore
- Not on every keystroke

### 4. Server

**Model:** `DailyMissionDay` (Prisma)

```text
userId + date → JSON: part1, part2, vocab, [pronunciation Sprint 1], complete
```

**API:** `app/api/daily-mission/route.ts`

Server is **authoritative** when:

- User is authenticated
- Merge completes successfully

### 5. Conflict resolution

Per-field merge (existing in `dailyMissionSync.ts`):

| Field | Strategy |
|-------|----------|
| `date` | Latest calendar date wins for “today” payload |
| Part 1 cards | Union `shadowDone` / `coachDone` per cardNum (OR) |
| Part 2 | `simulationDone` OR |
| Vocab | Union `completedIds`; prefer richer `termIds` set |
| `complete` | OR across local/remote/log |
| `log` | Union date keys |

**Rule:** Never drop completed work — merge favors **more progress**.

### 6. Local update after merge

`applyDailyMissionBundle()`:

- Sets `applyingRemote` guard to prevent sync loops
- Writes merged state to localStorage
- Emits leg change events indirectly via saves
- Does **not** push to server (caller pulls again)

---

## Offline mode

| Scenario | Behavior |
|----------|----------|
| No network | Full mission on local cache; complete day locally |
| Login after offline | Upload bundle; merge with server; apply result |
| Conflict | More progress wins per merge rules |
| Unauthenticated | Local only; no server authority |

---

## Non-mission data (out of scope)

These follow separate sync paths — **not** `dailyMissionSync`:

| Data | Sync |
|------|------|
| Vault | `/api/vault` |
| Study activity | `/api/study-time` |
| Evaluations | `/api/evaluations` |
| Captain memory | Local only (Sprint 15) |
| Vocab SRS | Local only (Sprint 4/15) |

---

## Sprint 1 alignment tasks

1. Add `pronunciation` JSON to `DailyMissionDay` schema  
2. Extend `loadLocalDailyMissionBundle` / merge / `missionsComplete`  
3. Call `requestDailyMissionSync()` from pronunciation leg saves  
4. Update `runtime-map.md` and CURRENT-PRODUCT when done  

---

## Verification

- [ ] Two-device test: complete vocab on A, sync on B, progress appears  
- [ ] Offline complete → online login → server matches local  
- [ ] `isApplyingRemoteDailyMission()` prevents echo sync loops
