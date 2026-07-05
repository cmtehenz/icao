# Database

PostgreSQL via Prisma. Schema: `prisma/schema.prisma`.

**Product context:** [`flight-manual/13-learning-memory.md`](../flight-manual/13-learning-memory.md)

---

## Models

### User

```
id, email, passwordHash, name?, createdAt, updatedAt
Relations: vaultWords, evaluations, studyDays, dailyMissionDays
```

### VaultWord

Pronunciation bank per user. Unique on `(userId, word)`.

Fields include accuracy scores, error metadata, practice counts, timestamps.

Client merge: `lib/vaultMerge.ts` — server fields merged with local graduation state.

### Evaluation

Coach session record: type, question, transcript, dimension scores, `icaoLevel`, optional `audioKey`.

### StudyDay

Per-user per-date activity counters:

- `shadowCount`, `shadowPart2Count`
- `simulateCount`, `pronunciationCount`, `vocabularyCount`

Unique on `(userId, date)`.

### DailyMissionDay

`userId` + `date` — synced daily mission state: `pronunciation`, `part1`, `part2`, `vocab` JSON blobs + `complete` flag.

---

## Migrations

```
prisma/migrations/
```

Run locally:

```bash
npx prisma migrate dev
```

Deploy:

```bash
npm run migrate:deploy   # or scripts/migrate-deploy.mjs
```

---

## Client

Generated to `lib/generated/prisma` (see `generator client.output` in schema).

---

## Local-only data (not in Postgres)

| Data | Storage |
|------|---------|
| Daily mission state | localStorage keys `icao_*_daily_mission_*` |
| Vocab SRS | localStorage |
| Simulado history/draft | localStorage |
| Captain Delta memory | localStorage `icao_captain_delta_memory_v3` |
| Instructor memory | localStorage `icao_flight_instructor_memory_v1` |

Sync strategy: optimistic local first, API merge on login.

---

## Neon / production

`DATABASE_URL` in Vercel environment. Connection via Prisma adapter.

---

## 2.0 schema candidates

- `VocabProgress` server model
- `RapidReviewAttempt`
- `SimuladoStepResult` normalized rows

Document in Flight Manual Ch. 13 before migrating.
