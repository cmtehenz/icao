# Sprint 0 — Final Report

**Role:** Lead Software Engineer / Technical Lead  
**Date:** July 2026  
**Status:** Planning complete — **no production code modified**

**Deliverables:**

- [IMPLEMENTATION-ROADMAP.md](./IMPLEMENTATION-ROADMAP.md) — 16-sprint master plan  
- This report — architecture understanding, gaps, risks, approval gate

**Authority chain (immutable):** Flight Manual → CURRENT-PRODUCT → IMPLEMENTATION-STATUS → `docs/` → source code

---

## 1. Architecture understanding

### Product architecture (frozen)

ICAO Delta is a **Digital Flight Academy**. The student does not pick modules — Captain Delta runs a **daily flight mission** whose leg order is defined only in [architecture/mission-flow-matrix.md](./architecture/mission-flow-matrix.md):

| Mode | Active legs (summary) |
|------|------------------------|
| **Standard** | Briefing → Pronunciation → Vocabulary → Part 1 → Part 2 → Mission Recall → Flight Debrief |
| **Intense** | Standard + Mock Exam (after Recall) |
| **Passive** | Parallel listen-first (Section 11 + learning tool) — never replaces speaking |

Pedagogy layers:

- **Mission chapters (04–11)** — how each leg applies philosophy to that mission  
- **Learning tools** — cross-cutting methodology (Progressive Assistance, Confidence Gates, etc.)  
- **Assistance codes** — PA / PR / VB / P1… per [ASSISTANCE-TAXONOMY.md](./ASSISTANCE-TAXONOMY.md)

### Technical architecture (current)

```
Next.js 15 App Router
├── app/          routes + API
├── components/   UI (CaptainDelta, trainers, simulado)
├── lib/          business logic (flat, not yet missionEngine/)
├── hooks/        Azure, Captain PTT, vocab, simulado
├── prisma/       User, VaultWord, Evaluation, StudyDay, DailyMissionDay
└── prompts/      OpenAI system prompts
```

**AI (production):** three routes collapsed from 14-agent vision — `/api/flight-instructor`, `/api/captain-delta`, `/api/evaluate`.

**State:** versioned localStorage per domain + partial server sync on auth (vault, study days, daily mission for part1/part2/vocab only).

**Captain Delta:** `CaptainDeltaProvider` event bus; voice **disabled**; visual coaching partial.

---

## 2. Codebase understanding

### What is solid (ship with confidence)

| Module | Entry | Maturity |
|--------|-------|----------|
| Daily exam rotation | `lib/dailyExamRotation.ts` | ✅ |
| Mission orchestrator logic | `lib/dailyMission.ts` | ✅ logic; ❌ home wiring |
| Pronunciation vault + PR-1–4 | `lib/pronunciationVault.ts`, `pronunciationGraduation.ts` | ✅ |
| Vocab SRS + 20/day | `lib/vocabDailyMission.ts`, `utils/spacedRepetition.ts` | ✅ without levels |
| Part 1 PEEL P1-1–5 | `lib/peelBlocks.ts`, `FlashcardApp` | ✅ |
| Part 2 simulation | `lib/part2/`, `FullSimulationMode` | ✅ |
| Simulado P1–2 | `lib/simulado/buildSteps.ts` | ✅ |
| Evaluate pipeline | `lib/evaluate/*` + APIs | ✅ |
| Azure speech | `lib/azure/*`, API routes | ✅ |
| Auth + vault sync | `lib/auth/`, `app/api/vault` | ✅ |

### What is broken or misleading

| Issue | Evidence | Impact |
|-------|----------|--------|
| **Dual home mission UX** | `app/page.tsx` → `FlightAcademyDashboard`; `DailyMissionPanel` **never imported** | Students see adaptive academy legs, not matrix order |
| **Academy overrides matrix** | `lib/academy/flightMission.ts` builds custom leg order from `computeAdaptivePriorities()` | Violates Mission Engine spec |
| **CURRENT-PRODUCT drift** | Claims 42 Part 1 cards; `cards.json` has 12 (+ exam-specific in `data/exams/part1.ts`) | Planning confusion |
| **No tests** | Zero `*test*` files in repo | No regression safety |
| **Pronunciation daily local-only** | Excluded from `dailyMissionSync.ts` / `DailyMissionDay` | Multi-device inconsistency |

### Shipped vs manual — honest scorecard

| Leg / capability | Manual | Code |
|------------------|--------|------|
| Captain Briefing | ● | 🔴 |
| Pronunciation | ● | ✅ |
| Vocabulary | ● | 🟡 (no VB levels) |
| Part 1 | ● | 🟡 (no P1-6) |
| Part 2 | ● | ✅ |
| Part 3/4 daily | ○/● | 🔴 (simulado only) |
| Mission Recall | ● | 🔴 |
| Mock Exam | Intense ● | 🟡 |
| Flight Debrief | ● | 🟡 (per-answer only) |
| Passive | ○ | 🟡 (Escutar Prova only) |

---

## 3. Gap summary

### By priority (from IMPLEMENTATION-STATUS + code verification)

| Priority | Gap | Complexity | Sprint |
|----------|-----|------------|--------|
| **P0** | Mission Engine / home UX unification | L | 1 |
| **P0** | Mission Recall | L | 3 |
| **P1** | Vocabulary VB-1–4 | XL | 4 |
| **P1** | Begin Flight + Mission Timeline | L | 2 |
| **P1** | Unified Flight Debrief | L | 5 |
| **P1** | Part 1 P1-6 conversation | XL | 7 |
| **P2** | Confidence Gates + PA framework | L | 6 |
| **P2** | Mock P3–P4 production | L | 8 |
| **P2** | Quick Notes + Visual Coaching | M | 9 |
| **P3** | Passive modes + Captain Radio | L | 11 |
| **P3** | Situation Board, Logbook, Replay | L | 10–13 |
| **Platform** | Voice, memory sync, tests, CSS | L–XL | 14–16 |

### Missing APIs (net new)

| API / module | Chapter | Purpose |
|--------------|---------|---------|
| `lib/missionRecall/*` | 08 | Recall session state machine |
| `lib/vocabGraduation/*` | 05 | VB level progression |
| `lib/assistanceLevels/*` | LT | Shared PA controller |
| `lib/confidenceGates/*` | LT | Gate pass logic |
| `lib/part1/followUpEngine/*` | 06 | P1-6 conversation |
| `lib/replayEngine/*` | 10 | 20s clip selection |
| `lib/missionReadiness/*` | LT | Readiness signal |
| `lib/passiveTraining/*` | 11 | Passive mode orchestration |
| Pronunciation daily sync field | 04 | `DailyMissionDay` extension |

### Missing UI (net new)

| Component | Chapter |
|-----------|---------|
| `MissionBoard` / Begin Flight | 03A |
| `MissionTimeline` | LT |
| `MissionRecall` | 08 |
| `VocabularyLevelsMode` | 05 |
| `Part1/Conversation` | 06 |
| `FlightDebrief` (unified) | 10 |
| `SituationBoard` | LT |
| Passive mode shells | 11 |

### Missing AI

| Capability | Chapter | Notes |
|------------|---------|-------|
| Follow-up question generation | 06 | New prompt + session state |
| Recall-mode Captain (minimal teaching) | 08 | Prompt discipline |
| Examiner strict no-hint mode | 09 | Enforce in simulado runner |
| Captain Radio scripts | 11 | TTS + short transmissions |

---

## 4. Highest-risk modules

| Rank | Module | Why |
|------|--------|-----|
| 1 | **Mission Engine + Home** | Two competing orchestrators; wrong order visible to users today |
| 2 | **Vocabulary L1–L4** | Largest net-new UX; SRS migration |
| 3 | **Part 1 P1-6** | XL scope; must preserve PEEL |
| 4 | **CaptainDeltaProvider** | God object; every feature touches it |
| 5 | **Flight Debrief aggregation** | Needs all legs to feed consistent memory |
| 6 | **globals.css** | Every UI sprint risks merge pain |

---

## 5. Lowest-risk modules

| Module | Why safe |
|--------|----------|
| **Pronunciation PR-1–4 polish** | Already shipped; incremental |
| **Part 2 readback scoring** | Deterministic `readbackScore.ts` |
| **Escutar Prova extensions** | Isolated route |
| **Auth / vault / study-time sync** | Stable patterns to copy |
| **Exam rotation** | Single file, tested by time |
| **Dead code removal** | Sprint 16; no behavior change |

---

## 6. Recommended first implementation

**Sprint 1: Mission Engine Foundation** — not Pronunciation, not Part 1.

**Why:** Every subsequent leg inserts into `getNextMissionAction()`. Building Recall, Debrief, or Timeline on top of the current split (`FlightAcademyDashboard` vs `dailyMission.ts`) guarantees rework.

**Sprint 1 minimum viable outcome:**

1. Home displays `DailyMissionPanel` (or equivalent) driven **only** by `lib/dailyMission.ts`.  
2. `lib/academy/flightMission.ts` stops inventing leg order — adaptive priorities may reorder **emphasis**, not matrix sequence.  
3. Pronunciation daily mission syncs to server.  
4. Vitest baseline: `getNextMissionAction()` order for standard/intense.

---

## 7. Recommended first refactor

**Not a big-bang `lib/missionEngine/` folder move.**

First refactor: **extract mission leg registry** from `dailyMission.ts`:

```typescript
// Target pattern (Sprint 1)
const MISSION_LEGS = [
  { id: "pronunciation", progress: pronunciationDailyMissionProgress, ... },
  { id: "vocabulary", ... },
  // future: recall, debrief
];
```

Benefits: Recall and Debrief slot in without rewriting CTA logic again.

**Defer:** `lib/memory/` migration until Sprint 15 — current `captainDelta/memory/*` works.

---

## 8. Critical blockers (approval gate)

| # | Blocker | Owner | Resolution needed |
|---|---------|-------|-------------------|
| B1 | Academy vs Mission Engine ownership | Product + Eng | Confirm matrix order is law; academy is gamification layer only |
| B2 | Sprint 0 approval | Tech Lead + Product | Sign off on [IMPLEMENTATION-ROADMAP.md](./IMPLEMENTATION-ROADMAP.md) |
| B3 | Part 4 image assets | Content | SDEA pictures for Sprint 8 |
| B4 | Test stack choice | Eng | Vitest + Playwright recommended |
| B5 | CURRENT-PRODUCT card count | Docs maintainer | Fix 42 → actual count in Sprint 1 PR (not Flight Manual) |

---

## 9. Dependency graph (implementation order)

```
Sprint 1 (Mission Engine)
    ├── Sprint 2 (Begin Flight / Timeline)
    ├── Sprint 3 (Mission Recall) ── requires today's mission payloads
    ├── Sprint 4 (Vocab L1-L4) ── can parallel Sprint 3 after Sprint 1
    └── Sprint 5 (Flight Debrief) ── requires completion detection

Sprint 6 (PA + Gates) ── before Sprint 7 (P1-6)

Sprint 3 + Sprint 8 (Mock) ── Intense path end-to-end

Sprints 9–13 (Learning tools) ── after Sprint 5 debrief shell exists

Sprints 14–16 (Platform) ── after core missions stable
```

**Captain Delta upgrades** are horizontal — each sprint touches provider lightly; dedicated voice sprint is 14.

---

## 10. Technical debt (report only)

See [IMPLEMENTATION-ROADMAP.md](./IMPLEMENTATION-ROADMAP.md) § Technical debt register (TD-01–TD-15).

**Top 5 to address early:**

1. TD-01 / TD-02 — dual mission UX (Sprint 1)  
2. TD-10 — zero tests (Sprint 1 baseline)  
3. TD-03 — dual vocab stores (Sprint 4)  
4. TD-04 — pronunciation daily sync (Sprint 1)  
5. TD-11 — CURRENT-PRODUCT drift (Sprint 1)

---

## 11. Team readiness

After Sprint 0, a team of 20 engineers can partition as:

| Track | Sprints | Engineers |
|-------|---------|-----------|
| **Mission Engine** | 1–3, 5 | 2–3 |
| **Missions 04–07** | 4, 6–7 | 3–4 |
| **Mock + Recall** | 3, 8 | 2 |
| **Learning tools** | 9–13 | 3–4 |
| **Captain Delta / AI** | 6–7, 14 | 2 |
| **Platform / QA** | 1, 15–16 | 2 |
| **Content / Design** | 8, 12 | 2 |

Parallel work is safe **after Sprint 1** completes the orchestrator contract.

---

## 12. Success criteria — Sprint 0

| Criterion | Status |
|-----------|--------|
| Entire project has implementation roadmap | ✅ [IMPLEMENTATION-ROADMAP.md](./IMPLEMENTATION-ROADMAP.md) |
| Every chapter 04–12 has implementation strategy | ✅ Roadmap gap tables + DoD checklists |
| Every dependency known | ✅ Dependency graph |
| Team can implement with minimal rework | ✅ Sprint 1 addresses critical rework risk |
| No production code changed | ✅ |
| No Flight Manual changed | ✅ |

---

## 13. Approval recommendation

**Approve Sprint 0.** Begin **Sprint 1 (Mission Engine Foundation)** only after:

1. **[Architecture Lock](./architecture/ARCHITECTURE-LOCK.md)** and **ADRs 001–007** approved (Tech Lead + Product Architect).  
2. Product confirms academy layer must not override [mission-flow-matrix.md](./architecture/mission-flow-matrix.md).  
3. Engineering selects Vitest (+ optional Playwright).  
4. Tech lead assigns Sprint 1 owners.

**Do not begin** Vocabulary L1–L4 or Part 1 conversation before Sprint 1 lands — they will integrate twice.

---

## Related documents

| Document | Role |
|----------|------|
| [IMPLEMENTATION-ROADMAP.md](./IMPLEMENTATION-ROADMAP.md) | Execution plan |
| [IMPLEMENTATION-STATUS.md](./IMPLEMENTATION-STATUS.md) | Living gap table |
| [CURRENT-PRODUCT.md](./CURRENT-PRODUCT.md) | Shipped truth |
| [architecture/runtime-map.md](./architecture/runtime-map.md) | Code index |
| [architecture/mission-flow-matrix.md](./architecture/mission-flow-matrix.md) | Sequence law |
| [ONBOARDING.md](./ONBOARDING.md) | Engineer onboarding |
| [DECISION-RECORDS.md](./DECISION-RECORDS.md) | Do not undo |

---

*Sprint 0 complete. No code was written. Flight Manual remains frozen.*
