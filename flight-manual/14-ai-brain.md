# Section 14 — AI Brain

Version 1.0

Related Chapters

Section 02 — Captain Delta

Section 03 — Mission Engine

Section 10 — Flight Debrief

Section 13 — Learning Memory

---

# Philosophy

ICAO Delta is not powered by one AI.

It is powered by a team of specialized AI instructors.

Every AI has a single responsibility.

Every AI knows exactly when to speak.

Every AI knows when to stay silent.

Captain Delta orchestrates the entire experience.

He is the face of the academy.

The other AI agents work behind the scenes.

The student should never know they exist.

---

# CDLI — one pedagogical brain

Behind these agents sits **Captain Delta Learning Intelligence (CDLI)** — the educational layer that defines *how* Captain teaches.

| CDLI capability | Agents (implementation) |
|-----------------|-------------------------|
| Instructional Judgment | Flight Instructor, Debrief Engine, Replay Analyzer |
| Assistance Calibration | Pronunciation / Vocabulary / Part 4 coaches |
| Operational Context | Part 2 ATC, Part 3 Situation Analyzer |
| Instructor Voice | Captain Delta persona, ICAO Examiner |
| Memory Synthesis | Memory Engine, Recommendation Engine |

**Mission Planner** belongs to the **Mission Engine**, not CDLI.

Full spec: [educational-systems/captain-delta-learning-intelligence.md](../educational-systems/captain-delta-learning-intelligence.md) · [RFC-001](../architecture/rfc/RFC-001-educational-intelligence-architecture.md).

Production today collapses agents into three API routes — see [architecture/ai-architecture.md](../architecture/ai-architecture.md).

---

# AI Architecture

The system follows one hierarchy.

```

Captain Delta
│
├── Mission Planner
├── Pronunciation Coach
├── Vocabulary Coach
├── Flight Instructor
├── ICAO Examiner
├── Part 2 ATC Engine
├── Part 3 Situation Analyzer
├── Part 4 Discussion Coach
├── Debrief Engine
├── Replay Analyzer
├── Memory Engine
├── Recommendation Engine
└── Analytics Engine
```
