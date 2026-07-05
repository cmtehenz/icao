# Learning Architecture

**How pedagogy flows** through ICAO Delta — Progressive Assistance, gates, and debrief loops.

---

## Core loop

```
Listen → Understand → Practice (supported) → Practice (less support)
  → Speak independently → Flight Debrief → Learning Memory → Tomorrow's mission
```

From [01-product-philosophy.md](../01-product-philosophy.md).

**Teaching intelligence:** [educational-systems/learning-loop.md](../educational-systems/learning-loop.md) (seven phases — architectural). This section remains the pedagogy flow summary.

---

## Progressive Assistance (foundation)

Five universal levels (Learning Tool) — codes **PA-1…PA-5** in [ASSISTANCE-TAXONOMY.md](../ASSISTANCE-TAXONOMY.md):

1. Demonstration  
2. Guided reconstruction  
3. Guided recall  
4. Memory triggers  
5. Independent communication  

Applied per mission with mission-specific content:

| Mission | Codes | Level examples |
|---------|-------|----------------|
| Pronunciation | PR-1…PR-5 | word → expression → sentence → ICAO → conversation |
| Vocabulary | VB-1…VB-5 | meaning → pilot phrase → sentence → exam use |
| Part 1 | P1-1…P1-6 | full answer → PEEL blocks → keywords → symbols → none → conversation |
| Part 2 | P2-1…P2-5 | model readback → notes → independent report |

**Canonical mission order:** [mission-flow-matrix.md](./mission-flow-matrix.md)

Spec: [learning-tools/progressive-assistance.md](../learning-tools/progressive-assistance.md)

---

## Confidence Gates

Advancement requires **demonstrated confidence**, not checkbox completion.

- Gates sit between assistance levels.
- Feed **Conversation Confidence** and **Mission Readiness**.
- Spec: [learning-tools/confidence-gates.md](../learning-tools/confidence-gates.md)

**Today:** partial — pronunciation graduation rules only.

---

## Mission Recall

Active recall before Mock Exam on **Intense** flights.

- No new content — pulls only from today's mission material.
- **Canonical stages:** [08-mission-recall.md](../08-mission-recall.md) only.
- **Leg order:** [mission-flow-matrix.md](./mission-flow-matrix.md)

---

## Debrief loops

| Loop | When | Output |
|------|------|--------|
| Answer debrief | After each coached recording | One priority + mission expressions |
| Mission debrief | End of pronunciation/vocab batch | Batch summary |
| Flight Debrief | End of daily flight | Tomorrow focus |
| Replay Debrief | Optional highlight reel | Reinforcement clips |

Spec: [10-debrief.md](../10-debrief.md), [learning-tools/replay-debrief.md](../learning-tools/replay-debrief.md)

---

## Passive vs active

**Passive Flight Training** exposes the ear; **missions** require the mouth.

Captain Radio links passive sessions back to Mission Engine.

---

## Related

- [runtime-map.md](./runtime-map.md) — current code entry points
- [mission-flow-matrix.md](./mission-flow-matrix.md) — canonical leg order
- [product-map.md](./product-map.md)
- [ai-architecture.md](./ai-architecture.md) — where LLM fits in debrief
- [educational-systems/README.md](../educational-systems/README.md) — EIA / CDLI
