# Current Product

**What ICAO Delta actually is today** (production codebase, July 2026).

This document describes **shipped behavior only**. Vision lives in [18-product-roadmap.md](./18-product-roadmap.md). Spec vs gap: [IMPLEMENTATION-STATUS.md](./IMPLEMENTATION-STATUS.md).

---

## Product identity (shipped)

- **AI Flight Training Platform** — Digital Flight Academy positioning in copy and Flight Manual.
- **Program 1: ICAO English** — the only training program implemented today (implicit; no `programId` in code yet).
- **Daily mission** on home — **Begin Flight / Continue Flight** CTA from `getNextMissionAction()`; phase track via embedded **Flight Progress Strip** (no duplicate leg list).
- **Captain Delta briefing** on home (`CaptainBriefing` — concise greeting + today's exam; countdown widget; phase via progress strip).
- **Flight Progress Strip** on home (`FlightProgressStrip` — embedded aviation phase track + ETA from `getDailyMissionSummary()`).
- **Captain Delta** floating coach with text debrief; **voice/TTS disabled**; **proactive coaching UI enabled** (Presence over Activity — Sprint 6.1).
- **Exam rotation** 23C → 24C → 25C → 26C by calendar day.

**Training Programs:** [21-training-programs.md](./21-training-programs.md) — ICAO English is Program 1 only in production; other programs documented, not shipped.

---

## Implemented modules

| Module | Route | What works |
|--------|-------|------------|
| Home / flight mission | `/` | **Mission Focus layout** — embedded progress strip, concise briefing + primary CTA, records collapsed (no sidebar) |
| Mission Recall | `/mission-recall` | Active recall — Azure speech capture + transcript per item, “Mark as answered” fallback |
| Flight Debrief | `/flight-debrief` | End-of-flight debrief — legs, recall result, strongest/weakest area, priority improvement, tomorrow focus |
| Pronunciation | `/pronunciation` | Mission Focus leg — L1–L4 practice, Azure assessment, daily 5-word mission (pass ≥80% counts), auto-advance, debrief → Vocabulary; Captain FAB record bridge; English mission copy |
| Vocabulary | `/vocabulario` | Mission Focus TAXI leg — VB-1→VB-4 daily mission (20 terms), mission-through flow, Captain FAB record bridge, debrief → Part 1; content-only shell |
| Part 1 | `/part1` | 42 cards, PEEL shadow, **human examiner conversation** with continuous AI presence, Captain debrief after conversation, flight progress strip |
| Part 2 | `/part2` | Readback, interaction, reported, picture drills, full simulation, flight progress strip |
| Simulado | `/simulado` | Full exam flow Parts 1–4 config; P1–2 primary; examiner debrief optional |
| Escutar Prova | `/escutar-prova` | Exam audio playlist, offline pack download |
| Listen / structure / account | various | Supporting routes |
| Auth | `/login`, `/conta` | Email auth, session, profile |

---

## Mission Engine (implemented)

**Order in `getNextMissionAction()`:**

1. Pronunciation — 5 words (`lib/pronunciationDailyMission.ts`)
2. Vocabulary — 20 terms (`lib/vocabDailyMission.ts`)
3. Part 1 — 3 cards, shadow then coach (`lib/part1DailyMission.ts`)
4. Part 2 — full simulation (`lib/part2DailyMission.ts`)
5. Mission Recall — today's material only (`lib/missionRecall/`)
6. Mock Exam — only if study mode **intense** (`lib/simulateDailyMission.ts`)
7. Flight Debrief — closes the day (`lib/flightDebrief/`)

**Mission complete** requires all required legs **and** Flight Debrief (`isDailyMissionComplete()`).

**Not implemented:** Full Mission Timeline learning tool, TTS briefing auto-play, Replay Debrief clips.

**Shipped (Sprint 3):** Flight Progress Strip — aviation phase labels, current/completed/upcoming states, optional Check Ride in standard mode, estimated remaining time.

**Shipped (Sprint 4):** Mission Recall Azure speech; recall/debrief sync; flight progress strip on mission routes; deeper Flight Debrief.

**Shipped (Sprint 6.1):** Continuous AI Presence — persistent status indicator, examiner banner, conversation progress, Captain standby, thinking state, graceful transitions; voice independent from intelligence.

**Shipped (UX Focus):** Mission Focus Layout — sidebar and bottom nav removed during daily flight; minimal top bar + flight progress strip on mission routes.

**Shipped (Sprint 6):** Part 1 Human Examiner Experience (HEX) — contextual follow-ups, conversation memory, recovery mode, natural conversation end; Captain invisible during examination; Flight Debrief conversation metrics.

**Shipped (Sprint 5):** Vocabulary mission parity — VB-1→VB-4 graduation per daily term, `VocabMissionPanel`, Captain coaching on attempts, debrief vocabulary insights; daily checklist shows VB progress.

---

## Captain Delta (implemented)

| Behavior | Status |
|----------|--------|
| Floating panel + coaching card | ✅ |
| Post-answer debrief via Flight Instructor API | ✅ |
| Simulation debrief event | ✅ |
| Pronunciation inline feedback | ✅ (panel optional when voice off) |
| Pronunciation FAB record bridge | ✅ Sprint 7.1 — mic PTT + Continue → next word or Vocabulary |
| Vocabulary FAB record bridge | ✅ Sprint 8.2 — mic PTT + Continue → next term or Part 1 |
| Proactive tips on navigation | 🟡 enabled (UI); TTS off |
| Home briefing auto-play on load | 🟡 card via proactive; TTS off |
| TTS / Play controls | ❌ hidden |
| Examiner intro/debrief in simulado | ✅ text |
| Visual highlights (keywords, syllables) | ✅ partial, context-scoped |
| PTT screen coach → `/api/captain-delta` | ✅ |
| Home briefing (text) | ✅ read-only on `/` |
| Continuous AI presence indicator | ✅ mission routes + HEX |
| Captain standby during oral assessment | ✅ Sprint 6.1 |

---

## AI (implemented)

| Endpoint | Model | Purpose |
|----------|-------|---------|
| `/api/flight-instructor` | gpt-4o-mini | Structured JSON debrief after recordings |
| `/api/captain-delta` | gpt-4o-mini | Short screen-coach replies |
| `/api/evaluate` | gpt-4o-mini | Scoring + feedback |
| Local fallbacks | — | When `OPENAI_API_KEY` missing |

**Not implemented:** separate agents from [14-ai-brain.md](./14-ai-brain.md) (Mission Planner, Replay Analyzer, etc.) as distinct services.

Prompt catalog: [`prompts/`](../prompts/)

---

## Azure (implemented)

| Feature | Usage |
|---------|--------|
| Speech-to-text | Recording transcription |
| Pronunciation assessment | Word/sentence scoring, vault auto-add &lt;40% |
| Neural TTS | Model answers, optional Captain voice (off) |
| Exam audio | Pre-recorded ATC + generated clips in Escutar Prova |

---

## Database (implemented)

PostgreSQL via Prisma:

- `User`, `VaultWord`, `Evaluation`, `StudyDay`, `DailyMissionDay`

LocalStorage (client):

- Daily mission state per module, SRS vocab, simulado history/drafts, instructor memory, Captain Delta memory

---

## UX (implemented)

- Mobile-first PWA (`public/sw.js`)
- Daily mission panel with standard / intense modes
- Home: Mission Focus shell — embedded progress strip, concise briefing + single primary CTA; records & insights in collapsed `<details>`
- Theme toggle
- Teacher report, progress trends, daily debrief panel
- Part 2 warmup banner from pronunciation vault
- Captain Delta does not block clicks (visual bridge loop fixed)

---

## Next priorities (product — not committed dates)

1. **Mission Recall** — Section 08 before mock on intense days
2. **Vocabulary Mission parity** — VB-1→VB-4 shipped (Sprint 5); VB-5 conversation still planned
3. **Part 1 conversation** — HEX shipped (Sprint 6); examiner profiles + deeper operational graph refs later
4. **Captain voice** — re-enable with proactive rules from Section 02
6. **Learning tools** — Confidence Gates + Mission Timeline (see roadmap)

---

## What this document is not

- Not a specification of future features
- Not a substitute for [IMPLEMENTATION-STATUS.md](./IMPLEMENTATION-STATUS.md)
- Not technical API docs — see [`docs/`](../docs/)

Update when releasing significant changes to production behavior.
