# 04 — Learning Engine

## Purpose

The Learning Engine defines **how every lesson runs inside a leg** — from mission open to mission complete.

The **Mission Engine** (see [01_PRODUCT.md](./01_PRODUCT.md)) decides *which leg* is next.  
The Learning Engine defines *what happens inside* each leg.

## Adaptive daily load (RFC-004 Phase 2)

`getAdaptiveDailyPlan()` shapes today's flight from `StudentTrainingProfile`:

| Phase | Word Mission terms | Pronunciation first |
|-------|--------------------|---------------------|
| Foundation | 2 | Always (bootstrap words if vault empty) |
| Operational | 3 | If pronunciation/rhythm weak |
| Exam | 4 | If pronunciation/rhythm weak |

Mission Engine (`dailyMission.ts`) reads the plan for leg order and completion. Word Mission picker uses phase term counts and Foundation prefers newer/easier terms.

### Progressive scaffolding (Phase 4)

`assistanceFromProfile()` maps phase + weak areas to an assistance ladder:

| Level | Part 1 | Word Mission |
|-------|--------|--------------|
| Full model | Shadow + keywords + coach examples open | Speak text + rich panels visible |
| Sentence blocks | Shadow, coach examples collapsed | Speak text + collapsible panels |
| Keywords | Keywords only, coach tab | Collapsed panels |
| Solo | Coach only, no model answer reveal | Speak from memory, no phrase on screen |

Re-checkride: calendar cadence (14–28 days by phase) or earlier when score trends plateau for 14 days (Mission Engine schedules after flight debrief).

---

## Universal lesson pipeline

Every training leg follows this pedagogical sequence:

```
Mission objective
  → Operational situation
  → Meaning (operational, not dictionary-first)
  → Why it matters (safety, exam, CRM)
  → Who says it (pilot, ATC, cabin)
  → Flight phase
  → Operational examples
  → Real world bridge
  → Listen / pronounce / record
  → Assessment
  → Captain coaching
  → ICAO speaking application
  → Mission complete (Engine marks — not Captain)
```

Not every stage appears in UI for every leg — but **content design** must cover them.

---

## Progressive assistance

Scaffolding reduces as the student demonstrates independence:

```
Full model answer → Sentence blocks → Keywords → Student solo
```

Captain fades help as scores stabilize. The goal is operational speech without prompts.

---

## Pronunciation level progression

Every vault word climbs four levels:

| Level | Focus | Example |
|-------|-------|---------|
| L1 | Isolated word | turbulence |
| L2 | Expression | severe turbulence |
| L3 | Full sentence | We encountered severe turbulence at FL350. |
| L4 | ICAO answer fragment | Exam-style operational use |

Graduation requires demonstrated clarity at each level — not repetition count alone.

---

## Leg-specific controllers

Each leg uses the same pipeline shape with modality-specific assessment:

| Leg | Assessment |
|-----|--------------|
| Pronunciation | Azure pronunciation assessment |
| Vocabulary | Azure + operational meaning check |
| Part 1 / 2 | Flight Instructor API (structured debrief) |
| Mock | Examiner scoring + simulado runner |

Recording ownership follows [05_RECORDING.md](./05_RECORDING.md).

---

## Activity recording

Successful attempts update vault stats, study activity, and daily leg progress. The Learning Runtime invokes these; the Mission Engine aggregates completion.

---

## Anti-patterns

| Anti-pattern | Correct approach |
|--------------|------------------|
| Student chooses next activity | Mission Engine CTAs only |
| Grammar-first screen | Operational framing first |
| Score-first feedback | Human coaching layer |
| Passive reading-only leg | Listen or speak within 30 seconds |
| Captain marks leg complete | Mission Engine API only |

---

## Quality signals

| Signal | Healthy |
|--------|---------|
| Time to first speak | Under 30 seconds |
| Retry rate on critical words | Decreasing over sessions |
| Level advancement | Steady L1→L4 |
| Captain message skip rate | Low — copy is useful |

See [07_UI_UX.md](./07_UI_UX.md) for the 30-second rule.
