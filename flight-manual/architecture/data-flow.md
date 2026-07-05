# Data Flow

**How information moves** through ICAO Delta at runtime.

---

## Recording → debrief

```
1. Student records (browser MediaRecorder)
2. Azure Speech SDK → transcript + pronunciation scores
3. Client calls POST /api/evaluate
4. Client calls POST /api/flight-instructor
5. FlightInstructorReport JSON returned
6. UI renders coach panels
7. emitCaptainDeltaAfterAnswer → Captain Delta panel
8. recordInstructorSession():
   - localStorage instructor memory
   - pronunciationMistakes map
   - optional POST evaluation to server
9. Weak words (<40%) → pronunciation vault (client)
10. Mission daily flags updated (shadow/coach/vocab/pron)
11. syncDailyMissionLog if all sections complete
```

---

## Daily mission state

| Data | Storage | Sync |
|------|---------|------|
| Pronunciation daily words | localStorage `icao_pronunciation_daily_mission_v1` | — |
| Vocab daily | localStorage `icao_vocab_daily_mission_v2` | — |
| Part 1 daily | localStorage `icao_part1_daily_mission_v2` | — |
| Part 2 daily | localStorage `icao_part2_daily_mission_*` | — |
| Mission log | localStorage `icao_daily_mission_log_v1` | API daily-mission |
| Exam rotation | computed from date | — |

---

## Vault sync

```
Client vault (localStorage)
  ↔ merge on login
POST/GET /api/vault
  ↔ Prisma VaultWord
```

Merge rules: `lib/vaultMerge.ts` — preserves graduation fields.

---

## Captain Delta memory

```
Session events → CAPTAIN_DELTA_SESSION_RECORD
  → recordCaptainDeltaSession
  → localStorage icao_captain_delta_memory_v3

Instructor sessions → icao_flight_instructor_memory_v1
  → buildMemoryContextForPrompt() for next API calls
```

Product spec: [13-learning-memory.md](../13-learning-memory.md)

---

## Simulado

```
buildSimuladoSteps(examVersion) → steps[]
Session draft → localStorage
Results → saveSimuladoReport → history
Intense day complete → simulateMissionProgress
```

---

## Azure audio

```
Exam MP3 paths → public/provas, public/exams
TTS → /api/azure/speech or client SDK token
Escutar Prova → examAudioPipeline → Cache API offline
```

---

## What does not flow yet

- Mission Recall results → Mission Readiness
- Replay Debrief clips → Flight Logbook UI
- Situation Board aggregation → single debrief view
- Server-side Learning Memory unified API

See [IMPLEMENTATION-STATUS.md](../IMPLEMENTATION-STATUS.md).

---

## Related

- [docs/database.md](../../docs/database.md) — Prisma schema
- [docs/api.md](../../docs/api.md) — routes
