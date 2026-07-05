# Scenario Graph

**How operational scenarios connect.**

Scenarios are **nodes** in the [Operational Knowledge Graph](./operational-knowledge-graph.md). This document describes scenario **relationships** — not a second graph system.

Related: [07-part2.md](../07-part2.md) · [08-mission-recall.md](../08-mission-recall.md) · [learning-tools/situation-board.md](../learning-tools/situation-board.md)

---

## Philosophy

Exam situations are not isolated scripts. Real aviation training chains scenarios:

```
Abnormal indication
    ↓
Pilot decision
    ↓
ATC communication
    ↓
Passenger / CRM factor
    ↓
Outcome / lesson
```

Captain recalls **relationships** during Mission Recall and debrief — not disconnected facts.

---

## Canonical scenario relationships

| Relationship | Pedagogical use |
|--------------|-----------------|
| **Escalation** | PAN → MAYDAY; minor → serious |
| **Communication chain** | Readback → report → ATC response → reported speech |
| **System cascade** | Engine → autorotation → landing decision |
| **CRM branch** | Technical problem → crew coordination → passenger briefing |
| **Exam rotation** | 23C → 24C → 25C → 26C scenario families |

These are **edge types** on `scenario` nodes (`leads_to`, `escalates_to`, `same_exam_family`).

---

## Example chain (illustrative)

```
Engine failure (concept)
    ↓
Autorotation (skill)
    ↓
Emergency landing (scenario type)
    ↓
CRM (topic)
    ↓
ATC communication (skill)
    ↓
Passenger management (CRM)
    ↓
Fuel / weight decisions (topic)
    ↓
Decision making (topic)
```

Captain does not lecture this chain. CDLI uses it to:

- Pick **surprise** recall links (Section 08 Stage 5)
- Suggest **one** related focus in debrief
- Inform Situation Board (future LT)

---

## Sources of scenario nodes

| Source | Status |
|--------|--------|
| Part 2 exam situations (`part2Data`) | Shipped |
| Part 3–4 in simulado | Partial |
| Mission Recall prompts | Shipped (today's scenarios only) |
| Hand-authored scenario library | **Rejected** as primary — exam data is SSOT |

---

## Rules

1. **No new content in recall** — only today's mission scenarios (Section 08).
2. **Scenario graph informs teaching** — does not add mission legs.
3. **Cross-program scenarios** (CRM, HAA) add nodes when programs launch — same edge types.

---

## Related

- [operational-knowledge-graph.md](./operational-knowledge-graph.md)
- [08-mission-recall.md](../08-mission-recall.md)
