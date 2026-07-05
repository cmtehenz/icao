# Onboarding — Flight Manual

**Reading paths for new contributors.**

ICAO Delta is a Digital Flight Academy. You are learning **product methodology** and **code reality** — not “an English app.”

Start with [DOCUMENTATION-HIERARCHY.md](./DOCUMENTATION-HIERARCHY.md) so you know which document wins for which question.

---

## 4 hours — Understand the product

**Goal:** Explain ICAO Delta to a pilot or PM without opening the codebase.

| Order | Document | Why |
|-------|----------|-----|
| 1 | [00-introduction.md](./00-introduction.md) | Vision and promise |
| 2 | [01-product-philosophy.md](./01-product-philosophy.md) | Why missions, not modules |
| 3 | [99-non-negotiable-rules.md](./99-non-negotiable-rules.md) | Ten inviolable rules |
| 4 | [TERMINOLOGY.md](./TERMINOLOGY.md) | One name per concept |
| 5 | [architecture/mission-flow-matrix.md](./architecture/mission-flow-matrix.md) | Canonical flight sequence |
| 6 | [02-captain-delta.md](./02-captain-delta.md) | Who guides the student |
| 7 | [CURRENT-PRODUCT.md](./CURRENT-PRODUCT.md) | What is actually shipped |

**Optional if time remains:** [03A-complete-flight-mission.md](./03A-complete-flight-mission.md) (student journey narrative)

### Not required in the first 4 hours

- Individual learning-tools (all 13)
- Sections 14–16 (AI brain, prompts, knowledge base)
- [IMPLEMENTATION-STATUS.md](./IMPLEMENTATION-STATUS.md) (unless you are estimating work)
- Mission chapters 04–11 in full
- [FLIGHT-MANUAL-AUDIT.md](./FLIGHT-MANUAL-AUDIT.md) / [AUDIT-RESOLUTION.md](./AUDIT-RESOLUTION.md)

---

## 1 day — Contribute safely

**Goal:** Open a correct PR without violating pedagogy or shipping fiction.

| Order | Document | Why |
|-------|----------|-----|
| 1 | Complete **4-hour path** above | Baseline |
| 2 | [DOCUMENTATION-HIERARCHY.md](./DOCUMENTATION-HIERARCHY.md) | Vision vs shipped |
| 3 | [IMPLEMENTATION-STATUS.md](./IMPLEMENTATION-STATUS.md) | What is 🔴 vs ✅ |
| 4 | [architecture/runtime-map.md](./architecture/runtime-map.md) | Real file paths |
| 5 | [03-mission-engine.md](./03-mission-engine.md) | Orchestration |
| 6 | [ASSISTANCE-TAXONOMY.md](./ASSISTANCE-TAXONOMY.md) | PA / PR / P1 codes |
| 7 | [17-development-rules.md](./17-development-rules.md) | PR discipline |
| 8 | Chapter for your task (04–11) | Mission-specific behavior |
| 9 | [`docs/api.md`](../docs/api.md) + [`prompts/README.md`](../prompts/README.md) | Technical contracts |

**By task type:**

| Task | Add |
|------|-----|
| Captain / debrief | 02, 10, `lib/captainDelta/` per runtime-map |
| Daily mission | 03, mission-flow-matrix, `lib/dailyMission.ts` |
| Pronunciation | 04, `learning-tools/progressive-assistance.md` (PA section only) |
| Part 1 / PEEL | 06, `lib/peelBlocks.ts` |
| Simulado | 09, `lib/simulado/` |
| UI / design | 12 |

### Not required on day one

- Full read of every learning-tool (~6,000+ lines)
- [14-ai-brain.md](./14-ai-brain.md) agent fleet (vision)
- [18-product-roadmap.md](./18-product-roadmap.md) beyond skim
- [16-icao-knowledge-base.md](./16-icao-knowledge-base.md) unless editing aviation content
- All of [03A-complete-flight-mission.md](./03A-complete-flight-mission.md) if you are not doing UX/mission board work

---

## 1 week — Understand architecture

**Goal:** Design features that fit Mission Engine, Learning Memory, and learning tools.

| Day | Focus | Documents |
|-----|-------|-----------|
| 1 | Product + hierarchy | 4-hour path + DOCUMENTATION-HIERARCHY |
| 2 | Missions | 04–08 + mission-flow-matrix |
| 3 | Evaluation + debrief | 09, 10, `learning-tools/replay-debrief.md` |
| 4 | Learning tools layer | [learning-tools/README.md](./learning-tools/README.md) + progressive-assistance, confidence-gates, visual-coaching |
| 5 | Architecture folder | product-map, product-architecture, learning-architecture, data-flow, ai-architecture |
| 6 | AI + prompts | 14, 15, `prompts/`, ai-architecture |
| 7 | Memory + roadmap | 13, IMPLEMENTATION-STATUS, 18, DECISION-RECORDS |

**Always keep open:** [runtime-map.md](./architecture/runtime-map.md), [CURRENT-PRODUCT.md](./CURRENT-PRODUCT.md)

### Still optional at one week

- Line-by-line read of passive-flight-training + audio-missions (read when building Section 11)
- situation-board, mission-readiness, flight-logbook until assigned
- [FLIGHT-MANUAL-AUDIT.md](./FLIGHT-MANUAL-AUDIT.md) (historical; prefer AUDIT-RESOLUTION)

---

## Roles (quick pointers)

| Role | Priority after hierarchy |
|------|--------------------------|
| **Frontend** | runtime-map, 12, mission chapter, CURRENT-PRODUCT |
| **Backend** | runtime-map, docs/api, docs/database, 13 |
| **AI / prompts** | 14, 15, ai-architecture, prompts/ |
| **Product / pedagogy** | 01, 03, 03A, learning-tools for assigned feature |
| **QA** | mission-flow-matrix, CURRENT-PRODUCT, intense vs standard |

---

## Golden rule for readers

When two documents overlap, ask:

> Are they describing the **same thing**, or the **same thing from different perspectives**?

| Pair | Relationship |
|------|--------------|
| 03 vs 03A | Orchestration vs UX — **both required** |
| 11 vs passive-flight-training | Infrastructure vs pedagogy — **both required** |
| Mission chapter vs learning tool | Application vs methodology — **both required** |
| Flight Manual vs CURRENT-PRODUCT | Vision vs shipped — **different layers** |

---

## Related

- [README.md](./README.md)  
- [DECISION-RECORDS.md](./DECISION-RECORDS.md)
