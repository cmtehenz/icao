# RFC-001 — Educational Intelligence Architecture (EIA)

| Field | Value |
|-------|-------|
| **Status** | Accepted (documentation layer) |
| **Date** | July 2026 |
| **Author** | Chief Product Architect |
| **Scope** | Pedagogical architecture — not Mission Engine, not UI, not database |
| **Locks preserved** | ADR-001–012, Mission Engine, Captain Authority (ADR-009) |

---

## 1. Architectural review (critical)

This section records an honest review of the original RFC proposal **before** acceptance. The proposal direction is sound; several elements would have increased complexity without improving outcomes.

### 1.1 What the proposal gets right

- **Separation of concerns:** “What to study” vs “How to teach” is correct and aligns with ADR-009.
- **Captain as AI Flight Instructor:** Consistent with Section 02 identity — evolution, not reinvention.
- **Capabilities not modules:** Right instinct — avoids microservice sprawl in product docs.
- **Program-agnostic architecture:** ICAO as Program 1 with room for CRM/HAA/etc. is necessary for long-term vision.
- **Instructional principles as product rules:** Matches Section 99 and debrief golden rules.
- **Resource philosophy:** Authoritative sources, categories not URLs — low maintenance, high trust.
- **Students never touch CDLI:** Preserves Captain Delta as the only instructor face.

### 1.2 Unnecessary complexity (identified)

| Proposal element | Issue | Simplification |
|------------------|-------|----------------|
| **Nine named CDLI capabilities** | Overlap with learning tools, Section 13, Section 14 agents | **Five capabilities** (see §4) |
| **Knowledge Graph + Scenario Graph** | Two ontologies to maintain | **One Operational Graph** with typed nodes and edges |
| **Ten-step learning loop** | Duplicates [learning-architecture.md](../learning-architecture.md) (7 steps) and Section 01 | **Seven-phase loop** — alias map in [learning-loop.md](../educational-systems/learning-loop.md) |
| **Discussion Engine** (standalone) | Already specified as P1-6 + Adaptive Conversation Engine LT | Fold into **Instructional Judgment** |
| **Learning Strategy** (standalone) | Conflicts with Mission Engine leg ownership | **Rejected** — engine owns sequence; CDLI owns pedagogy per leg |
| **Resource Recommendation** (engine) | Risk of link rot, scope creep | **Philosophy only** + optional debrief categories |
| **Operational Confidence** (new system) | Duplicates Conversation Confidence + Mission Readiness LTs | **Single doc** clarifying confidence ≠ ICAO level |
| **Adaptive Operational Briefing** (new module) | Overlaps `lib/captainDelta/briefing.ts` + 03A | **Capability** — adaptive *copy*, not adaptive *routing* |

### 1.3 Conflicts with Flight Manual (resolved, not ignored)

| Conflict | Resolution |
|----------|------------|
| Section 01: “ICAO exam preparation system” vs “not an English app” | **Evolution:** ICAO is Program 1 of an AI Flight Instructor academy — not a positioning contradiction |
| Section 14: many AI agents vs CDLI “one brain” | **Layering:** CDLI = pedagogical unity; Section 14 agents = implementation personas behind Captain |
| Section 02: Captain “controls progression automatically” (PA ladder) | **Clarify:** Captain calibrates *assistance*; Mission Engine controls *legs* (ADR-009) |
| learning-architecture.md loop vs proposed loop | **Merge** into seven phases; no second loop |
| Mission Recall / Debrief recently shipped | EIA **describes** them; does not reorder legs |

### 1.4 Conflicts with ADR-001–012 (must not violate)

| ADR | Risk from naive EIA | Enforcement |
|-----|---------------------|-------------|
| ADR-001–005 | CDLI picks next leg | CDLI **read-only** `getNextMissionAction()` |
| ADR-008 | CDLI writes mission state | CDLI writes **memory + prompts only** |
| ADR-009 | Captain mutates progress | Captain **reacts**; leg APIs **mutate** |
| ADR-006 | CDLI invents events | Use existing `CAPTAIN_DELTA_*` + mission events |
| ADR-012 | Silent pedagogy change in code | Principles in manual; major behavior → ADR |

**No ADR amendment required** for EIA documentation layer. Program dimension or new Captain write paths would need ADR-013+.

### 1.5 Overlap with Learning Tools

Learning tools are **orthogonal** to mission legs ([mission-flow-matrix.md](../architecture/mission-flow-matrix.md)). CDLI must not become a second catalog of tools.

| Learning Tool | CDLI relationship |
|---------------|-------------------|
| Progressive Assistance | CDLI **calibrates** PA level — does not replace PA spec |
| Confidence Gates | CDLI **reads** gate signals — gates remain LT-owned |
| Conversation Confidence | CDLI **interprets** — not duplicate scoring |
| Mission Readiness | Pre-mock signal — engine still gates Mock leg |
| Replay Debrief | CDLI **selects** clip pedagogically — replay engine executes |
| Situation Board | Post-scenario synthesis — graph informs links |
| Adaptive Conversation Engine | P1-6 implementation — Instructional Judgment capability |

### 1.6 Future maintenance risks

| Risk | Mitigation |
|------|------------|
| Graph becomes stale curriculum DB | Graph is **derived view** over missions + memory — not hand-authored courseware |
| Every feature claims CDLI | Feature PR must name **one** CDLI capability |
| Section 14 agent list grows unbounded | New agents map to existing five capabilities or need ADR |
| Principles drift in prompts | [instructional-principles.md](../educational-systems/instructional-principles.md) + prompt review checklist |

### 1.7 Simpler architecture that achieves the same outcome

```
Student
   ↓
Captain Delta (persona, voice, UI)
   ↓ reads
Mission Engine (what leg, what complete)     ← LOCKED
   ↓ reads/writes
Learning Memory (patterns, mistakes)         ← Section 13
   ↓ informed by
CDLI — five capabilities (how to teach)      ← EIA (this RFC)
   ↓ implemented via
Prompts + APIs + deterministic builders        ← Section 14 today
   ↓ inside legs
Learning Tools (PA, gates, replay, …)        ← learning-tools/
```

This is **less** than nine capabilities × two graphs × ten loop steps — and preserves all educational intent.

---

## 2. Accepted changes

| # | Change |
|---|--------|
| A1 | New documentation layer: **Educational Intelligence Architecture (EIA)** |
| A2 | **CDLI** defined as Captain’s pedagogical brain (developer-facing) |
| A3 | **Five capabilities** instead of nine independent systems |
| A4 | **Unified Operational Graph** (knowledge + scenarios + memory links) |
| A5 | **Seven-phase learning loop** aligned with existing learning-architecture |
| A6 | **Instructional principles** as immutable product rules |
| A7 | **Resource recommendation philosophy** (sources, not dependencies) |
| A8 | Product vision evolution: **AI Flight Instructor**, ICAO = Program 1 |
| A9 | Folder `flight-manual/educational-systems/` with normative pedagogy docs |
| A10 | Minimal cross-links in Sections 01, 02, 03A, 06, 10, 14 — backward compatible |

---

## 3. Rejected ideas (with reasons)

| Idea | Reason |
|------|--------|
| **CDLI as runtime module students trigger** | Violates Captain-as-only-face; adds UI complexity |
| **CDLI chooses next mission leg** | Violates ADR-001, ADR-009, Section 99 Rule 2 |
| **Separate Scenario Graph service** | Duplicate ontology; scenarios are graph edge types |
| **Learning Strategy capability** | Duplicates Mission Engine + exam rotation |
| **Discussion Engine as separate product module** | Specified under P1-6 + Adaptive Conversation LT |
| **Resource Recommendation Engine (URLs/videos)** | Maintenance burden; philosophy + categories sufficient |
| **Ten-step universal loop** | Redundant with Section 01 + learning-architecture |
| **Replacing Section 14 agent model** | Premature; agents become CDLI backends instead |
| **New `lib/cdli/` orchestrator in code now** | Documentation-first; avoid second brain in runtime |
| **Graph as authoritative curriculum CMS** | Wrong owner; missions + memory are source of truth |

---

## 4. Final educational architecture

### 4.1 Layers

```
┌─────────────────────────────────────────────────────────┐
│  Student experience — Captain Delta only                │
├─────────────────────────────────────────────────────────┤
│  Mission Engine — WHAT (legs, order, completion) LOCKED │
├─────────────────────────────────────────────────────────┤
│  EIA / CDLI — HOW (teach, calibrate, frame, remember)   │
├─────────────────────────────────────────────────────────┤
│  Learning Memory — WHAT WE KNOW about this pilot        │
├─────────────────────────────────────────────────────────┤
│  Learning Tools — IN-LEG mechanics (PA, replay, …)      │
├─────────────────────────────────────────────────────────┤
│  Implementation — prompts, APIs, lib/, Azure            │
└─────────────────────────────────────────────────────────┘
```

### 4.2 CDLI — five capabilities

| Capability | Responsibility | Does not |
|------------|----------------|----------|
| **1. Instructional Judgment** | One priority correction; questions before explanations; scenario-first framing | Skip legs; bulk feedback lists |
| **2. Assistance Calibration** | PA-1…5 fade; mission codes PR/VB/P1/P2; when to add/remove support | Replace Confidence Gates LT |
| **3. Operational Context** | Unified graph: topics, vocab, scenarios, mistakes, resources, memory | Author standalone lessons |
| **4. Instructor Voice** | Briefing, recall tone, debrief structure — from **read-only** mission summary | Mutate mission state |
| **5. Memory Synthesis** | Turn sessions into patterns Captain uses tomorrow | Store data without learning purpose |

### 4.3 Programs (future-safe)

| Concept | Owner |
|---------|-------|
| Program catalog (ICAO, CRM, HAA, …) | Product + future Mission Engine ADR |
| Program content (scenarios, terms) | Data layer + graph nodes |
| How Captain teaches in any program | CDLI (unchanged) |

---

## 5. Folder structure

```
flight-manual/
├── educational-systems/          ← NEW (EIA normative pedagogy)
│   README.md
│   captain-delta-learning-intelligence.md
│   instructional-principles.md
│   learning-loop.md
│   operational-knowledge-graph.md
│   scenario-graph.md
│   adaptive-operational-briefing.md
│   operational-confidence.md
│   resource-recommendation-philosophy.md
├── architecture/
│   rfc/
│   └── RFC-001-educational-intelligence-architecture.md  ← THIS FILE
│   learning-architecture.md      ← existing; links to EIA
│   ai-architecture.md            ← existing; links to CDLI
```

**No `lib/eia/` or `lib/cdli/` required** until a future implementation ADR justifies it. Prefer extending `lib/captainDelta/`, `lib/flightInstructor/`, prompts.

---

## 6. Updated documentation map

| Audience | Start here |
|----------|------------|
| Product / pedagogy | `educational-systems/README.md` → principles → CDLI |
| Engineering (missions) | `architecture/ARCHITECTURE-LOCK.md` (unchanged) |
| Engineering (Captain) | Section 02 + `educational-systems/captain-delta-learning-intelligence.md` |
| Engineering (AI) | Section 14 + `architecture/ai-architecture.md` |
| Gap / shipped | `CURRENT-PRODUCT.md`, `IMPLEMENTATION-STATUS.md` |

**DOCUMENTATION-HIERARCHY** gains one row:

| Layer | Document | Answers |
|-------|----------|---------|
| Educational Intelligence | `educational-systems/` | How Captain teaches; principles; graph model |

Flight Manual chapters 02–13 remain authoritative for **mission behavior**. EIA is authoritative for **teaching intelligence**.

---

## 7. Migration impact

| Area | Impact |
|------|--------|
| Mission Engine | **None** — frozen |
| ADRs 001–012 | **None** — EIA is additive |
| Runtime code | **None required** for RFC acceptance |
| Prompts | Future PRs align copy to instructional principles |
| Section 14 | Narrative update — agents map to CDLI capabilities |
| Learning tools | Unchanged ownership; cross-links only |
| IMPLEMENTATION-STATUS | New rows only when CDLI capabilities ship in code |
| Onboarding | Optional path for learning designers |

**Breaking changes:** none.

---

## 8. Future implementation guidance

### 8.1 When building a feature, ask

1. Which **mission leg** (Mission Engine)?  
2. Which **learning tool** (if any)?  
3. Which **CDLI capability** informs Captain’s behavior?  
4. Does Captain **read** mission state only (ADR-009)?  
5. Which **memory** fields are updated (Section 13)?

### 8.2 Suggested code evolution (no commitment)

| Capability | Natural home today | Future (if split) |
|------------|-------------------|-------------------|
| Instructional Judgment | `lib/flightInstructor/`, prompts | Same — keep one debrief schema |
| Assistance Calibration | `lib/difficultyInsights.ts`, PA in trainers | Confidence Gates LT integration |
| Operational Context | Derived from exams + `icaoVocabulary` + part2 data | Graph **view** module, not CMS |
| Instructor Voice | `lib/captainDelta/briefing.ts`, debrief builders | Enrich copy templates |
| Memory Synthesis | `lib/captainDelta/memory/`, instructor memory | Unified read API (Section 13 vision) |

### 8.3 Requires new ADR before implementation

- CDLI writing mission or leg completion  
- New Captain event namespace  
- Mission Engine `program` dimension  
- Student-facing “CDLI settings” or chat  
- Graph as source of truth overriding mission chapters  

### 8.4 Success metrics (architecture)

- Every new feature names one CDLI capability in PR description  
- No growth in Mission Engine orchestration files for teaching logic  
- Captain Delta prompt diffs cite instructional principle IDs  
- Program 2 can launch without renaming EIA folders  

---

## Approval

| Role | Decision | Date |
|------|----------|------|
| Chief Product Architect | Accept RFC-001 (documentation layer) | July 2026 |
| Mission Engine lock | Unchanged | July 2026 |

**Next recommended work:** Align prompts to [instructional-principles.md](../educational-systems/instructional-principles.md); implement Operational Graph as **read model** over existing exam data — not a new content pipeline.
