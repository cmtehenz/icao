# ICAO Delta Flight Manual

**Authoritative specification for product behavior.**

ICAO Delta is a **Digital Flight Academy** — not an English learning application. This manual defines what we build and why.

**Documentation hierarchy:** [DOCUMENTATION-HIERARCHY.md](./DOCUMENTATION-HIERARCHY.md) — Flight Manual = product vision; CURRENT-PRODUCT = shipped today; IMPLEMENTATION-STATUS = gap.

**New contributors:** [ONBOARDING.md](./ONBOARDING.md)

**Read first:** [00-introduction.md](./00-introduction.md) · [TERMINOLOGY.md](./TERMINOLOGY.md) · [CURRENT-PRODUCT.md](./CURRENT-PRODUCT.md)

---

## Five-minute orientation

| Question | Answer |
|----------|--------|
| What is ICAO Delta? | **AI Flight Training Platform** — guided daily missions, Captain Delta instructs |
| What is ICAO English? | **Program 1** — first official training program (SDEA/ICAO exam) |
| Who guides the student? | **Captain Delta** — senior instructor, never a chatbot |
| What does the student do? | **Keep flying** — see [mission-flow-matrix.md](./architecture/mission-flow-matrix.md) (Standard / Intense / Passive) |
| How is progress stored? | **Learning Memory** (product) + PostgreSQL (technical) — see [13-learning-memory.md](./13-learning-memory.md) |
| What's built today? | [CURRENT-PRODUCT.md](./CURRENT-PRODUCT.md) |
| What's planned? | [18-product-roadmap.md](./18-product-roadmap.md) |
| Implementation truth table? | [IMPLEMENTATION-STATUS.md](./IMPLEMENTATION-STATUS.md) |

---

## Document map

### Core manual

Foundational chapters — missions, Captain Delta, methodology.

| # | Chapter | One sentence |
|---|---------|--------------|
| 00 | [00-introduction.md](./00-introduction.md) | Vision, promise, and motto: one mission, one flight, Captain always guides. |
| 01 | [01-product-philosophy.md](./01-product-philosophy.md) | Why we exist, learning philosophy, progressive training, and product rules. |
| 02 | [02-captain-delta.md](./02-captain-delta.md) | Captain Delta identity, modes, personality, voice, and coaching boundaries. |
| 03 | [03-mission-engine.md](./03-mission-engine.md) | Daily exam rotation, mission sequence, and the central workflow engine. |
| 03A | [03A-complete-flight-mission.md](./03A-complete-flight-mission.md) | End-to-end blueprint of one training flight from app open to debrief. |
| 04 | [04-pronunciation.md](./04-pronunciation.md) | Pronunciation Mission — vault, four levels, graduation, daily five words. |
| 05 | [05-vocabulary.md](./05-vocabulary.md) | Vocabulary Mission — operational terms, SRS, twenty words per exam day. |
| 06 | [06-part1.md](./06-part1.md) | Part 1 Mission — professional aviation conversation, not memorization. |
| 07 | [07-part2.md](./07-part2.md) | Part 2 Mission — readback, interaction, quick notes, operational pressure. |
| 08 | [08-mission-recall.md](./08-mission-recall.md) | Mission Recall — active confidence check before Mock Exam. |
| 09 | [09-mock-exam.md](./09-mock-exam.md) | Mock Exam — full SDEA simulation; Captain becomes examiner. |
| 10 | [10-debrief.md](./10-debrief.md) | Flight Debrief — close every session with improvement and tomorrow's focus. |
| 11 | [11-audio-missions.md](./11-audio-missions.md) | Passive Flight Training — listen-first missions away from the desk. |
| 12 | [12-design-system.md](./12-design-system.md) | Experience and design system — digital flight academy, not language app UI. |
| 13 | [13-learning-memory.md](./13-learning-memory.md) | Learning Memory — what Captain Delta remembers and why. |
| 21 | [21-training-programs.md](./21-training-programs.md) | Training Programs — pluggable courses on the platform; ICAO English = Program 1. |
| 22 | [22-platform-principles.md](./22-platform-principles.md) | Immutable platform rules (PP-01…PP-15) — mandatory for PRs and RFCs. |
| 23 | [23-product-north-star.md](./23-product-north-star.md) | Non-technical vision compass — what success feels like. |
| 99 | [99-non-negotiable-rules.md](./99-non-negotiable-rules.md) | Ten inviolable product rules in one page. |

### Platform governance

| Document | One sentence |
|----------|--------------|
| [ARCHITECTURE-FREEZE.md](./ARCHITECTURE-FREEZE.md) | What requires an RFC vs content-only change — platform frozen after RFC-003. |
| [IMPLEMENTATION-READINESS.md](./IMPLEMENTATION-READINESS.md) | Confidence scores and blockers before long implementation phase. |
| [DOCUMENTATION-AUDIT.md](./DOCUMENTATION-AUDIT.md) | RFC-003 consistency review of the Flight Manual. |

### Educational systems (how Captain teaches)

**EIA / CDLI** — pedagogical architecture. Index: [educational-systems/README.md](./educational-systems/README.md) · [RFC-001](./architecture/rfc/RFC-001-educational-intelligence-architecture.md)

| Document | One sentence |
|----------|--------------|
| [captain-delta-learning-intelligence.md](./educational-systems/captain-delta-learning-intelligence.md) | CDLI — five capabilities behind Captain Delta. |
| [instructional-principles.md](./educational-systems/instructional-principles.md) | Immutable teaching rules (IP-01…IP-14). |
| [learning-loop.md](./educational-systems/learning-loop.md) | Seven-phase universal learning loop. |
| [operational-knowledge-graph.md](./educational-systems/operational-knowledge-graph.md) | Connected knowledge model — topics, terms, scenarios, memory. |
| [scenario-graph.md](./educational-systems/scenario-graph.md) | Scenario relationship chains for recall and debrief. |
| [adaptive-operational-briefing.md](./educational-systems/adaptive-operational-briefing.md) | Briefing adapts copy, not mission order. |
| [operational-confidence.md](./educational-systems/operational-confidence.md) | Confidence vs ICAO level vs assistance codes. |
| [resource-recommendation-philosophy.md](./educational-systems/resource-recommendation-philosophy.md) | Authoritative sources — categories, not brittle links. |

### Learning tools

Cross-cutting methodologies and instructor systems. Index: [learning-tools/README.md](./learning-tools/README.md)

| Tool | One sentence |
|------|--------------|
| [progressive-assistance.md](./learning-tools/progressive-assistance.md) | Core pedagogy — five assistance levels until independent operational speech. |
| [confidence-gates.md](./learning-tools/confidence-gates.md) | Advance only when confidence is demonstrated, not when a screen is completed. |
| [conversation-confidence.md](./learning-tools/conversation-confidence.md) | Estimates readiness for real aviation conversation under pressure. |
| [mission-readiness.md](./learning-tools/mission-readiness.md) | Radar and levels for how ready the student is for today's mock exam. |
| [mission-timeline.md](./learning-tools/mission-timeline.md) | Visual timeline of today's mission legs and progress states. |
| [situation-board.md](./learning-tools/situation-board.md) | Situation Board and Instructor Whiteboard — operational picture after missions. |
| [quick-notes.md](./learning-tools/quick-notes.md) | Pilot-style shorthand for Part 2 and Part 3 note-taking. |
| [replay-debrief.md](./learning-tools/replay-debrief.md) | Replay best and weak moments with Captain Delta for reinforcement. |
| [visual-coaching.md](./learning-tools/visual-coaching.md) | One visual focus at a time — keywords, syllables, structure by context. |
| [flight-logbook.md](./learning-tools/flight-logbook.md) | Professional log of missions, growth, and milestones. |
| [captain-radio.md](./learning-tools/captain-radio.md) | Captain's brief radio voice during Passive Flight Training. |
| [passive-flight-training.md](./learning-tools/passive-flight-training.md) | Driving, walking, and flight modes for listen-first study. |
| [adaptive-conversation-engine.md](./learning-tools/adaptive-conversation-engine.md) | Dynamic conversation states for Part 1 follow-up and interaction. |

### Architecture (how the system works)

System design — not feature specs. Folder: [architecture/](./architecture/)

| Document | One sentence |
|----------|--------------|
| [product-architecture.md](./architecture/product-architecture.md) | How product layers (missions, tools, Captain) relate. |
| [learning-architecture.md](./architecture/learning-architecture.md) | How pedagogy flows through Progressive Assistance and gates. |
| [ai-architecture.md](./architecture/ai-architecture.md) | How AI agents map to APIs and Captain Delta orchestration. |
| [data-flow.md](./architecture/data-flow.md) | How data moves from speech → evaluation → memory → next mission. |
| [folder-structure.md](./architecture/folder-structure.md) | Repository layout: manual, prompts, docs, assets, app code. |
| [mission-flow-matrix.md](./architecture/mission-flow-matrix.md) | **Canonical** mission leg order — Standard, Intense, Passive. |
| [runtime-map.md](./architecture/runtime-map.md) | Real codebase entry points (current implementation only). |
| [product-map.md](./architecture/product-map.md) | Information exchange between modules (not leg order). |
| [training-program-architecture.md](./architecture/training-program-architecture.md) | How programs plug into Mission Engine, Captain, EIA — platform fixed. |
| [rfc/RFC-001-educational-intelligence-architecture.md](./architecture/rfc/RFC-001-educational-intelligence-architecture.md) | EIA acceptance — how Captain teaches. |
| [rfc/RFC-002-training-programs-architecture.md](./architecture/rfc/RFC-002-training-programs-architecture.md) | TPA acceptance — programs as content on platform. |
| [rfc/RFC-003-architecture-stress-test-platform-freeze.md](./architecture/rfc/RFC-003-architecture-stress-test-platform-freeze.md) | Platform freeze — stress test and governance. |

### AI brain & engineering reference

| # | Chapter | One sentence |
|---|---------|--------------|
| 14 | [14-ai-brain.md](./14-ai-brain.md) | Specialized AI instructors orchestrated by Captain Delta. |
| 15 | [15-prompt-engineering.md](./15-prompt-engineering.md) | Prompts as software — one responsibility, predictable JSON outputs. |
| 16 | [16-icao-knowledge-base.md](./16-icao-knowledge-base.md) | Structured aviation knowledge all agents consult. |
| 17 | [17-development-rules.md](./17-development-rules.md) | Four questions every implementation must pass. |
| 18 | [18-product-roadmap.md](./18-product-roadmap.md) | Released, in development, next version, and long-term vision. |

### Status, taxonomy & governance (meta)

| Document | Purpose |
|----------|---------|
| [DOCUMENTATION-HIERARCHY.md](./DOCUMENTATION-HIERARCHY.md) | Which document wins for vision vs shipped vs technical |
| [CURRENT-PRODUCT.md](./CURRENT-PRODUCT.md) | What exists in production **today** — no vision |
| [IMPLEMENTATION-STATUS.md](./IMPLEMENTATION-STATUS.md) | Spec vs backend vs frontend vs Azure — truth tables |
| [TERMINOLOGY.md](./TERMINOLOGY.md) | Authoritative glossary — one name per concept |
| [ASSISTANCE-TAXONOMY.md](./ASSISTANCE-TAXONOMY.md) | PA / PR / VB / P1 codes — disambiguates “Level” |
| [DECISION-RECORDS.md](./DECISION-RECORDS.md) | Irreversible product and documentation decisions |
| [ONBOARDING.md](./ONBOARDING.md) | 4h / 1d / 1w reading paths |
| [AUDIT-RESOLUTION.md](./AUDIT-RESOLUTION.md) | Chief Product Architect response to 2026 audit |
| [FLIGHT-MANUAL-AUDIT.md](./FLIGHT-MANUAL-AUDIT.md) | Senior architect audit (July 2026) — historical |
| [IMPLEMENTATION-ROADMAP.md](./IMPLEMENTATION-ROADMAP.md) | 16-sprint master plan |
| [SPRINT-0-REPORT.md](./SPRINT-0-REPORT.md) | Sprint 0 findings |
| [architecture/ARCHITECTURE-FINAL-REVIEW.md](./architecture/ARCHITECTURE-FINAL-REVIEW.md) | Architecture phase complete · Sprint 1 authorized |

---

## Repository folders (outside this manual)

| Folder | Role |
|--------|------|
| [`prompts/`](../prompts/) | AI system prompts only — must reference this manual |
| [`docs/`](../docs/) | Technical docs (API, Prisma, Azure, deploy) — never product decisions |
| [`assets/`](../assets/) | Static media catalog (migration target from `public/`) |
| [`src/README.md`](../src/README.md) | Application code — currently at repo root (`app/`, `lib/`) |

---

## How to use this manual

1. **Before building** — [ONBOARDING.md](./ONBOARDING.md) path + chapter + [TERMINOLOGY.md](./TERMINOLOGY.md) + [runtime-map.md](./architecture/runtime-map.md).
2. **While designing** — update the chapter in the same PR as the feature; leg order only in [mission-flow-matrix.md](./architecture/mission-flow-matrix.md).
3. **While reviewing** — reject UX not documented here; verify shipped claims against [CURRENT-PRODUCT.md](./CURRENT-PRODUCT.md).
4. **While prompting AI** — cite chapter + `prompts/` file.
5. **While estimating** — [IMPLEMENTATION-STATUS.md](./IMPLEMENTATION-STATUS.md), not roadmap Eras.

---

## Versioning

- Manual generation: **2.0 documentation architecture** (July 2026)
- Breaking product changes require a chapter update in the same PR as the code.
