# 01 — Product

## Mission

**Train the pilot. Not the language.**

ICAO Delta helps aviators pass ICAO/SDEA by building operational speech under pressure — clear readbacks, natural PEEL answers, exam-ready pronunciation, and confidence in interaction tasks.

One mission. One flight. One step closer to ICAO Level 4.

---

## What ICAO Delta is

| ICAO Delta is | ICAO Delta is not |
|---------------|-------------------|
| A Digital Flight Academy | A generic English app |
| An AI Flight Instructor (Captain Delta) | A chatbot |
| A guided daily mission system | A module picker |
| Exam-focused operational training | Grammar-first study |

The first **Training Program** on the platform is **ICAO English** (SDEA format). Future programs (CRM, type ratings) plug into the same platform without changing its core.

---

## Non-negotiable rules

1. Captain Delta is never a chatbot.
2. The student never chooses the next activity — the Mission Engine decides.
3. Speaking is always more important than reading.
4. This Flight Manual is the source of truth.
5. Every feature must improve ICAO performance.
6. Passive learning never replaces active speaking.
7. One correction at a time.
8. Every session ends with a debrief.
9. The app trains pilots, not English students.
10. If a feature conflicts with these rules, redesign the feature.

---

## The Captain Delta promise

The student should never feel lost, never wonder what to study, never decide what comes next.

Captain Delta always knows. Captain Delta always guides.

**The student has one job: keep flying.**

---

## Daily training flight

Each day follows one exam rotation by weekday (**Mon → 23C**, **Tue → 24C**, **Wed → 25C**, **Thu → 26C**, then repeats). Captain Delta presents a single mission — like a training flight with briefing, legs, and debrief.

### Entry checkride (RFC-004)

Before the first daily flight (or until completed / skipped), Captain Delta runs a **~5 minute speaking checkride**:

- Word clarity probes (Azure pronunciation)
- Short readbacks
- One light operational oral answer

**Skip** → assume **Foundation** phase. Result persists as `StudentTrainingProfile` and drives phase + weak areas.

### Training phases

| Phase | Goal |
|-------|------|
| **Foundation** | Clear speech first — lighter load, more scaffolding |
| **Operational** | Context and structure — Word Mission + Part 1 |
| **Exam** | Pressure and exam shape — full legs, mock when ready |

Mission Engine reads phase when building today's flight. Captain narrates; Engine routes (ADR-009).

### Study modes

| Mode | Purpose |
|------|---------|
| **Standard** | Default daily flight — active legs through Part 2, recall, debrief |
| **Intense** | Standard + Mock Exam before debrief |
| **Passive** | Listen-first reinforcement away from the desk — never replaces speaking missions |

### Canonical mission order

| # | Leg | Standard | Intense | Passive |
|---|-----|----------|---------|---------|
| 0 | Captain Briefing | ● | ● | — |
| 1 | Pronunciation | ● | ● | — |
| 2 | Vocabulary | ● | ● | — |
| 3 | Part 1 | ● | ● | — |
| 4 | Part 2 | ● | ● | — |
| 5 | Part 3 (unexpected situation) | ○ | ● | — |
| 6 | Part 4 (picture) | ○ | ● | — |
| 7 | Mission Recall | ● | ● | — |
| 8 | Mock Exam | — | ● | — |
| 9 | Flight Debrief | ● | ● | ○ |
| 10 | Passive Flight Training | ○ | ○ | ● |

● = required in mode · ○ = optional · — = not in mode

---

## Mission legs

### Pronunciation (leg 1)

First active block — voice warm-up before the rest of the flight. Five words per day from the student's vault. Four levels per word: isolated word → expression → sentence → ICAO answer fragment. Goal is **clarity and operational communication**, not accent elimination.

### Vocabulary (leg 2) — Word Mission

Four premium operational concepts per exam day (~15 minutes), rotated from the full catalog. At least two terms align with that day's exam corpus (Part 1 + Part 2). Up to two slots prioritize marked-difficult or low-score terms; the rest defer to future days. Four levels per term: meaning → operational use → say it → ICAO practice.

### Part 1 (leg 3) — 12-question mastery

See **[06_PART1_MASTERY.md](./06_PART1_MASTERY.md)** for the full teaching method.

SDEA Part 1 has **12 real exam questions** (3 per prova 23C–26C). The daily flight runs **Part 1 Mission Mode** — a six-step pipeline per question (brief → anchors → shadow → keywords → coach). Browse mode (`/part1?browse=1`) is for open review only, not the daily leg.

**Exam ready** = all PEEL blocks passed + coach at ICAO 4 band. Progress: **X/12 exam ready**.

### Part 2 (leg 4)

Full **Part 2 exam for today's prova** (5 situations) — readback, interaction, AFFIRM/NEGATIVE, reported speech under time pressure. **Paper and pen** for quick notes (Captain suggests codes; student writes offline, like the real SDEA). Browse mode (`/part2?browse=1`) keeps fragmented practice and digital notes for review.

See **[07_PART2_MISSION.md](./07_PART2_MISSION.md)**.

### Mission Recall (leg 7)

Active confidence check before evaluation: pronunciation recall, vocabulary recall, Part 1 recall, Part 2 recall, surprise question.

### Mock Exam (leg 8)

Full SDEA simulation. Captain adopts **examiner persona** — still coaches, never owns exam state.

### Flight Debrief (leg 9)

Every session closes with what improved, what was weak, and tomorrow's focus. No session ends without direction.

### Passive Flight Training (leg 10)

Listen-first missions (exam audio, shadowing, Captain Radio). Feeds Part 2 and Mock — never replaces active speaking.

---

## Learning philosophy

Progressive method inside every leg:

```
Listen → Understand → Practice with support → Practice with less support → Speak alone → Debrief → Try again
```

Scaffolding reduces over time:

```
Full model answer → Sentence blocks → Keywords → Student solo
```

---

## Product rules

1. **One goal first** — pass the ICAO exam; backlog everything else.
2. **Speak before seeing the answer** — active recall over passive review.
3. **One correction at a time** — one positive, one improvement, one next action.
4. **Train like the exam** — simulate SDEA format and pressure.
5. **Every session ends with debrief** — always know what to do tomorrow.

---

## Success definition

ICAO Delta succeeds when the student can:

- answer Part 1 naturally using operational structure;
- understand and interact in Part 2 under pressure;
- pronounce aviation terms clearly enough for radio work;
- complete a mock exam with confidence;
- **pass the real ICAO/SDEA examination.**

Success is not completing lessons. Success is passing the exam.

The student should feel: *"I trained with a real instructor today."*
