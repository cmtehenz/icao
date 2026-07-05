# Section 21 — Training Programs

Version 1.0

Related

[architecture/training-program-architecture.md](./architecture/training-program-architecture.md)

[RFC-002](./architecture/rfc/RFC-002-training-programs-architecture.md)

[03-mission-engine.md](./03-mission-engine.md) · [educational-systems/](./educational-systems/)

[architecture/mission-flow-matrix.md](./architecture/mission-flow-matrix.md)

---

# Purpose

ICAO Delta is an **AI Flight Training Platform**.

**Training Programs** are educational packages built on that platform.

The platform answers:

- How does a student enroll, fly daily missions, receive instruction, and complete training?

Programs answer:

- What knowledge, scenarios, vocabulary, and outcomes define *this* course?

**ICAO English** (`icao-english`) is **Program 1** — the first official program. It is not the platform.

---

# Architecture

```
Platform (fixed)
├── Mission Engine      — what leg, what order, what complete
├── Captain Delta       — instructor face and voice
├── EIA / CDLI          — how Captain teaches
├── Learning Tools      — in-leg mechanics (PA, gates, replay, …)
├── Learning Memory       — what we remember
└── Infrastructure      — auth, Azure, sync, PWA

Training Programs (pluggable content)
├── Program manifest    — contract + matrix profile
├── Content packs       — vocab, scenarios, topics, media
├── Captain context     — briefing/debrief emphasis
└── Graph projection    — operational knowledge for this program
```

**Golden rule:** Programs **configure** the platform. Programs never **replace** Mission Engine, Captain Delta, EIA, or Learning Tools.

---

# Canonical program contract

Every program is described by a **manifest**. Optional sections are omitted when not applicable.

## Core fields (required)

| Field | Description |
|-------|-------------|
| **Program ID** | Stable slug, e.g. `icao-english`, `crm-essentials` |
| **Program name** | Display name |
| **Purpose** | One paragraph — why this program exists |
| **Target audience** | e.g. helicopter pilots preparing for SDEA |
| **Prerequisites** | Licenses, hours, prior programs |
| **Knowledge domains** | Tags, e.g. `atc-communication`, `crm`, `systems-h145` |
| **Mission template** | Matrix profile — which leg types, which modes |
| **Learning outcomes** | Observable skills on completion |
| **Completion rules** | What “done” means for the program |

## Operational content (as needed)

| Field | Description |
|-------|-------------|
| **Operational topics** | Part 1–style themes or briefing themes |
| **Vocabulary packs** | Term lists with operational meanings |
| **Pronunciation packs** | High-risk words for the program |
| **Scenarios** | Part 2–style situations, emergencies, CRM cases |
| **Media assets** | Audio, images — referenced by ID, not hardcoded URLs |

## Pedagogy & evaluation (as needed)

| Field | Description |
|-------|-------------|
| **Evaluation criteria** | Rubric dimensions (not necessarily ICAO levels) |
| **Captain Delta behaviour** | Context pack: tone emphasis, resource categories |
| **Recommended resources** | Categories per [resource-recommendation-philosophy.md](./educational-systems/resource-recommendation-philosophy.md) |
| **Progression model** | Standard / intense / recurrent templates |

## Credentials (optional)

| Field | Description |
|-------|-------------|
| **Certificates** | Metadata for completion credentials (platform issues later) |

## Mission template (matrix profile)

Programs reference **leg types** from the [Mission Flow Matrix](./architecture/mission-flow-matrix.md) — they do not invent parallel sequences.

Example profile (ICAO English — Intense):

| Leg type | Included |
|----------|----------|
| Pronunciation | ✓ |
| Vocabulary | ✓ |
| Part 1 | ✓ |
| Part 2 | ✓ |
| Mission Recall | ✓ |
| Mock Exam | ✓ (intense only) |
| Flight Debrief | ✓ |

Example profile (CRM Essentials — shorter):

| Leg type | Included |
|----------|----------|
| Vocabulary | ✓ (CRM terms) |
| Part 1 | ✓ (scenario discussion) |
| Part 2 | ✓ (communication drills) |
| Mission Recall | ✓ |
| Mock Exam | — |
| Flight Debrief | ✓ |

Same Mission Engine. Different template + content packs.

---

# Program life cycle

Every program follows the same life cycle. Platform stages are stable; program manifests supply the content at each stage.

```
1. Enrollment        — student joins program; prerequisites checked
2. Assessment        — placement or baseline (optional)
3. Mission Assignment — engine activates program template
4. Daily Missions    — ordered legs with program content packs
5. Adaptive Learning — CDLI calibrates assistance from memory
6. Evaluation        — scored activities per program rubric
7. Debrief           — Flight Debrief + Captain closure
8. Certification     — credential when completion rules met (optional)
9. Recurrent Training — refresher template on schedule (optional)
```

| Stage | Student feels | Program defines |
|-------|---------------|-----------------|
| Enrollment | “I joined a course.” | Name, prerequisites |
| Assessment | “Captain knows my starting point.” | Placement scenarios |
| Daily Missions | “Today’s flight has a clear path.” | Rotation + packs |
| Debrief | “I know one thing to improve.” | Focus domains |
| Recurrent | “Time to refresh.” | Shorter template |

---

# Program types (descriptive tags)

Programs may carry one or more tags. Tags are **not** exclusive classes.

| Tag | Examples |
|-----|----------|
| **Language** | ICAO English |
| **Operational** | CRM, decision making, offshore comms |
| **Aircraft** | H145 type rating oral, AW169 transition |
| **Procedural** | IFR refresher, NVG comms |
| **Company** | Operator SOP communication |
| **Emergency** | EMS multi-crew scenarios |
| **Simulator** | Sim-briefing companion (future boundary) |
| **Recurrent** | Annual proficiency refresh |
| **Special mission** | HAA, SAR, offshore |

---

# Program capabilities (optional)

Programs declare which capability packs they use. Unused capabilities are omitted.

| Capability | Platform consumer |
|------------|-----------------|
| Knowledge domains | Operational graph tags |
| Operational graph extension | CDLI Operational Context |
| Vocabulary packs | Vocabulary Mission content |
| Pronunciation packs | Pronunciation Mission content |
| Scenarios | Part 2 / Recall / Mock content |
| Audio / video media | Passive Flight Training, Escutar-style players |
| Interactive discussions | Part 1 conversation (P1-6) |
| Adaptive briefings | Captain Instructor Voice |
| Resource categories | Debrief enrichment |
| Evaluation rubrics | Evaluate + Flight Instructor JSON |

---

# Program isolation

A Training Program **must never**:

| Forbidden | Owner |
|-----------|-------|
| Replace or fork Mission Engine | `lib/dailyMission.ts` |
| Replace Captain Delta | Section 02 |
| Replace CDLI / EIA | RFC-001 |
| Fork Learning Tools | `learning-tools/` |
| Mutate ADRs or Mission Flow Matrix without ADR-013+ | Architecture lock |

A Training Program **may**:

| Allowed | Mechanism |
|---------|-----------|
| Supply daily content IDs | Content packs |
| Declare matrix profile | Mission template in manifest |
| Extend operational graph | Program-scoped nodes |
| Scope Captain copy | Context pack (read-only inputs) |
| Enable/disable tools per leg | Manifest flags |

---

# Examples

## Program 1 — ICAO English (`icao-english`)

| Contract field | Value |
|----------------|-------|
| Purpose | SDEA/ICAO exam operational English |
| Audience | Pilots facing ICAO speaking exam |
| Mission template | Full matrix — Standard + Intense |
| Content | Exam rotation 23C–26C, 42 Part 1 cards, Part 2 situations |
| Evaluation | ICAO-style levels via evaluate + instructor |
| Captain | Examiner mode in Mock; recall before intense mock |

**Platform today:** This is the **only shipped program**. Implementation is implicit (no `programId` yet).

---

## CRM Essentials (`crm-essentials`)

| Contract field | Value |
|----------------|-------|
| Purpose | Crew resource management communication |
| Audience | Line pilots, multi-crew crews |
| Mission template | Vocab → Part 1 discussion → Part 2 scenarios → Recall → Debrief |
| Content | CRM scenarios, assertiveness vocab, debrief on teamwork |
| Evaluation | Communication clarity, not ICAO level |
| Captain | Scenario-first framing (IP-04) |

**Platform change required:** **No** — content and template only.

---

## H145 Type Rating — Oral Communication (`h145-type-rating`)

| Contract field | Value |
|----------------|-------|
| Purpose | Oral exam communication for H145 type rating |
| Audience | Pilots in type rating course |
| Prerequisites | Program 1 recommended, not required |
| Content | Systems vocabulary, emergency scenarios, AFM-aligned phrases |
| Scenarios | Engine failure, hydraulics, fuel, autorotation comms |
| Evaluation | Type-specific rubric |

**Platform change required:** **No** for communication track. Full sim integration = future ADR boundary.

---

## IFR Refresher (`ifr-refresher`)

| Contract field | Value |
|----------------|-------|
| Purpose | Refresh IFR phraseology and readback accuracy |
| Audience | IFR-rated pilots on recurrent cycle |
| Mission template | Pronunciation (clearance terms) → Part 2 readback-heavy → Debrief |
| Content | Clearance scenarios, holding, approach readbacks |
| Mock Exam | Omitted |

**Platform change required:** **No**.

---

## AW169 Transition (`aw169-transition`)

| Contract field | Value |
|----------------|-------|
| Purpose | Differences communication — AW139/AW169 or similar |
| Audience | Pilots transitioning type |
| Content | Differences vocab, new system terms, comparative scenarios |
| Mission template | Shortened daily — vocab + scenarios + debrief |

**Platform change required:** **No**.

---

## Offshore Operations (`offshore-ops`)

| Contract field | Value |
|----------------|-------|
| Purpose | Offshore helicopter operational English |
| Audience | Offshore pilots, HAA-bound crews |
| Content | Weather, passenger brief, deck ops phraseology |
| Passive | Audio missions for listen-first exposure |
| Tags | Operational, Special mission |

**Platform change required:** **No** for communication program.

---

# Integration

| Platform layer | How programs integrate |
|----------------|------------------------|
| **Mission Engine** | `missionTemplate` selects leg types and modes; rotation rules in manifest |
| **Captain Delta** | `captainContextPack` — briefing/debrief emphasis, resource categories |
| **CDLI** | Graph nodes from program; same five capabilities |
| **Learning Tools** | `enabledTools[]` per leg type in manifest |
| **Learning Memory** | Scoped by `programId` when implemented |
| **CURRENT-PRODUCT** | Lists shipped programs only |

Diagram: [training-program-architecture.md](./architecture/training-program-architecture.md)

---

# Future expansion

| Phase | Deliverable |
|-------|-------------|
| **Documentation (now)** | Manifest spec, examples, RFC-002 |
| **ADR-013+** | `programId`, enrollment, engine reads template |
| **Content** | Additional manifests without code changes |
| **Platform** | Certificates, LMS enrollment, sim hooks — only if ADR-approved |

New programs should be **addable through configuration and content**, not architectural redesign.

---

# Related

- [01-product-philosophy.md](./01-product-philosophy.md) — AI Flight Instructor vision
- [RFC-001](./architecture/rfc/RFC-001-educational-intelligence-architecture.md) — EIA / CDLI
- [CURRENT-PRODUCT.md](./CURRENT-PRODUCT.md) — Program 1 shipped today
- [18-product-roadmap.md](./18-product-roadmap.md) — program roadmap by era
