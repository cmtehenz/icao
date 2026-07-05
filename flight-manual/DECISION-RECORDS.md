# Decision Records

**Irreversible product and documentation architecture decisions.**

Prevents future contributors from undoing intentional design without explicit review.

Format: **Decision NNN** · Title · Status · Date · Context · Decision · Alternatives rejected · Consequences

---

## Decision 001 — Mission Recall (formerly Rapid Review)

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026 (documentation architecture pass) |
| **Context** | “Rapid Review” sounded like a generic quiz. The leg is active recall before evaluation. |
| **Decision** | Rename to **Mission Recall**. Canonical spec: [08-mission-recall.md](./08-mission-recall.md). Canonical sequence: [architecture/mission-flow-matrix.md](./architecture/mission-flow-matrix.md). |
| **Alternatives** | Keep “Rapid Review”; merge into Flight Debrief. |
| **Consequences** | All new writing uses Mission Recall. “Quick Review” reserved for informal scheduling copy only (not the mission leg). |

---

## Decision 002 — Captain Radio under Audio Missions infrastructure

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026 |
| **Context** | Captain Radio is voice during passive listening. |
| **Decision** | **Captain Radio** is a learning tool ([learning-tools/captain-radio.md](./learning-tools/captain-radio.md)) that runs on **Audio Missions** infrastructure ([11-audio-missions.md](./11-audio-missions.md)). Pedagogy in learning-tools; delivery in Section 11. |
| **Alternatives** | Merge Captain Radio into Captain Delta core chapter only. |
| **Consequences** | Do not delete Section 11 when editing Captain Radio. |

---

## Decision 003 — Mission Engine (03) and Complete Flight Mission (03A) remain separate

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026 |
| **Context** | Audit suggested merging orchestration and UX blueprint. |
| **Decision** | Keep both documents. **03** = product orchestration (Mission Engine, rotation, why legs exist). **03A** = complete student experience blueprint (Begin Flight, emotional arc, UX copy patterns). |
| **Alternatives** | Single merged chapter. |
| **Consequences** | Leg **order** is defined only in [architecture/mission-flow-matrix.md](./architecture/mission-flow-matrix.md). 03 and 03A reference the matrix; they do not compete on sequence. |

---

## Decision 004 — Audio Missions (11) and Passive Flight Training (learning tool) remain separate

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026 |
| **Context** | Audit flagged ~80% overlap between Section 11 and `passive-flight-training.md`. |
| **Decision** | **Section 11** = infrastructure (routes, audio assets, modes, Escutar Prova, technical delivery). **Passive Flight Training** learning tool = pedagogy (when to listen, Captain behavior, reinforcement loop). |
| **Alternatives** | Collapse into one file. |
| **Consequences** | Overlap in philosophy is intentional. Contradictions in **behavior** must be fixed; repetition in **why** is preserved. |

---

## Decision 005 — Learning Tools vs Mission Chapters

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026 |
| **Context** | Progressive Assistance appears in many files. |
| **Decision** | **Learning tools** define cross-cutting methodology. **Mission chapters** explain how methodology applies to that mission. **Do not merge** to reduce page count. |
| **Alternatives** | DRY-only docs; single progressive-assistance pointer everywhere. |
| **Consequences** | Large manual is acceptable. Conflicting specs are not. Use [ASSISTANCE-TAXONOMY.md](./ASSISTANCE-TAXONOMY.md) for code alignment. |

---

## Decision 006 — Documentation hierarchy (vision vs shipped)

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | July 2026 |
| **Context** | “Manual wins” conflicted with CURRENT-PRODUCT. |
| **Decision** | Adopt [DOCUMENTATION-HIERARCHY.md](./DOCUMENTATION-HIERARCHY.md). Flight Manual = product behavior. CURRENT-PRODUCT = shipped. IMPLEMENTATION-STATUS = gap. |
| **Alternatives** | Manual always wins over code for engineering decisions. |
| **Consequences** | README no longer implies unfinished spec is already live. |

---

## Decision 007 — Canonical mission sequence in Mission Flow Matrix

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | July 2026 |
| **Context** | Four documents defined conflicting leg order and Recall content. |
| **Decision** | [architecture/mission-flow-matrix.md](./architecture/mission-flow-matrix.md) is the **only** sequence authority. Mission Recall content = Section 08 only. |
| **Alternatives** | Let 03 override 03A. |
| **Consequences** | Informal bullet lists in other chapters must be removed or labeled non-canonical when they conflict. |

---

## Decision 008 — Assistance taxonomy (no ICAO rename)

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | July 2026 |
| **Context** | “Level” overloaded (assistance, graduation, ICAO exam). |
| **Decision** | Introduce PA / PR / VB / P1… codes in [ASSISTANCE-TAXONOMY.md](./ASSISTANCE-TAXONOMY.md). **Do not** rename ICAO Level 4/5. |
| **Alternatives** | Rename all “levels” globally in one pass. |
| **Consequences** | Gradual adoption; student-facing prose unchanged for now. |

---

## Decision 009 — Situation Board naming

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026 |
| **Context** | Legacy names: Operations Room, Operational Situation Analysis. |
| **Decision** | **Situation Board** is the product term. **Instructor Whiteboard** is the final stage inside it. |
| **Alternatives** | Keep Operations Room as synonym in new writing. |
| **Consequences** | TERMINOLOGY deprecates Operations Room only — not Situation Board itself. |

---

## Decision 010 — Roadmap “Era” naming

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | July 2026 |
| **Context** | Roadmap “Version 4–7” collided with per-chapter `Version 3.0` headers. |
| **Decision** | Long-term roadmap buckets are **Era 4–10** in [18-product-roadmap.md](./18-product-roadmap.md). Chapter headers remain document revision versions. |
| **Alternatives** | Remove version headers from chapters. |
| **Consequences** | “Version 5.0” on Section 06 = chapter revision, not product Era 5. |

---

## Decision 011 — Runtime map describes code, not aspiration

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | July 2026 |
| **Context** | Implementation Maps referenced non-existent folders. |
| **Decision** | [architecture/runtime-map.md](./architecture/runtime-map.md) = current code only. Mission chapters split **Current Implementation** vs **Target Architecture**. |
| **Alternatives** | Delete all Implementation Maps. |
| **Consequences** | Target architecture remains in specs for planning; runtime map stays truthful. |

---

## Decision 012 — Educational Intelligence Architecture (EIA) and CDLI

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | July 2026 |
| **Context** | Product vision evolves Captain Delta into an AI Flight Instructor. Risk of duplicating Mission Engine, learning tools, and Section 14 agents. |
| **Decision** | Add **EIA** documentation layer (`educational-systems/`). **CDLI** = five pedagogical capabilities behind Captain. Mission Engine remains sole owner of leg order (ADR-001–005). RFC: [RFC-001](./architecture/rfc/RFC-001-educational-intelligence-architecture.md). |
| **Alternatives** | Nine independent CDLI modules; separate Knowledge + Scenario graphs; `lib/cdli/` runtime orchestrator; CDLI choosing next leg. |
| **Consequences** | Features cite one CDLI capability. Section 14 agents map to CDLI backends. No Mission Engine changes from EIA alone. Program 2+ uses same EIA. |

---

## Decision 013 — Training Programs Architecture (TPA)

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | July 2026 |
| **Context** | Product centered on ICAO implicitly. Long-term vision requires CRM, type rating, SOP, and other programs without platform redesign. |
| **Decision** | **Training Programs** are top-level content packages on a fixed platform. **ICAO English** = Program 1. Programs **configure** Mission Engine, Captain, EIA, and Learning Tools — never replace them. RFC: [RFC-002](./architecture/rfc/RFC-002-training-programs-architecture.md). Spec: [21-training-programs.md](./21-training-programs.md). |
| **Alternatives** | Per-program Mission Engine; per-program Captain; mandatory 20-field contract for every program; program-specific CDLI. |
| **Consequences** | New programs = manifest + content packs. `programId` and engine template binding require ADR-013+. Matrix leg **types** remain canonical. |

---

## Decision 014 — Platform freeze (RFC-003)

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | July 2026 |
| **Context** | RFC-001–002 established EIA and TPA. Implementation risk: unbounded architecture churn before shipping Program 1 depth and Program 2 enablers. |
| **Decision** | **Platform architecture frozen** after RFC-003 stress test. Governance in [ARCHITECTURE-FREEZE.md](./ARCHITECTURE-FREEZE.md). Fifteen platform principles in Section 22. North Star in Section 23. ADR-014+ required for authority changes. Long implementation phase authorized. |
| **Alternatives** | Continue architecture RFCs per feature; merge layers into code prematurely. |
| **Consequences** | PRs cite PP-*; K/L (sim/LMS) deferred to Infrastructure RFC; `programId` is implementation not redesign. |

---

## Adding a new decision

1. Append the next **Decision NNN**.  
2. Link from PR description.  
3. Update [AUDIT-RESOLUTION.md](./AUDIT-RESOLUTION.md) if responding to audit pressure.

**Engineering architecture:** [architecture/adr/](./architecture/adr/) — ADR-008+ for implementation architecture changes after [ARCHITECTURE-LOCK.md](./architecture/ARCHITECTURE-LOCK.md) approval.
