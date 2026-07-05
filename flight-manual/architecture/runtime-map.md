# Runtime Map

**Real codebase entry points — July 2026.**

This document describes **current implementation only**. Target folders (`lib/missionEngine/`, `lib/memory/`, etc.) appear in mission chapter Implementation Maps labeled **TARGET** — not here.

Governance: [DOCUMENTATION-HIERARCHY.md](../DOCUMENTATION-HIERARCHY.md)  
Shipped behavior: [CURRENT-PRODUCT.md](../CURRENT-PRODUCT.md)

---

## Mission Engine (current)

```
app/page.tsx → components/home/HomePage.tsx  (composition only, ADR-010)
        ↓
CaptainBriefing · MissionCTA · DailyMissionPanel · AcademyHomeWidgets
        ↓
components/layout/MissionFocusLayout.tsx  (top bar + FlightProgressStrip — mission routes only)
lib/dailyMission.ts
  ├── getDailyMissionSummary()
  ├── getNextMissionAction()
  └── isDailyMissionComplete()
        ↓
lib/flightProgress/buildFlightProgress.ts  →  UI phase strip (read-only)
        ↓
Per-leg modules
  ├── lib/pronunciationDailyMission.ts
  ├── lib/vocabDailyMission.ts
  ├── lib/part1DailyMission.ts
  ├── lib/part2DailyMission.ts
  ├── lib/missionRecall/          (recall leg)
  ├── lib/simulateDailyMission.ts (intense mode only)
  └── lib/flightDebrief/        (closing leg)
        ↓
lib/dailyExamRotation.ts  →  exam 23C–26C
lib/studyTime.ts          →  standard | intense
```

**Routes:** `/mission-recall`, `/flight-debrief`

**API:** `app/api/daily-mission/route.ts` — server sync for `DailyMissionDay` (pronunciation, part1, part2, vocab, **recall**, **debrief**)

**UI:** `components/study/DailyMissionPanel.tsx`, `components/layout/MissionFocusLayout.tsx`, `components/FlightProgressStrip/`, `components/MissionRecall/`, `components/FlightDebrief/`, `components/home/MissionCTA.tsx`

**Deprecated for home:** `FlightAcademyDashboard`, `lib/academy/flightMission.ts` (ADR-007)

**TARGET (not built):** `lib/missionEngine/`, `components/MissionBoard/`, full Mission Timeline learning tool, Replay Debrief clips

---

## Captain Delta (current)

```
components/AppShell.tsx
  ├── isMissionFocusRoute() → MissionFocusLayout (/, /pronunciation, /vocabulario, /part1, /part2, /mission-recall, /flight-debrief, /simulado)
  └── LegacyAppLayout (sidebar + bottom nav) → /conta, /escutar-prova, /structure, …
        ↓
components/CaptainDelta/CaptainDeltaProvider.tsx
  ├── events: CAPTAIN_DELTA_* (lib/captainDelta/events.ts)
  ├── memory: lib/captainDelta/memory/*
  ├── visual: lib/captainDelta/visual/*
  ├── examiner: lib/captainDelta/examiner/*
  └── voice: lib/captainDelta/voiceConfig.ts  (TTS disabled)
        ↓
components/CaptainDelta/CaptainDeltaFloatingAssistant.tsx
components/CaptainDelta/Visual/CaptainDeltaVisualBridge.tsx
```

**TARGET (not built):** `lib/captainDelta/orchestrator.ts` as single orchestrator module

---

## AI routes (current)

| Route | Library | Prompt source | Role |
|-------|---------|---------------|------|
| `POST /api/flight-instructor` | `lib/flightInstructor/` | `prompts/debrief.md` | Structured JSON debrief |
| `POST /api/captain-delta` | inline + `lib/captainDelta/` | `prompts/captain-delta.md` | Screen coach (PTT) |
| `POST /api/evaluate` | `lib/evaluate/` | `prompts/part1.md`, `part2.md` | Scoring + feedback |
| `POST /api/evaluate-answer` | — | — | Answer evaluation variant |

**Local fallbacks** when `OPENAI_API_KEY` missing — deterministic copy in libs.

**TARGET (vision):** separate agents per [14-ai-brain.md](../14-ai-brain.md) — see [ai-architecture.md](./ai-architecture.md)

---

## Azure / speech (current)

| Concern | Entry |
|---------|--------|
| Pronunciation assessment | `lib/azure/pronunciation.ts`, `app/api/pronunciation-assessment/route.ts` |
| STT | `app/api/stt/route.ts`, `app/api/azure-speech-token/route.ts` |
| TTS | `app/api/tts/route.ts` |
| Client coach copy | `lib/pronunciationCoach.ts` |

---

## Pronunciation mission (current)

| Concern | Path |
|---------|------|
| Vault + stats | `lib/pronunciationVault.ts` |
| Graduation L1–L4 | `lib/pronunciationGraduation.ts` |
| Daily 5 words | `lib/pronunciationDailyMission.ts` |
| Context sentences | `lib/pronunciationContext.ts` |
| Server vault sync | `app/api/vault/route.ts`, `lib/vaultMerge.ts` |
| UI | `components/VoiceCoachPanel.tsx`, pronunciation routes under `app/` |

**TARGET:** `lib/pronunciationVault/` as folder module — today single files at `lib/` root

---

## Vocabulary mission (current)

| Concern | Path |
|---------|------|
| Daily mission | `lib/vocabDailyMission.ts` |
| VB graduation | `lib/vocabGraduation.ts` |
| Captain coaching | `lib/vocabCoach.ts` |
| Mission debrief data | `lib/vocabMission.ts` |
| Mission UI | `components/VocabularyTrainer/VocabMissionPanel.tsx` |
| SRS / recordings | `utils/spacedRepetition.ts`, `lib/vocabRecordings.ts` |
| Route | `app/vocabulario/` |

---

## Part 1 mission (current)

| Concern | Path |
|---------|------|
| Daily mission | `lib/part1DailyMission.ts` |
| Cards | `lib/cards.ts` |
| PEEL blocks | `lib/peelBlocks.ts` |
| Human examiner (HEX) | `lib/humanExaminer/` |
| Coach UI | `components/VoiceCoachPanel.tsx` |
| Route | `app/part1/` |

**HEX flow:** Question → student speaks → examiner follow-up (contextual) → … → conversation ends → Captain Delta debrief. Captain is invisible during the examiner conversation but **visible in standby** (listening / preparing debrief).

**AI Presence (Sprint 6.1):** `lib/aiPresence/` + `components/aiPresence/` — persistent indicator in `MissionFocusLayout`, examiner panel in `VoiceCoachPanel`.

---

## Part 2 mission (current)

| Concern | Path |
|---------|------|
| Daily mission | `lib/part2DailyMission.ts` |
| Simulation | `lib/part2/` |
| Exam data | `data/exams/part2Data.ts` |
| Warmup from vault | `lib/part2Warmup.ts` |
| Route | `app/part2/` |

---

## Mock Exam / simulado (current)

| Concern | Path |
|---------|------|
| Intense daily step | `lib/simulateDailyMission.ts` |
| Build steps | `lib/simulado/buildSteps.ts` |
| Progress / history | `lib/simulado/progress.ts` |
| Route | `app/simulado/` |

---

## Passive / audio (current)

| Concern | Path |
|---------|------|
| Escutar Prova | `app/escutar-prova/` |
| Exam audio assets | `public/`, `provas/` |

**TARGET:** Passive modes from Section 11 — not orchestrated in `dailyMission.ts`

---

## Learning Memory (current)

Product concept: [13-learning-memory.md](../13-learning-memory.md)

**Actual storage today:**

| Data | Location |
|------|----------|
| Instructor memory | localStorage + `lib/captainDelta/memory/store.ts` |
| Captain session context | `lib/captainDelta/memory/*` |
| Vault words | PostgreSQL `VaultWord` + client cache |
| Evaluations | PostgreSQL `Evaluation` + `app/api/evaluations/` |
| Study activity | PostgreSQL `StudyDay`, `DailyMissionDay` |
| Simulado history | localStorage `lib/simulado/progress.ts` |
| Vocab SRS | localStorage via `lib/vocabProgress.ts` |

**TARGET:** unified `lib/memory/` tree with sync engine — **no files exist yet**

---

## Database (current)

```
prisma/schema.prisma
        ↓
lib/generated/prisma
```

Models: `User`, `VaultWord`, `Evaluation`, `StudyDay`, `DailyMissionDay`

Technical schema doc: [docs/database.md](../../docs/database.md)

---

## Auth (current)

| Route | Lib |
|-------|-----|
| `app/api/auth/login` | `lib/auth/` |
| `app/api/auth/register` | |
| `app/api/auth/logout` | |
| `app/api/auth/me` | |

Session cookies; see [docs/api.md](../../docs/api.md)

---

## Implementation Map convention (all chapters)

Every Flight Manual Implementation Map must use two sections:

```markdown
## Current Implementation
(real paths — or “not built”)

## Target Architecture
(aspirational modules — may not exist)
```

This runtime map is the **index of Current Implementation** for the whole product.

---

## Related

- [data-flow.md](./data-flow.md) — data movement narrative  
- [ai-architecture.md](./ai-architecture.md) — spec vs production AI  
- [folder-structure.md](./folder-structure.md) — repo layout  
- [mission-flow-matrix.md](./mission-flow-matrix.md) — canonical leg order
