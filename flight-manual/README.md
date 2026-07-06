# ICAO Delta Flight Manual

**Start here:** [00_HOME.md](./00_HOME.md)

The Flight Manual is the **only source of truth**. All official documentation lives in this folder.

---

## Chapters

| # | Document | What it contains |
|---|----------|------------------|
| — | [00_HOME.md](./00_HOME.md) | Welcome, read order, no parallel docs |
| 1 | [01_PRODUCT.md](./01_PRODUCT.md) | Vision, mission, daily flight, mission legs |
| 2 | [02_ARCHITECTURE.md](./02_ARCHITECTURE.md) | Boundaries, ownership, data flow, pipelines |
| 3 | [03_CAPTAIN_DELTA.md](./03_CAPTAIN_DELTA.md) | Instructor identity, coaching, delivery |
| 4 | [04_LEARNING_ENGINE.md](./04_LEARNING_ENGINE.md) | Universal lesson pipeline |
| 5 | [05_RECORDING.md](./05_RECORDING.md) | Recording controller, Azure, human feedback |
| 6 | [06_KNOWLEDGE_ENGINE.md](./06_KNOWLEDGE_ENGINE.md) | Knowledge hierarchy, Chief Instructor |
| 7 | [07_UI_UX.md](./07_UI_UX.md) | Flight academy UX, 30-second rule |
| 8 | [08_ROADMAP.md](./08_ROADMAP.md) | Long-term direction |
| — | [CHANGELOG.md](./CHANGELOG.md) | Manual version history |
| — | [decisions/](./decisions/) | ADRs and RFCs |
| — | [prompts/](./prompts/) | AI system prompts |

---

## Documentation freeze

**After this cleanup, documentation work is frozen** unless code behavior changes or a major architecture decision is made.

When either happens: update the relevant chapter (and [decisions/](./decisions/) if ownership changes) in the **same PR** as the code.

No sprint reports. No implementation status trackers. No parallel doc trees.
