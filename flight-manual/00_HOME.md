# Flight Manual — Home

**The Flight Manual is the single source of truth.**

All official ICAO Delta documentation lives in `flight-manual/`. Nothing outside this folder is authoritative. Do not create parallel documentation, `/docs`, sprint trackers, or audit reports.

ICAO Delta is a **Digital Flight Academy** — guided daily missions led by **Captain Delta**, a senior flight instructor.

---

## Read order

| # | Document | Topic |
|---|----------|-------|
| 1 | [01_PRODUCT.md](./01_PRODUCT.md) | Vision, daily mission, mission legs, rules |
| 2 | [02_ARCHITECTURE.md](./02_ARCHITECTURE.md) | System boundaries, ownership, pipelines |
| 3 | [03_CAPTAIN_DELTA.md](./03_CAPTAIN_DELTA.md) | Instructor identity and coaching |
| 4 | [04_LEARNING_ENGINE.md](./04_LEARNING_ENGINE.md) | Lesson pipeline inside each leg |
| 5 | [05_RECORDING.md](./05_RECORDING.md) | Recording controller and Azure assessment |
| 6 | [06_KNOWLEDGE_ENGINE.md](./06_KNOWLEDGE_ENGINE.md) | Curated knowledge, no invention |
| 7 | [07_UI_UX.md](./07_UI_UX.md) | Mission-focus UX and 30-second rule |
| 8 | [08_ROADMAP.md](./08_ROADMAP.md) | Long-term product direction |
| — | [decisions/](./decisions/) | ADRs and RFCs (ownership rules) |
| — | [prompts/](./prompts/) | AI prompt text (implements manual behavior) |

Start with **01_PRODUCT**, then **02_ARCHITECTURE** if you are engineering.

---

## Golden rule

If it explains *today's implementation*, it does not belong here.

If it explains *how ICAO Delta should work*, it belongs here.
