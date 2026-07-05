# Educational Systems

**Educational Intelligence Architecture (EIA)** — how Captain Delta teaches.

This folder defines **pedagogical architecture**. It does not replace the Mission Engine, ADRs, or learning-tools specs.

---

## Authority split (non-negotiable)

| Layer | Question | Owner | Locked? |
|-------|----------|-------|---------|
| **Mission Engine** | What should the student study next? | `lib/dailyMission.ts` | ✅ ADR-001–005 |
| **Educational Intelligence (EIA)** | How should Captain teach this student? | CDLI (conceptual) | This folder |
| **Captain Delta (UX)** | What does the student see and hear? | Section 02, `lib/captainDelta/` | ADR-009 |
| **Learning Memory** | What do we remember for tomorrow? | Section 13 | ADR-008 read/write rules |
| **Learning Tools** | Which orthogonals run inside legs? | `learning-tools/` | Matrix § tools |

Students never interact with EIA or CDLI directly. Developers and prompt authors do.

---

## Read order

1. [RFC-001](../architecture/rfc/RFC-001-educational-intelligence-architecture.md) — acceptance record, review, migration
2. [captain-delta-learning-intelligence.md](./captain-delta-learning-intelligence.md) — CDLI definition
3. [instructional-principles.md](./instructional-principles.md) — immutable teaching rules
4. [learning-loop.md](./learning-loop.md) — universal seven-phase loop
5. [operational-knowledge-graph.md](./operational-knowledge-graph.md) — knowledge + scenario model
6. [scenario-graph.md](./scenario-graph.md) — scenario navigation (subset of operational graph)
7. [adaptive-operational-briefing.md](./adaptive-operational-briefing.md) — briefing adaptation
8. [operational-confidence.md](./operational-confidence.md) — confidence vs ICAO level
9. [resource-recommendation-philosophy.md](./resource-recommendation-philosophy.md) — external sources

---

## Relationship to existing docs

| Existing | EIA relationship |
|----------|------------------|
| [02-captain-delta.md](../02-captain-delta.md) | Captain = persona; CDLI = pedagogical brain behind persona |
| [13-learning-memory.md](../13-learning-memory.md) | Memory stores facts; CDLI interprets patterns |
| [14-ai-brain.md](../14-ai-brain.md) | Agents = **implementation backends** for CDLI capabilities |
| [architecture/learning-architecture.md](../architecture/learning-architecture.md) | Pedagogy flow; EIA names the teaching intelligence layer |
| [ASSISTANCE-TAXONOMY.md](../ASSISTANCE-TAXONOMY.md) | PA/PR/VB/P1 codes; CDLI calibrates assistance level |
| [learning-tools/](../learning-tools/) | Tools execute inside legs; CDLI does not replace them |

---

## Program evolution (ICAO today, more tomorrow)

**ICAO/SDEA** is **Program 1** (`icao-english`). Future programs add manifests and content — see [21-training-programs.md](../21-training-programs.md).

- Mission Engine may gain a `program` dimension (future ADR-013+).
- EIA/CDLI remains program-agnostic: same principles, same loop, same Captain.

---

## Implementation status

EIA is **documentation-first** (RFC-001, July 2026). No new runtime module is required for the architecture to be valid.

Current code paths that already embody CDLI (partially):

- `lib/captainDelta/briefing.ts` — Instructor Voice (read-only mission)
- `lib/flightInstructor/` — Instructional Judgment (structured debrief)
- `lib/captainDelta/memory/` — Memory Synthesis (read-side)
- `lib/difficultyInsights.ts` — Assistance Calibration signals

Gaps are tracked in [IMPLEMENTATION-STATUS.md](../IMPLEMENTATION-STATUS.md), not invented here.

---

## Related

- [DOCUMENTATION-HIERARCHY.md](../DOCUMENTATION-HIERARCHY.md)
- [ARCHITECTURE-LOCK.md](../architecture/ARCHITECTURE-LOCK.md)
- [ADR-009 Captain Authority](../architecture/adr/ADR-009-captain-authority.md)
