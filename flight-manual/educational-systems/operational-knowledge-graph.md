# Operational Knowledge Graph

**Knowledge in ICAO Delta is connected — never isolated.**

This document defines the **conceptual graph**. The graph is a **read model** over missions, exam data, and Learning Memory — not a separate curriculum CMS.

Related: [scenario-graph.md](./scenario-graph.md) · [13-learning-memory.md](../13-learning-memory.md) · [16-icao-knowledge-base.md](../16-icao-knowledge-base.md)

---

## Philosophy

Pilots do not learn "lesson 7." They learn **relationships**:

- A word appears in a scenario
- A scenario demands a readback skill
- A mistake in Part 2 links to vocabulary weakness
- An official resource deepens CRM judgment

Captain navigates these relationships naturally. CDLI **Operational Context** capability uses the graph to frame teaching.

---

## One graph, typed nodes

RFC-001 **rejects** maintaining separate "Knowledge Graph" and "Scenario Graph" services. Use **one operational graph** with node types:

| Node type | Examples | Primary source |
|-----------|----------|----------------|
| `topic` | Weather, CRM, emergencies | Part 1 cards, program curriculum |
| `term` | MAYDAY, turbulence, clearance | `icaoVocabulary`, vault |
| `pronunciation` | Word + operational phrase | Pronunciation vault |
| `scenario` | Engine failure on departure | Part 2 exam situations |
| `skill` | Readback, reported speech, picture description | Parts 2–4 |
| `mistake` | Repeated phoneme, missed altitude | Instructor memory, evaluations |
| `resource` | FAA AIM chapter, ASRS report | Resource categories |
| `memory` | Captain observation pattern | Captain Delta memory |

Edges express relationships (see below).

---

## Edge types

| Edge | Meaning | Example |
|------|---------|---------|
| `uses_term` | Scenario requires vocabulary | Bird strike → MAYDAY |
| `tests_skill` | Scenario assesses skill | Readback scenario → readback skill |
| `follows_topic` | Part 1 question theme | Q12 → weather topic |
| `prerequisite` | Suggested order (pedagogy) | CRM → decision making |
| `confused_with` | Common student error | PAN vs MAYDAY |
| `reinforces` | Recall link | Pronunciation word → Part 2 report |
| `deepened_by` | Resource enriches node | Autorotation → FAA handbook category |
| `appeared_in` | Student history | Mistake → session date |

**Mission Engine** still owns leg order. Edges inform **how Captain teaches** — not checkbox unlock trees.

---

## What the graph is not

| Anti-pattern | Why |
|--------------|-----|
| Hand-authored courseware replacing Section 04–07 | Duplicates mission chapters |
| Student-visible skill tree UI (required) | Scope creep — optional Situation Board later |
| Captain mutating graph to skip missions | Violates ADR-009 |
| Scraped video playlist | Violates resource philosophy |

---

## Construction (implementation guidance)

**Phase 1 (now):** Graph is **implicit** in existing data:

- `data/exams/part2Data.ts` — scenarios
- `data/icaoVocabulary.ts` — terms
- `cards.json` — Part 1 topics
- Vault + evaluations — mistakes

**Phase 2:** Lightweight **derived index** (read-only) built at build time or on login — projects relationships for debrief and Situation Board.

**Phase 3:** Program dimension adds nodes without new graph architecture.

---

## Captain navigation (pedagogical)

Captain moves between related nodes in copy only:

> "Today's bird strike scenario connects to the MAYDAY vocabulary you practiced this morning."

> "Your readback hesitation links to altitude clearances — we'll keep that in tomorrow's focus."

No new UI required for graph value.

---

## Memory integration

Graph **mistake** and **memory** nodes feed CDLI Memory Synthesis. Writes follow Section 13 rules — learning purpose only.

---

## Related

- [scenario-graph.md](./scenario-graph.md) — scenario chains
- [resource-recommendation-philosophy.md](./resource-recommendation-philosophy.md)
- [captain-delta-learning-intelligence.md](./captain-delta-learning-intelligence.md)
