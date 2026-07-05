# Captain Delta Learning Intelligence (CDLI)

**CDLI is Captain Delta's educational brain.**

Students never see CDLI. Developers, prompt authors, and learning designers do.

Related: [Section 02 — Captain Delta](../02-captain-delta.md) · [RFC-001](../architecture/rfc/RFC-001-educational-intelligence-architecture.md) · [ADR-009](../architecture/adr/ADR-009-captain-authority.md)

---

## Purpose

ICAO Delta evolves from an AI speaking coach into an **AI Flight Instructor**.

Captain Delta remains the **only instructor the student meets**.

CDLI is the **pedagogical intelligence** behind Captain — how he decides to teach, not what leg the student flies next.

---

## Authority boundary

| Question | Owner |
|----------|-------|
| What should the student study next? | **Mission Engine** (`lib/dailyMission.ts`) |
| How should Captain teach this student? | **CDLI** (EIA) |
| What does the student see? | **Captain Delta** UI + voice |
| What do we remember? | **Learning Memory** (Section 13) |

CDLI **must never** advance missions, mark legs complete, or override the Mission Flow Matrix.

CDLI **may** read `getDailyMissionSummary()`, `getNextMissionAction()`, memory stores, evaluation JSON, and difficulty signals — then shape briefing copy, coaching tone, assistance level, and debrief focus.

---

## Five capabilities (not modules)

CDLI is not a folder of microservices. It is five **capabilities** that any implementation may satisfy through prompts, deterministic builders, or APIs.

### 1. Instructional Judgment

Captain teaches like a senior instructor:

- One priority improvement at a time (Section 10 golden rule)
- Questions before explanations when the student can recall
- Scenarios before abstract definitions
- Thinking before communication; communication before evaluation

**Implementation today:** `/api/flight-instructor`, `lib/flightInstructor/`, post-answer debrief events.

**Not:** A separate "Discussion Engine" product module — professional conversation is P1-6 + Adaptive Conversation learning tool.

---

### 2. Assistance Calibration

Captain fades support over time (Section 02, Progressive Assistance):

- PA-1…PA-5 ladder ([ASSISTANCE-TAXONOMY.md](../ASSISTANCE-TAXONOMY.md))
- Mission-specific codes: PR, VB, P1, P2
- Confidence signals inform when to hold or release support

**Implementation today:** Trainer UI, PEEL levels, pronunciation graduation, `lib/difficultyInsights.ts`.

**Not:** Replacing Confidence Gates or Mission Readiness learning tools — CDLI **consumes** their signals.

---

### 3. Operational Context

Captain connects today's practice to operational aviation through a **unified operational graph** (not isolated lessons):

- Topics, vocabulary, pronunciation, Part 1–4 scenarios
- Past mistakes and successful recoveries (from memory)
- Authoritative resource **categories** (not brittle URLs)

See [operational-knowledge-graph.md](./operational-knowledge-graph.md).

**Implementation today:** Exam rotation data, `icaoVocabulary`, Part 2 situations, vault, instructor memory.

**Not:** A hand-maintained course CMS that overrides mission chapters.

---

### 4. Instructor Voice

Captain frames the flight without controlling it:

- Adaptive operational briefing (read-only mission context)
- Mission Recall tone — fast, minimal, no teaching
- Flight Debrief structure — positive opening, one priority, tomorrow focus

See [adaptive-operational-briefing.md](./adaptive-operational-briefing.md).

**Implementation today:** `lib/captainDelta/briefing.ts`, `lib/flightDebrief/buildFlightDebrief.ts`, recall feedback copy.

**Not:** Choosing leg order or skipping Mock Exam — engine owns routing.

---

### 5. Memory Synthesis

Captain remembers **how** the student learns, not just scores:

- Weak pronunciation, strong vocabulary, hesitation patterns
- Mission history and consistency
- Inputs for tomorrow's emphasis (engine still picks tomorrow's legs)

See [Section 13 — Learning Memory](../13-learning-memory.md).

**Implementation today:** `lib/captainDelta/memory/`, `lib/flightInstructor/memory`.

**Not:** Analytics for dashboards without learning purpose (Section 13 rule).

---

## Mapping Section 14 agents → CDLI

Section 14 describes implementation personas. They implement CDLI capabilities; they are not separate product faces.

| Section 14 agent | CDLI capability |
|------------------|-----------------|
| Flight Instructor, Debrief Engine, Replay Analyzer | Instructional Judgment |
| Pronunciation / Vocabulary / Part 4 Coach | Assistance Calibration |
| Part 2 ATC, Part 3 Situation Analyzer | Operational Context |
| Mission Planner | **Mission Engine** (not CDLI) |
| ICAO Examiner | Instructor Voice (examiner persona) |
| Memory Engine, Recommendation Engine | Memory Synthesis |
| Analytics Engine | Telemetry only — not CDLI unless it feeds learning |

Production collapses most agents into three API routes ([ai-architecture.md](../architecture/ai-architecture.md)). CDLI unifies them **conceptually** without requiring more services.

---

## Program evolution

ICAO/SDEA is **Program 1**.

Future programs (CRM, HAA, NVG, IFR, SOP, type rating, recurrent) add graph nodes and mission content. CDLI capabilities stay the same:

- Same instructional principles
- Same seven-phase learning loop
- Same Captain identity
- Same Mission Engine pattern (future `program` dimension — ADR-013+)

---

## Verification checklist (for PRs)

- [ ] Feature names exactly **one** CDLI capability
- [ ] No mission state writes from Captain/CDLI paths
- [ ] Briefing/debrief uses read-only mission APIs
- [ ] Instructional principle ID cited in prompt or copy changes
- [ ] Learning tool used where spec exists — not reinvented inside CDLI

---

## Related

- [instructional-principles.md](./instructional-principles.md)
- [learning-loop.md](./learning-loop.md)
- [operational-confidence.md](./operational-confidence.md)
