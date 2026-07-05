# Universal Learning Loop

**One loop for every ICAO Delta training program.**

Mission legs change. Tools change. The loop does not.

Related: [architecture/learning-architecture.md](../architecture/learning-architecture.md) · [01-product-philosophy.md](../01-product-philosophy.md) · [RFC-001](../architecture/rfc/RFC-001-educational-intelligence-architecture.md)

---

## Seven phases

```
1. EXPOSE      → Hear / see operational context
2. COMPREHEND  → Understand meaning in aviation
3. PRACTICE    → Speak with support (PA-1…3)
4. PERFORM     → Speak with minimal support (PA-4…5)
5. EVALUATE    → Measure against operational standard
6. REFLECT     → Debrief, recall, one priority
7. TRANSFER    → Memory + tomorrow's mission
```

Captain Delta and CDLI operate mainly in phases **3–7**. Mission Engine schedules **when** each phase occurs in the daily flight.

---

## Phase definitions

### 1. Expose

Student encounters authentic aviation input: ATC audio, briefing, scenario context, model demonstration (PA-1).

**Examples:** Escutar Prova, Part 2 listen steps, Captain briefing, PEEL shadow model.

---

### 2. Comprehend

Student grasps **operational meaning** — not translation. Vocabulary meaning prompts, situation context, PEEL structure.

**CDLI:** Operational Context + scenarios before definitions (IP-04).

---

### 3. Practice (supported)

Student speaks with scaffolding: sentence blocks, keywords, symbols, coach hints (PA-2…3).

**Examples:** PEEL puzzle, pronunciation levels PR-1…3, vocab VB-1…3.

---

### 4. Perform (independent)

Student speaks with minimal or no visual support (PA-4…5).

**Examples:** P1-5 no help, independent readback, Mission Recall.

---

### 5. Evaluate

Azure pronunciation, `/api/evaluate`, structured Flight Instructor JSON. Evaluation serves teaching — not punishment.

**CDLI:** Instructional Judgment consumes scores; student sees coaching not raw rubric dumps.

---

### 6. Reflect

Answer debrief, Mission Recall confidence, Flight Debrief, optional Replay Debrief.

**Rules:** One priority (IP-02), confidence first (IP-13), recall don't review (Section 08).

---

### 7. Transfer

Learning Memory updates. Tomorrow's mission legs selected by engine; emphasis informed by CDLI Memory Synthesis.

---

## Mapping to RFC proposal (alias table)

| RFC proposal step | Seven-phase home |
|-------------------|------------------|
| Observe | Expose |
| Understand | Comprehend |
| Discuss | Practice (coach dialogue, P1-6 target) |
| Practice | Practice |
| Evaluate | Evaluate |
| Reflect | Reflect |
| Remember | Reflect + Transfer |
| Apply | Transfer (next mission application) |
| Master | Transfer (graduation / long-term retention) |

Ten steps collapse to **seven** without losing intent.

---

## Mapping to Section 01 training method

| Section 01 | Phase |
|------------|-------|
| Listen | Expose |
| Understand | Comprehend |
| Practice with support | Practice |
| Practice with less support | Perform |
| Speak without help | Perform |
| Receive debrief | Reflect |
| Try again | Transfer (next cycle) |

No contradiction — Section 01 is the student-facing prose; this document is the architectural loop.

---

## Daily flight placement

| Mission leg | Dominant phases |
|-------------|-----------------|
| Pronunciation | Expose → Practice → Evaluate → Reflect |
| Vocabulary | Comprehend → Practice → Perform |
| Part 1 | Expose → Practice → Perform → Evaluate |
| Part 2 | Expose → Practice → Perform → Evaluate |
| Mission Recall | Perform → Reflect |
| Mock Exam | Perform → Evaluate → Reflect |
| Flight Debrief | Reflect → Transfer |

Canonical leg order: [mission-flow-matrix.md](../architecture/mission-flow-matrix.md).

---

## Future programs

CRM, HAA, NVG, IFR, SOP, type rating, and recurrent training use the **same seven phases**. Only content nodes and mission legs differ.

---

## Related

- [instructional-principles.md](./instructional-principles.md)
- [captain-delta-learning-intelligence.md](./captain-delta-learning-intelligence.md)
