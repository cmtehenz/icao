# Architecture

Technical overview of ICAO Delta (current layout — pre-`src/` migration).

---

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| UI | React 19, client components where needed |
| Styles | `app/globals.css` (monolithic CSS) |
| Auth | Session cookies, `lib/auth/` |
| Database | PostgreSQL via Prisma (`prisma/schema.prisma`) |
| AI | OpenAI API (`gpt-4o-mini`) |
| Speech | Azure Cognitive Services (STT, pronunciation, TTS) |
| Deploy | Vercel |

---

## Repository layout (current)

```
icao/                          # Application root (→ src/ in future)
├── app/                       # Next.js routes, API, layout
├── components/                # React components by domain
├── lib/                       # Business logic, integrations
├── hooks/                     # React hooks
├── data/                      # Static exam/vocab datasets
├── prisma/                    # Schema + migrations
├── public/                    # Static files served as-is
├── provas/                    # Source exam audio (copied to public/)
├── flight-manual/             # Product Source of Truth
├── prompts/                   # AI prompt catalog
├── docs/                      # Technical docs (this folder)
└── assets/                    # Media catalog (migration target)
```

**Planned:** move `app/`, `components/`, `lib/`, `hooks/` under `src/` without behavior changes.

---

## Domain modules

| Module | Routes | Core libs |
|--------|--------|-----------|
| Mission | `/` (dashboard) | `lib/dailyMission.ts`, `lib/*DailyMission.ts` |
| Part 1 | `/part1` | `lib/cards.ts`, `lib/peelBlocks.ts`, `lib/part1DailyMission.ts` |
| Part 2 | `/part2` | `lib/part2/`, `data/exams/part2Data.ts` |
| Pronunciation | `/pronunciation` | `lib/pronunciationVault.ts`, `lib/pronunciationGraduation.ts` |
| Vocabulary | `/vocabulario` | `lib/vocabDailyMission.ts`, `utils/spacedRepetition.ts` |
| Simulado | `/simulado` | `lib/simulado/` |
| Listen | `/escutar-prova` | `lib/fullExamListening/` |
| Captain Delta | Global provider | `components/CaptainDelta/`, `lib/captainDelta/` |
| Auth | `/login`, `/conta` | `lib/auth/`, `app/api/auth/` |

---

## Data flow (coach session)

```
Student records audio
  → Azure STT + pronunciation assessment
  → /api/evaluate (scores) + /api/flight-instructor (structured debrief)
  → FlightInstructorReport JSON
  → UI panels + CAPTAIN_DELTA_AFTER_ANSWER event
  → Captain Delta Provider (text debrief; TTS optional)
  → recordInstructorSession → local memory + optional server Evaluation
```

---

## Client state

| Store | Mechanism | Examples |
|-------|-----------|----------|
| Server | Prisma + API | User, VaultWord, Evaluation |
| localStorage | lib modules | Daily missions, vault, simulado history |
| sessionStorage | ephemeral | Pronunciation session progress (legacy) |
| Events | `window.dispatchEvent` | Mission changes, vault sync, Captain Delta |

---

## Key conventions

- `"use client"` on interactive components
- API routes use `requireUser()` for protected endpoints
- Exam version type: `ExamVersion` = `"23C" | "24C" | "25C" | "26C"`
- Daily rotation: `lib/dailyExamRotation.ts`

---

## Related

- Product behavior: [`flight-manual/`](../flight-manual/README.md)
- API detail: [api.md](./api.md)
- Database: [database.md](./database.md)
