# ICAO Delta — Master Implementation Roadmap

**Sprint 0 deliverable · July 2026**

**Authority:** Flight Manual (frozen) → [CURRENT-PRODUCT.md](./CURRENT-PRODUCT.md) → [IMPLEMENTATION-STATUS.md](./IMPLEMENTATION-STATUS.md) → `docs/` → source code.

**Canonical sequence:** [architecture/mission-flow-matrix.md](./architecture/mission-flow-matrix.md)  
**Code entry points:** [architecture/runtime-map.md](./architecture/runtime-map.md)

This document closes the gap between specification and implementation. It does **not** change product behavior — it plans how to build what the Flight Manual already defines.

---

## Executive summary

| Metric | Value |
|--------|-------|
| **Planning horizon** | ~6 months (16 two-week sprints) |
| **Team assumption** | 2–4 engineers + 1 product reviewer per sprint |
| **Critical path** | Mission Engine unification → Mission Recall → Flight Debrief → Vocabulary L1–L4 → Part 1 P1-6 |
| **Highest risk** | Dual home/mission UX (`FlightAcademyDashboard` vs `DailyMissionPanel` vs `dailyMission.ts`) |
| **Lowest risk** | Pronunciation PR-1–PR-4 polish, Escutar Prova extensions, auth/sync hardening |
| **Test infrastructure** | **None today** — Sprint 1 must establish baseline |

---

## Implementation dependency graph

```
                    ┌─────────────────────────────────────┐
                    │  Sprint 1: First Flight Experience │
                    │  (orchestrator + home + briefing)  │
                    └──────────────┬──────────────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         ▼                         ▼                         ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────┐
│ Sprint 2        │    │ Sprint 3        │    │ Sprint 4            │
│ Begin Flight +  │    │ Mission Recall  │    │ Vocabulary VB-1–4   │
│ Mission Timeline│    │ (Section 08)    │    │ + Captain debrief   │
└────────┬────────┘    └────────┬────────┘    └──────────┬──────────┘
         │                        │                        │
         └────────────────────────┼────────────────────────┘
                                  ▼
                    ┌─────────────────────────────────────┐
                    │  Sprint 5: Unified Flight Debrief   │
                    │  (Section 10 end-of-flight)         │
                    └──────────────┬──────────────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         ▼                         ▼                         ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────┐
│ Sprint 6        │    │ Sprint 7        │    │ Sprint 8            │
│ PA framework +  │    │ Part 1 P1-6     │    │ Mock Exam P3–P4     │
│ Confidence Gates│    │ conversation    │    │ + examiner polish   │
└────────┬────────┘    └────────┬────────┘    └──────────┬──────────┘
         │                        │                        │
         └────────────────────────┼────────────────────────┘
                                  ▼
                    ┌─────────────────────────────────────┐
                    │  Sprints 9–13: Learning tools wave  │
                    │  Quick Notes, Visual, Replay,       │
                    │  Readiness, Passive, Situation Board│
                    └──────────────┬──────────────────────┘
                                   ▼
                    ┌─────────────────────────────────────┐
                    │  Sprints 14–16: Platform hardening  │
                    │  Voice, Memory sync, Design system, │
                    │  tests, debt reduction              │
                    └─────────────────────────────────────┘
```

**Coding order ≠ Flight Manual leg order.** The Mission Engine must be unified before Recall, Debrief, or Timeline can slot into `getNextMissionAction()`.

---

## Chapter gap analysis (04–12)

Complexity: **S** = ≤1 week · **M** = 1–2 weeks · **L** = 2–4 weeks · **XL** = 4+ weeks (single squad)

---

### Chapter 04 — Pronunciation Mission

| Area | Current | Target (Flight Manual) | Gap | Complexity |
|------|---------|------------------------|-----|------------|
| **UX** | `PronunciationTrainerApp`, `PronunciationWordsMode`, L1–L4 UI | PR-1–PR-4 graduation + PR-5 conversation; mission debrief batch | PR-5 conversation leg; richer Captain batch debrief | M |
| **APIs** | `/api/pronunciation-assessment`, `/api/vault` | Same + mission completion webhook | None critical | S |
| **Azure** | Client + server pronunciation assessment | Word, expression, sentence scoring | ✅ | — |
| **Captain Delta** | Inline feedback; voice off | Per-word coach + mission-end debrief | Mission-end Captain summary | M |
| **Daily Mission** | 5 words/day, local only | 5 words, synced, in orchestrator | Not in `DailyMissionDay` sync | M |
| **Learning Memory** | Vault → server; weak syllables local | Full pronunciation memory in Learning Memory | Captain memory integration partial | M |
| **Debrief** | Per-recording via Flight Instructor | Batch pronunciation summary in Flight Debrief | End-of-mission aggregation | M |
| **Tests** | None | Unit: graduation rules; integration: vault merge | All | M |

**Dependencies:** Mission Engine (Sprint 1), Captain Delta debrief patterns (Sprint 5)  
**Risks:** Vault merge conflicts; graduation state vs daily mission desync

---

### Chapter 05 — Vocabulary Mission

| Area | Current | Target | Gap | Complexity |
|------|---------|--------|-----|------------|
| **UX** | SRS flashcards, shadowing, daily checklist | VB-1–VB-4 levels + VB-5 conversation; spoken-first | **Entire L1–L4 mission UX missing** | **L** |
| **APIs** | None vocab-specific | Evaluate + Flight Instructor for spoken levels | New evaluate flows per level | M |
| **Azure** | TTS for shadowing | Pronunciation on operational phrases | Partial | S |
| **Captain Delta** | None in vocab flow | Captain teaches + debriefs each term | **Full Captain integration** | L |
| **Daily Mission** | 20 terms/day, synced | Same + level progression per term | Level state machine | L |
| **Learning Memory** | `utils/spacedRepetition.ts` + duplicate `lib/vocabProgress.ts` | Single SRS + vocab memory | **Consolidate stores** | M |
| **Debrief** | None | Vocabulary summary in Flight Debrief | Aggregation | M |
| **Tests** | None | SRS scheduling; daily mission selection | All | M |

**Dependencies:** Pronunciation graduation patterns (reuse), Progressive Assistance framework (Sprint 6), Mission Engine  
**Risks:** Dual vocab progress keys; breaking existing SRS data on migration

---

### Chapter 06 — Part 1 Mission

| Area | Current | Target | Gap | Complexity |
|------|---------|--------|-----|------------|
| **UX** | PEEL shadow + coach; 3 cards/day | P1-1–P1-5 PEEL + **P1-6 Examiner Conversation** | **P1-6 adaptive follow-up** | **XL** |
| **APIs** | `/api/evaluate`, `/api/flight-instructor` | + follow-up question generation | Adaptive Conversation Engine | L |
| **Azure** | STT + evaluate | Same for multi-turn conversation | Multi-turn session state | M |
| **Captain Delta** | Post-answer debrief | Assistance level auto-reduction; conversation mode | Confidence Gates + level controller | L |
| **Daily Mission** | 3 cards shadow+coach | Same + conversation requirement | P1-6 completion criteria | M |
| **Learning Memory** | `icao_flight_instructor_memory_v1` | Part 1 weak topics → tomorrow | Partial | M |
| **Debrief** | Per-answer | Replay moment + one priority (Section 10) | Replay Debrief integration | M |
| **Tests** | None | PEEL scoring; peel block progression | All | M |

**Dependencies:** Confidence Gates (Sprint 6), Adaptive Conversation Engine, Captain Delta  
**Risks:** Section 06 v5 is large; PEEL must remain shipped while P1-6 is added incrementally

---

### Chapter 07 — Part 2 Mission

| Area | Current | Target | Gap | Complexity |
|------|---------|--------|-----|------------|
| **UX** | Readback, interaction, reported, full simulation | P2-1–P2-5; Quick Notes operational | Quick Notes enforcement; P2-4 prompts | M |
| **APIs** | `/api/evaluate` (readback types) | Element-level readback scoring | ✅ mostly | S |
| **Azure** | STT | Same | ✅ | — |
| **Captain Delta** | Coaching on simulation steps | ATC instructor persona in simulation | Partial in FullSimulationMode | M |
| **Daily Mission** | Full simulation completion flag | 5 situations/day narrative | Align count with spec copy | S |
| **Learning Memory** | Part 2 progress local | Situation weaknesses → memory | Partial | M |
| **Debrief** | Per-step evaluate | Simulation highlight replay | Replay Debrief | M |
| **Tests** | None | `readbackScore.ts`, simulation steps | All | M |

**Dependencies:** Quick Notes tool (Sprint 9), Mission Engine  
**Risks:** `VoiceCoachPanel` mega-component makes Part 2 changes costly

---

### Chapter 08 — Mission Recall

| Area | Current | Target | Gap | Complexity |
|------|---------|--------|-----|------------|
| **UX** | **Not built** | 5-stage recall flow (Section 08) | **Entire leg** | **L** |
| **APIs** | None | Lightweight recall evaluate (no full debrief) | New recall session API or client-only | M |
| **Azure** | — | STT for 3 pronunciation + answers | Standard pipeline | S |
| **Captain Delta** | — | Fast pace; minimal teaching; brief coaching | New recall persona/mode | M |
| **Daily Mission** | — | Insert before Mock on Intense; after Part 2 on Standard | `getNextMissionAction()` slot | M |
| **Learning Memory** | — | Recall confidence signal | New memory fields | S |
| **Debrief** | — | No debrief during recall | N/A | — |
| **Tests** | None | Stage order; content pulled from today only | All | M |

**Dependencies:** **Sprint 1 Mission Engine** (blocker), today's mission data from all legs  
**Risks:** Recall content must come from actual completed mission state, not static prompts

---

### Chapter 09 — Mock Exam

| Area | Current | Target | Gap | Complexity |
|------|---------|--------|-----|------------|
| **UX** | Simulado P1–4 flow; intense daily step | Examiner mode; neutral Captain; P3–P4 production content | P3 scripts partial; **P4 placeholder SVGs** | L |
| **APIs** | Evaluate per step | Examiner debrief aggregation | Partial | M |
| **Azure** | TTS examiner voice | Same | ✅ | S |
| **Captain Delta** | Examiner intro/debrief text | Full examiner mode; no coaching mid-exam | Enforce no-hint during exam | M |
| **Daily Mission** | Intense only via `simulateDailyMission.ts` | After Recall on Intense | Recall dependency | S |
| **Learning Memory** | Simulado history local | Report → Flight Debrief → memory | Server sync optional | M |
| **Debrief** | `SimuladoReport` + examiner debrief | Strengths/weaknesses → tomorrow | Link to unified debrief | M |
| **Tests** | None | `buildSteps.ts` per exam version | All | M |

**Dependencies:** Mission Recall (Intense path), Flight Debrief (Sprint 5)  
**Risks:** Part 4 real SDEA pictures are content dependency, not just code

---

### Chapter 10 — Flight Debrief

| Area | Current | Target | Gap | Complexity |
|------|---------|--------|-----|------------|
| **UX** | Per-answer `FlightInstructorReportPanel`; `DailyDebriefPanel` unwired on home | Unified end-of-flight debrief; replay; tomorrow focus | **Unified session close** | **L** |
| **APIs** | `/api/flight-instructor` | Session aggregation endpoint or client builder | `lib/flightInstructor/dailyDebrief.ts` exists but not in flow | M |
| **Azure** | — | Replay audio clip (20s) | Recording retrieval from evaluations | M |
| **Captain Delta** | AFTER_ANSWER, DEBRIEF events | Full instructor landing debrief | Session close builders partial | M |
| **Daily Mission** | — | Debrief after legs complete (matrix leg 9) | Orchestrator terminal state | M |
| **Learning Memory** | `sessionClose.ts`, `weeklyDebrief.ts` | Tomorrow items persisted | Wire to debrief UI | M |
| **Debrief** | Partial per-answer | 5-beat structure (Section 10) | Replay + one priority + next step | L |
| **Tests** | None | Debrief JSON schema; session aggregation | All | M |

**Dependencies:** Mission Engine completion detection, all mission legs feeding memory  
**Risks:** Without Sprint 1, debrief has no single “flight ended” trigger

---

### Chapter 11 — Audio Missions (Passive Flight Training)

| Area | Current | Target | Gap | Complexity |
|------|---------|--------|-----|------------|
| **UX** | `EscutarProva` playlist + offline packs | Listen-only, shadowing, question-pause, Captain Radio | **Modes 2–4 not built** | **L** |
| **APIs** | TTS, static assets | Same | ✅ for listen | S |
| **Azure** | TTS | Captain Radio voice | Captain Radio tool | M |
| **Captain Delta** | Disabled proactive | Brief radio transmissions | Captain Radio + voice | L |
| **Daily Mission** | Not in orchestrator | Parallel optional leg | Matrix leg 10 ○ | S |
| **Learning Memory** | — | Passive session logging | Flight Logbook feed | M |
| **Debrief** | — | Optional passive session summary | Low priority | S |
| **Tests** | None | Offline pack manifest | All | S |

**Dependencies:** Captain voice (Sprint 14) for full Captain Radio; content assets  
**Risks:** Passive must not bypass active speaking (rule 6)

---

### Chapter 12 — Design System

| Area | Current | Target | Gap | Complexity |
|------|---------|--------|-----|------------|
| **UX** | `globals.css` ~10k lines; `theme-refined.css`; module CSS | Digital Flight Academy tokens; mission board; timeline components | **Mission Board**, **Timeline**, component library | **L** |
| **APIs** | N/A | N/A | — | — |
| **Components** | Class-based primitives | Reusable mission/debrief/board components | Extract from monolith CSS | L |
| **Captain Delta** | Floating panel styled | Begin Flight hero; examiner mode visuals | New layouts per 03A | M |
| **Accessibility** | Partial | Mobile-first PWA ✅ | Audit needed | M |
| **Tests** | None | Visual regression (optional) | All | M |

**Dependencies:** Mission Board (Sprint 2), ongoing per-feature  
**Risks:** `globals.css` monolith — every sprint touches it until modularized (Sprint 16)

---

## Sprint plan (16 × 2 weeks)

Each sprint ships **working software** verifiable against acceptance criteria. Update [IMPLEMENTATION-STATUS.md](./IMPLEMENTATION-STATUS.md) and [CURRENT-PRODUCT.md](./CURRENT-PRODUCT.md) at sprint end — never the Flight Manual.

---

### Sprint 1 — First Flight Experience

**Spec:** [architecture/sprint-1-first-flight-experience.md](./architecture/sprint-1-first-flight-experience.md)

| Field | Detail |
|-------|--------|
| **Goal** | Professional flight academy entry — one Begin Flight CTA, matrix order, Captain briefing |
| **Effort** | **L** (2 engineers × 2 weeks) |
| **Files** | `HomePage.tsx`, `DailyMissionPanel.tsx`, `dailyMission.ts`, `dailyMissionSync.ts`, `captainDelta/briefing.ts`, Prisma `DailyMissionDay`; deprecate home use of `FlightAcademyDashboard` / `flightMission.ts` |
| **Risks** | Home UX regression; sync schema migration |
| **Acceptance** | See sprint-1-first-flight-experience.md (12 criteria) |

---

### Sprint 2 — Begin Flight + Mission Timeline

| Field | Detail |
|-------|--------|
| **Goal** | Leg 0 briefing + orientation UI (03A) |
| **Effort** | **L** |
| **Files** | New `components/MissionBoard/`, `lib/captainDelta/briefing.ts`, `learning-tools/mission-timeline` → UI, `CaptainDeltaProvider` |
| **Risks** | Proactive briefing vs voice-off; scope creep into full 03A copy |
| **Acceptance** | One “Begin Flight” CTA; timeline shows legs 0–9 from matrix; exam label + objectives visible; no new philosophy |

---

### Sprint 3 — Mission Recall

| Field | Detail |
|-------|--------|
| **Goal** | Section 08 five-stage recall leg |
| **Effort** | **L** |
| **Files** | New `lib/missionRecall/`, `components/MissionRecall/`, `lib/dailyMission.ts`, `lib/captainDelta/missionRecall/` |
| **Risks** | Empty mission state if prior legs skipped |
| **Acceptance** | Recall runs after Part 2 on Standard; before Mock on Intense; content from today's mission only; 3–5 min flow; `IMPLEMENTATION-STATUS` Mission Recall → ✅ |

---

### Sprint 4 — Vocabulary Mission L1–L4

| Field | Detail |
|-------|--------|
| **Goal** | VB-1–VB-4 parity with pronunciation mission |
| **Effort** | **XL** |
| **Files** | `components/VocabularyTrainer/`, `lib/vocabDailyMission.ts`, `lib/vocabGraduation.ts` (new), `lib/pronunciationGraduation.ts` (pattern), Captain Delta vocab coach |
| **Risks** | SRS migration; dual vocab store consolidation |
| **Acceptance** | Each daily term progresses Meaning → Expression → Sentence → ICAO Use with spoken Azure check; Captain batch debrief; consolidate to single SRS key |

---

### Sprint 5 — Unified Flight Debrief

| Field | Detail |
|-------|--------|
| **Goal** | Section 10 end-of-flight debrief (leg 9) |
| **Effort** | **L** |
| **Files** | `lib/flightInstructor/dailyDebrief.ts`, `components/FlightDebrief/` (new), `lib/dailyMission.ts`, `CaptainDeltaProvider` |
| **Risks** | Aggregating partial mission completions |
| **Acceptance** | Completing daily mission opens debrief; five-beat structure; tomorrow priority saved to memory; works Standard and Intense |

---

### Sprint 6 — Progressive Assistance + Confidence Gates

| Field | Detail |
|-------|--------|
| **Goal** | Shared assistance level controller (PA + CG) |
| **Effort** | **L** |
| **Files** | New `lib/assistanceLevels/`, `lib/confidenceGates/`, wire to pronunciation + vocab |
| **Risks** | Over-engineering before Part 1 needs it |
| **Acceptance** | Graduation uses gates not checkbox; codes per ASSISTANCE-TAXONOMY; pronunciation + vocab demonstrate gate pass |

---

### Sprint 7 — Part 1 Examiner Conversation (P1-6)

| Field | Detail |
|-------|--------|
| **Goal** | Section 06 v5 conversation follow-up |
| **Effort** | **XL** |
| **Files** | `components/Part1/Conversation/` (new), `lib/part1/followUpEngine/`, `prompts/part1-followup.md`, `FlashcardApp.tsx` |
| **Risks** | Scope; must not remove PEEL shadow path |
| **Acceptance** | After P1-5, examiner asks follow-up; adaptive assistance; daily mission requires conversation attempt; evaluate + debrief |

---

### Sprint 8 — Mock Exam Production (P3–P4)

| Field | Detail |
|-------|--------|
| **Goal** | Simulado Parts 3–4 production quality |
| **Effort** | **L** |
| **Files** | `data/simulado/part3Data.ts`, `part4Data.ts`, `lib/simulado/buildSteps.ts`, `SimuladoRunner` |
| **Risks** | **Content**: real Part 4 images from SDEA |
| **Acceptance** | P3–P4 not placeholder; examiner no-coaching enforced; intense path Recall → Mock → Debrief |

---

### Sprint 9 — Quick Notes + Visual Coaching

| Field | Detail |
|-------|--------|
| **Goal** | Part 2/3 notes + visual coaching matrix |
| **Effort** | **M** |
| **Files** | `QuickNotesPad.tsx`, `lib/captainDelta/visual/`, Part 2 simulation integration |
| **Acceptance** | Quick Notes required in simulation; one visual focus per context per spec |

---

### Sprint 10 — Replay Debrief + Mission Readiness

| Field | Detail |
|-------|--------|
| **Goal** | Learning tools post-debrief synthesis |
| **Effort** | **M** |
| **Files** | `lib/replayEngine/` (new), `lib/missionReadiness/`, debrief flow |
| **Acceptance** | 20s replay clip; readiness signal before mock (future gate); feeds debrief |

---

### Sprint 11 — Passive Flight Training Modes

| Field | Detail |
|-------|--------|
| **Goal** | Section 11 modes beyond Escutar Prova |
| **Effort** | **L** |
| **Files** | `app/escutar-prova/`, new passive mode components, `lib/passiveTraining/` |
| **Acceptance** | Listen-only, shadowing, question-pause selectable; does not replace daily speaking legs |

---

### Sprint 12 — Situation Board + Instructor Whiteboard

| Field | Detail |
|-------|--------|
| **Goal** | Operational picture debrief UI |
| **Effort** | **L** |
| **Files** | `components/SituationBoard/` (new), debrief synthesis |
| **Acceptance** | Post-mission operational picture; whiteboard max 3 strengths / 1 improvement |

---

### Sprint 13 — Flight Logbook UI

| Field | Detail |
|-------|--------|
| **Goal** | Persisted mission history surface |
| **Effort** | **M** |
| **Files** | `lib/academy/logbook.ts` (exists), new UI, optional server model |
| **Acceptance** | Missions logged with growth milestones; readable history |

---

### Sprint 14 — Captain Delta Voice + Proactive Briefing

| Field | Detail |
|-------|--------|
| **Goal** | Re-enable TTS with rules from Section 02 |
| **Effort** | **L** |
| **Files** | `voiceConfig.ts`, `CaptainDeltaProvider`, `captain-radio` integration |
| **Risks** | UX annoyance; must respect student context |
| **Acceptance** | Voice opt-in; briefing on Begin Flight; no block on clicks |

---

### Sprint 15 — Learning Memory Consolidation

| Field | Detail |
|-------|--------|
| **Goal** | Move toward `lib/memory/` target without big-bang |
| **Effort** | **XL** |
| **Files** | `lib/captainDelta/memory/*`, new sync APIs, Prisma extensions |
| **Risks** | Multi-device conflicts |
| **Acceptance** | Simulado history + captain memory server backup; documented in runtime-map |

---

### Sprint 16 — Design System + Test Infrastructure

| Field | Detail |
|-------|--------|
| **Goal** | CSS modularization; baseline tests |
| **Effort** | **L** |
| **Files** | Split `globals.css`, Vitest/Playwright setup, critical path tests |
| **Acceptance** | CI runs tests for dailyMission, graduation, readbackScore; design tokens documented |

---

## Milestones

| Milestone | Sprint | Student-visible outcome |
|-----------|--------|-------------------------|
| **M1 — Trust the mission** | 1–2 | First Flight Experience + Begin Flight / Timeline |
| **M2 — Complete Standard flight** | 3–5 | Recall + Debrief on standard days |
| **M3 — Vocabulary parity** | 4 | Vocab mission equals pronunciation rigor |
| **M4 — Intense exam path** | 3+8 | Recall → Mock → Debrief on intense |
| **M5 — Professional Part 1** | 7 | Conversation not memorization |
| **M6 — Full learning tools** | 9–13 | Board, logbook, passive modes |
| **M7 — Production hardening** | 14–16 | Voice, memory, tests |

---

## Critical path

```
Sprint 1 → Sprint 3 → Sprint 5 → Sprint 8
         ↘ Sprint 4 (parallel after 1)
         ↘ Sprint 7 (after 6)
```

**Blockers before Sprint 1 approval:**

1. Resolve academy `flightMission.ts` vs `dailyMission.ts` ownership (product: matrix wins).  
2. Confirm Part 4 image content source (SDEA assets).  
3. Agree test stack (Vitest + Playwright recommended).

---

## Nice-to-have (post M7)

| Item | Era | Notes |
|------|-----|-------|
| Multi-agent AI Brain | Era 7 | Do not split APIs until M7 |
| Adaptive Conversation Engine full | Vision | Sprint 7 delivers minimum P1-6 |
| `src/` migration | Engineering | No behavior change |
| Community features | Academy | “Coming soon” — out of manual scope |
| VR / simulator | Era 8+ | Explicitly deferred |

---

## Definition of done — per chapter

A chapter is **done** only when every box is checked. Update IMPLEMENTATION-STATUS when complete.

### Chapter 04 — Pronunciation

- [ ] UX complete (PR-1–PR-4 + PR-5 target or documented deferral)
- [ ] APIs complete
- [ ] Azure complete
- [ ] Captain Delta complete (inline + batch debrief)
- [ ] Daily Mission complete (synced)
- [ ] Learning Memory complete
- [ ] Flight Debrief vocabulary/pronunciation slice complete
- [ ] Tests complete
- [ ] CURRENT-PRODUCT + IMPLEMENTATION-STATUS updated

### Chapter 05 — Vocabulary

- [ ] UX complete (VB-1–VB-4)
- [ ] APIs complete (spoken evaluate per level)
- [ ] Azure complete
- [ ] Captain Delta complete
- [ ] Daily Mission complete
- [ ] Learning Memory complete (single SRS)
- [ ] Flight Debrief slice complete
- [ ] Tests complete
- [ ] CURRENT-PRODUCT + IMPLEMENTATION-STATUS updated

### Chapter 06 — Part 1

- [ ] UX complete (P1-1–P1-6)
- [ ] APIs complete (follow-up engine)
- [ ] Azure complete
- [ ] Captain Delta complete (assistance reduction)
- [ ] Daily Mission complete
- [ ] Learning Memory complete
- [ ] Replay Debrief hook complete
- [ ] Tests complete
- [ ] CURRENT-PRODUCT + IMPLEMENTATION-STATUS updated

### Chapter 07 — Part 2

- [ ] UX complete (P2-1–P5 + Quick Notes)
- [ ] APIs complete
- [ ] Azure complete
- [ ] Captain Delta complete (simulation persona)
- [ ] Daily Mission complete
- [ ] Learning Memory complete
- [ ] Tests complete
- [ ] CURRENT-PRODUCT + IMPLEMENTATION-STATUS updated

### Chapter 08 — Mission Recall

- [ ] UX complete (5 stages)
- [ ] APIs complete (if any)
- [ ] Azure complete
- [ ] Captain Delta complete (recall mode)
- [ ] Daily Mission complete (matrix position)
- [ ] Learning Memory complete (recall confidence)
- [ ] Tests complete
- [ ] CURRENT-PRODUCT + IMPLEMENTATION-STATUS updated

### Chapter 09 — Mock Exam

- [ ] UX complete (examiner mode)
- [ ] APIs complete
- [ ] Azure complete
- [ ] Captain Delta complete (examiner only during exam)
- [ ] Daily Mission complete (intense + recall order)
- [ ] Learning Memory complete (report → debrief)
- [ ] P3–P4 content complete
- [ ] Tests complete
- [ ] CURRENT-PRODUCT + IMPLEMENTATION-STATUS updated

### Chapter 10 — Flight Debrief

- [ ] UX complete (unified end-of-flight)
- [ ] APIs complete (aggregation)
- [ ] Captain Delta complete (landing debrief)
- [ ] Daily Mission complete (terminal leg)
- [ ] Learning Memory complete (tomorrow items)
- [ ] Replay integration complete
- [ ] Tests complete
- [ ] CURRENT-PRODUCT + IMPLEMENTATION-STATUS updated

### Chapter 11 — Audio Missions

- [ ] UX complete (passive modes)
- [ ] APIs/assets complete
- [ ] Azure TTS complete
- [ ] Captain Radio complete (or deferred with status)
- [ ] Escutar Prova + offline packs complete
- [ ] Tests complete
- [ ] CURRENT-PRODUCT + IMPLEMENTATION-STATUS updated

### Chapter 12 — Design System

- [ ] Mission Board components complete
- [ ] Mission Timeline components complete
- [ ] Debrief / Recall / Examiner layouts complete
- [ ] Token documentation complete
- [ ] CSS modularization milestone complete
- [ ] Accessibility pass complete
- [ ] Visual regression baseline (optional)

---

## Technical debt register (do not fix in Sprint 0)

| ID | Debt | Impact | Suggested sprint |
|----|------|--------|------------------|
| TD-01 | `FlightAcademyDashboard` vs `DailyMissionPanel` dual home | **Critical** — wrong mission order shown | Sprint 1 |
| TD-02 | `lib/academy/flightMission.ts` adaptive legs ≠ matrix | **Critical** — pedagogy order violated | Sprint 1 |
| TD-03 | Dual vocab stores (`spacedRepetition` vs `vocabProgress`) | Data corruption risk | Sprint 4 |
| TD-04 | Pronunciation daily not server-synced | Multi-device gap | Sprint 1 |
| TD-05 | `CaptainDeltaProvider` god object | Hard to test/extend | Sprint 6+ |
| TD-06 | `VoiceCoachPanel` mega-component | Part 1/2 change cost | Sprint 7+ |
| TD-07 | `globals.css` monolith | Merge conflicts | Sprint 16 |
| TD-08 | Duplicate API routes (`speech-token`, `evaluate-answer`) | Confusion | Sprint 16 |
| TD-09 | Orphan components (`Part1Simulator`, `IcaoStructureApp`) | Noise | Sprint 16 |
| TD-10 | Zero automated tests | Regression risk | Sprint 1 baseline, 16 full |
| TD-11 | `cards.json` 12 vs docs “42 cards” | Doc/code drift | Fix CURRENT-PRODUCT in Sprint 1 |
| TD-12 | Part 4 placeholder SVGs | Exam fidelity | Sprint 8 + content |
| TD-13 | Captain voice hardcoded off | Section 02 gap | Sprint 14 |
| TD-14 | Simulado + memory local-only | Device loss | Sprint 15 |
| TD-15 | `icao_part1.html` legacy | Confusion | Delete in Sprint 16 |

---

## Effort summary

| Scope | Sprints | Calendar |
|-------|---------|----------|
| Critical path (M1–M4) | 1–5, 8 | ~3 months |
| Full mission chapters 04–10 | 1–8 | ~4 months |
| Learning tools wave | 9–13 | +2.5 months |
| Platform hardening | 14–16 | +1.5 months |
| **Total** | **16** | **~8 months** at 2-week sprints |

With 3–4 engineers and parallel tracks (content for P4, design for Sprint 12), target **6 months** to M6.

---

## Related

- [SPRINT-0-REPORT.md](./SPRINT-0-REPORT.md) — findings and approval gate
- [IMPLEMENTATION-STATUS.md](./IMPLEMENTATION-STATUS.md) — living status
- [ONBOARDING.md](./ONBOARDING.md) — engineer reading paths
- [DECISION-RECORDS.md](./DECISION-RECORDS.md) — do not undo

**Sprint 1 may not begin until Sprint 0 is approved.**
