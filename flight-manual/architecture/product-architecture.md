# Product Architecture

**How product layers relate** — not what each screen does (see mission chapters).

---

## Layers

```
┌─────────────────────────────────────────────────────────┐
│  Captain Delta (identity + orchestration)               │
├─────────────────────────────────────────────────────────┤
│  Mission Engine (daily flight schedule)                 │
├─────────────────────────────────────────────────────────┤
│  Missions: Pronunciation · Vocabulary · P1 · P2 · Recall │
│            · Mock Exam · Debrief · Passive               │
├─────────────────────────────────────────────────────────┤
│  Learning Tools (cross-cutting pedagogy)                │
├─────────────────────────────────────────────────────────┤
│  Learning Memory (continuity across days)               │
└─────────────────────────────────────────────────────────┘
```

---

## Captain Delta

- **Single face** to the student.
- Orchestrates which mission leg is active; does not replace mission UIs.
- Modes: mission guide, screen coach, post-answer instructor, examiner, debrief.
- See [02-captain-delta.md](../02-captain-delta.md).

---

## Mission Engine

- Selects today's exam version.
- Orders legs and computes `getNextMissionAction()`.
- Does not contain mission-specific scoring logic.
- See [03-mission-engine.md](../03-mission-engine.md).

---

## Missions vs learning tools

| Layer | Answers |
|-------|---------|
| **Mission** | What the student flies today (content + steps) |
| **Learning tool** | How assistance, confidence, and visuals behave across missions |

Missions **use** learning tools. Tools never replace missions.

---

## Learning Memory

- Feeds tomorrow's mission and Captain copy.
- Product concept: [13-learning-memory.md](../13-learning-memory.md).
- Technical persistence: [data-flow.md](./data-flow.md).

---

## Documentation split

| Question | Document |
|----------|----------|
| What should Pronunciation do? | [04-pronunciation.md](../04-pronunciation.md) |
| How does assistance taper? | [learning-tools/progressive-assistance.md](../learning-tools/progressive-assistance.md) |
| What is built? | [CURRENT-PRODUCT.md](../CURRENT-PRODUCT.md) |
| How does data move? | [data-flow.md](./data-flow.md) |

---

## Related

- [product-map.md](./product-map.md) — full learning flow
- [learning-architecture.md](./learning-architecture.md) — pedagogy pipeline
