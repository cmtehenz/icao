# Product Map

**How information passes between modules** — not the canonical mission leg order.

**Leg order (Standard / Intense / Passive):** [mission-flow-matrix.md](./mission-flow-matrix.md) only.

---

## Primary flight path (information flow)

```
Captain Delta
      │
      ▼
Mission Engine ─── selects exam 23C|24C|25C|26C for today
      │
      ├──► Pronunciation Mission (5 words, PR-1→PR-4)
      │         │ weak words, scores
      │         └──────────────────┐
      │                              ▼
      ├──► Vocabulary Mission (20 terms, SRS)
      │         │ operational terms used later
      │         └──────────────┐
      │                          ▼
      ├──► Part 1 Mission (3 questions)
      │         │ uses vocab + pronunciation clarity
      │         │ PEEL / conversation assistance
      │         └──────────────┐
      │                          ▼
      ├──► Part 2 Mission (5 situations)
      │         │ readback · interaction · reported
      │         │ Quick Notes support
      │         └──────────────┐
      │                          ▼
      ├──► Mission Recall ─── active recall ([08-mission-recall.md](../08-mission-recall.md))
      │         │
      │         ▼
      ├──► Mock Exam ─── Intense mode; examiner ([09-mock-exam.md](../09-mock-exam.md))
      │         │
      │         ▼
      └──► Flight Debrief ─── tomorrow focus ([10-debrief.md](../10-debrief.md))
                │
                ├────────► Replay Debrief (highlights)
                ├────────► Mission Readiness estimate
                ├────────► Situation Board → Instructor Whiteboard
                └────────► Flight Logbook entry
```

*Sequence authority: [mission-flow-matrix.md](./mission-flow-matrix.md). This diagram shows **data and pedagogy flow**, including synthesis tools after debrief.*

---

## Parallel / optional paths

```
Passive Flight Training
      │
      ├── Captain Radio (brief transmissions)
      ├── Escutar Prova (exam audio)
      └── feeds familiarity → Part 2 / Mock Exam

Adaptive Conversation Engine
      └── Part 1 follow-up · Part 2 interaction depth
```

---

## Learning tools (orthogonal layer)

Applied **during** missions, not instead of them:

| Tool | Feeds | Consumes |
|------|-------|----------|
| Progressive Assistance | All missions | Confidence Gates |
| Confidence Gates | Level changes | Conversation Confidence |
| Visual Coaching | Captain speech | Mission context |
| Quick Notes | Part 2/3 performance | Situation Board |
| Mission Timeline | Student orientation | Mission Engine state |
| Conversation Confidence | Mission Readiness | All speaking missions |
| Mission Readiness | Mock Exam gate (future) | Recall + debrief |

---

## Information flow summary

| From | To | Data |
|------|-----|------|
| Azure pronunciation | Pronunciation vault | word, score, error type |
| Vault | Pronunciation Mission | daily word pick |
| Vocab SRS | Vocabulary Mission | due terms |
| Exam rotation | All missions | card nums, situations |
| Part 1/2 evaluate | Learning Memory | weak areas, mistakes |
| Learning Memory | Captain Delta APIs | memoryContext |
| Captain debrief | Next mission CTA | getNextMissionAction |
| Mock Exam report | Flight Debrief | strengths, weaknesses |
| Flight Debrief | Learning Memory | tomorrow items |
| Learning Memory | Next day briefing | personalization |

---

## Parts 3 & 4 (exam structure)

In full SDEA flow:

```
Part 1 → Part 2 → Part 3 (unexpected situation) → Part 4 (picture)
```

Spec: [09-mock-exam.md](../09-mock-exam.md), [16-icao-knowledge-base.md](../16-icao-knowledge-base.md), simulado data.

Daily path: see [mission-flow-matrix.md](./mission-flow-matrix.md) — Parts 3–4 primarily in Mock Exam until dedicated mission chapters exist.

---

## Post-mission synthesis

After **Flight Debrief** (leg 9), synthesis tools reinforce learning:

```
Flight Debrief
      ▼
Replay Debrief ──► reinforces excellent / recovery moments
      ▼
Mission Readiness ──► "ready for mock?" signal (future gate)
      ▼
Situation Board ──► operational picture
      ▼
Instructor Whiteboard ──► final visual debrief
      ▼
Flight Logbook ──► persisted history
```

*This is **information synthesis**, not a replacement for the mission leg order in mission-flow-matrix.*

---

## Golden rule

Information always flows **forward into Learning Memory** and **backward into tomorrow's Mission Engine** — never into disconnected modules.

---

## Related

- [mission-flow-matrix.md](./mission-flow-matrix.md)
- [03-mission-engine.md](../03-mission-engine.md)
- [03A-complete-flight-mission.md](../03A-complete-flight-mission.md)
- [learning-architecture.md](./learning-architecture.md)
- [data-flow.md](./data-flow.md)
- [runtime-map.md](./runtime-map.md)
