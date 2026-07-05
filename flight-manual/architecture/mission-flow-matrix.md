# Mission Flow Matrix

**The only canonical mission sequence for ICAO Delta.**

All chapters (`03`, `03A`, `04`–`11`, learning-tools, roadmap) must **reference this document** for leg order. They explain *how* each leg works; they do not redefine *order*.

Pedagogical narrative in [03-mission-engine.md](../03-mission-engine.md) (orchestration) and [03A-complete-flight-mission.md](../03A-complete-flight-mission.md) (student experience) remains essential — see [DECISION-RECORDS.md](../DECISION-RECORDS.md) Decision 003.

**Implementation today:** [CURRENT-PRODUCT.md](../CURRENT-PRODUCT.md) · **Gaps:** [IMPLEMENTATION-STATUS.md](../IMPLEMENTATION-STATUS.md)

---

## Legend

| Symbol | Meaning |
|--------|---------|
| **●** | Required in this mode (product spec) |
| **○** | Optional / student-initiated |
| **—** | Not part of this mode |
| **\[shipped]** | In production codebase today |
| **\[planned]** | Specified; not yet in daily orchestration |

---

## Active flight legs (canonical order)

| # | Leg | Standard | Intense | Passive | Spec chapter | Notes |
|---|-----|----------|---------|---------|--------------|-------|
| 0 | **Captain Briefing** | ● | ● | — | 03, 03A | Unified “Begin Flight” \[planned]; dashboard welcome today \[shipped] |
| 1 | **Pronunciation Mission** | ● | ● | — | 04 | 5 words/day \[shipped] |
| 2 | **Vocabulary Mission** | ● | ● | — | 05 | 20 terms/day \[shipped] |
| 3 | **Part 1 Mission** | ● | ● | — | 06 | 3 cards, PEEL shadow + coach \[shipped]; conversation follow-up \[planned] |
| 4 | **Part 2 Mission** | ● | ● | — | 07 | Full simulation in daily path \[shipped] |
| 5 | **Part 3 Mission** | ○ | ● | — | 09, 16 | Unexpected situation — daily leg \[planned]; in Mock/simulado \[shipped partial] |
| 6 | **Part 4 Mission** | ○ | ● | — | 09, 16 | Picture discussion — daily leg \[planned]; in Mock/simulado \[shipped partial] |
| 7 | **Mission Recall** | ● | ● | — | 08 | Active recall before evaluation \[planned]; content = Section 08 stages only |
| 8 | **Mock Exam** | — | ● | — | 09 | Examiner mode; **Intense study mode only** \[shipped] |
| 9 | **Flight Debrief** | ● | ● | ○ | 10 | Per-answer debrief \[shipped]; unified end-of-flight debrief \[planned] |
| 10 | **Passive Flight Training** | ○ | ○ | ● | 11, LT | Parallel path — not a replacement for active legs |

*LT = [learning-tools/passive-flight-training.md](../learning-tools/passive-flight-training.md)*

---

## Mode definitions

### Standard

The default **daily training flight**.

- Active legs **0 → 4** required, then **Mission Recall**, then **Flight Debrief**.
- **No Mock Exam** in the guided daily sequence (student may still open simulado separately).
- **Part 3 / Part 4** not separate daily legs yet; exposure via optional simulado or future mission chapters.
- **Passive** available anytime as reinforcement.

**Shipped today (`lib/dailyMission.ts`):** Pronunciation → Vocabulary → Part 1 → Part 2 — no Recall, no unified debrief close, no briefing.

### Intense

Everything in **Standard**, plus:

- **Mock Exam** (full simulado) as the final evaluated leg before **Flight Debrief**.
- **Part 3 & Part 4** included inside Mock Exam flow \[shipped partial].
- **Mission Recall** immediately before Mock when Recall is implemented \[planned].

**Shipped today:** Mock required when `studyPlanMode === "intense"` (`lib/simulateDailyMission.ts`).

### Passive

**Listen-first** training away from the desk. Not a shortened copy of the active sequence.

Infrastructure: [11-audio-missions.md](../11-audio-missions.md)  
Pedagogy: [learning-tools/passive-flight-training.md](../learning-tools/passive-flight-training.md)  
Voice layer: [learning-tools/captain-radio.md](../learning-tools/captain-radio.md)

Typical experiences:

- Escutar Prova (exam audio playlist) \[shipped]
- Full exam listen-through \[partial]
- Captain Radio brief transmissions \[planned]
- Shadowing / question-pause modes \[planned]

Passive **feeds** Part 2 and Mock Exam; it **never replaces** speaking missions ([99-non-negotiable-rules.md](../99-non-negotiable-rules.md) rule 6).

---

## Mission Recall (canonical content)

When implemented, Mission Recall follows **[08-mission-recall.md](../08-mission-recall.md)** only:

1. Pronunciation recall (3 words)  
2. Vocabulary recall  
3. Part 1 recall (1 question)  
4. Part 2 recall  
5. Surprise question  

Do not use alternate bullet lists from other chapters. Those chapters must link here and to Section 08.

---

## Learning tools during the flight

Tools are **orthogonal** — they run *inside* legs, not as extra legs in this matrix:

| Tool | Typical leg |
|------|-------------|
| Progressive Assistance | 1–6 |
| Confidence Gates | 1–6 |
| Visual Coaching | 1, 3, 4, 6 |
| Quick Notes | 4, 5 |
| Replay Debrief | 3, 9 (after key moments; see Section 10) |
| Mission Timeline | 0–9 (orientation) |
| Situation Board | After 4–6 / debrief synthesis \[planned] |
| Mission Readiness | Before leg 8 \[planned] |

Information-flow diagram (not sequence): [product-map.md](./product-map.md)

---

## Exam rotation

All active modes use the same daily exam: **23C → 24C → 25C → 26C** (`lib/dailyExamRotation.ts`).

---

## Related

- [03-mission-engine.md](../03-mission-engine.md) — orchestration philosophy  
- [03A-complete-flight-mission.md](../03A-complete-flight-mission.md) — UX blueprint  
- [learning-architecture.md](./learning-architecture.md) — pedagogy loop  
- [DOCUMENTATION-HIERARCHY.md](../DOCUMENTATION-HIERARCHY.md)
