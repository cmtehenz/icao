# Section 03A — Complete Flight Mission

Version 1.0

[architecture/mission-flow-matrix.md](./architecture/mission-flow-matrix.md) — **canonical mission leg order**

---

# Role of this chapter

**Complete Flight Mission (03A)** is the **student experience blueprint** — how one training flight *feels* from app open to debrief.

**Mission Engine (03)** defines **orchestration** — why legs exist and how Captain plans the day.

Both are required. See [DECISION-RECORDS.md](./DECISION-RECORDS.md) Decision 003.

---

# Purpose

This document describes the complete ICAO Delta learning experience.

It is the blueprint of one entire training flight.

Every feature inside ICAO Delta must support this journey.

If a future feature does not fit naturally into this flow,

it should be redesigned.

---

# Philosophy

The student never studies.

The student flies a mission.

Captain Delta plans the mission.

The student follows.

Every activity prepares the next one.

The experience should feel like professional flight training.

Not like using an English application.

---

# Opening the App

The student opens ICAO Delta.

Captain Delta immediately takes control.

There is no decision to make.

The student is welcomed.

Example

---

Good morning, Gustavo.

Your ICAO exam is in 23 days.

Today's Flight Mission

Exam 24C

Estimated Flight Time

47 minutes

Today's objective

Improve confidence during follow-up questions.

Yesterday's improvement

Pronunciation of "turbulence"

Ready?

▶ Begin Flight

---

One button.

No menus.

No confusion.

---

# Flight Briefing

Captain explains today's mission.

Example

Today we will complete:

✓ Pronunciation Mission

✓ Vocabulary Mission

✓ Part 1 Mission

✓ Part 2 Mission

✓ Mission Recall

✓ Flight Debrief

Optional

Mock Exam *(Intense study mode — see [mission-flow-matrix.md](./architecture/mission-flow-matrix.md))*

Passive Flight Training

Captain always tells the student what is coming next.

**Adaptive briefing (CDLI):** Briefing copy adapts to exam day, next leg, and memory — but leg order comes only from the Mission Engine. Spec: [adaptive-operational-briefing.md](./educational-systems/adaptive-operational-briefing.md).

---

# Leg 1 — Pronunciation Mission

Purpose

Warm up the student's voice.

Captain selects five words.

Every word progresses through:

Word

↓

Expression

↓

Sentence

↓

ICAO Answer

↓

Conversation

Mission ends with Captain's debrief.

---

# Leg 2 — Vocabulary Mission

Purpose

Prepare operational vocabulary.

Captain selects today's vocabulary.

Every word progresses through:

Meaning

↓

Operational Expression

↓

Sentence

↓

ICAO Usage

↓

Conversation

Mission ends with vocabulary debrief.

---

# Leg 3 — Part 1 Mission

Captain introduces today's first question.

The student progresses through:

Full Answer

↓

Sentence Blocks

↓

Keywords

↓

Symbols

↓

No Help

↓

Examiner Conversation

Captain gradually removes support.

The student gains confidence.

---

# Replay Debrief

Captain replays one important moment.

Maximum

20 seconds.

Then gives exactly one improvement.

Finally

One action.

Try Again

Practice Follow-up

Review Vocabulary

Train Pronunciation

Continue Mission

---

# Leg 4 — Part 2 Mission

The student enters a realistic ICAO communication scenario.

Captain becomes ATC.

The student listens.

Writes Quick Notes.

Reads back.

Responds to unexpected situations.

Uses Reported Speech.

Receives coaching.

The complete scenario feels like the real examination.

---

# Leg 5 — Mission Recall

> **Canonical stages:** [08-mission-recall.md](./08-mission-recall.md) — the list below is narrative illustration only.

Duration

3–5 minutes.

Captain revisits:

Two pronunciation words.

Two vocabulary items.

One Part 1 question.

One Part 2 situation.

One surprise question.

Purpose

Activate memory before evaluation.

---

# Leg 6 — Mock Exam

Captain switches to Examiner Mode.

No coaching.

No hints.

No interruptions.

Exactly like the ICAO examination.

Captain returns only after the exam ends.

---

# Flight Debrief

Captain summarizes today's flight.

Examples

Today's biggest improvement.

Most difficult area.

Pronunciation summary.

Vocabulary summary.

Conversation Confidence.

Tomorrow's priority.

Mission score.

Captain always ends positively.

---

# Passive Audio Mission

Optional.

Available throughout the application.

Examples

Driving.

Walking.

Gym.

Coffee.

The student listens to:

Complete ICAO exams.

Questions only.

Questions and answers.

Shadowing Mode.

ATC communications.

Captain podcasts.

Passive learning reinforces active learning.

Never replaces it.

---

# Mission Complete

Captain congratulates the student.

Example

Excellent work.

Today's mission is complete.

Tomorrow we'll continue with Exam 25.

Keep flying.

Mission Accomplished.

---

# Student Journey

The student should always feel:

Guided.

Prepared.

Confident.

Never lost.

Never overwhelmed.

Never unsure of what to do next.

Captain Delta always knows the next step.

---

# Golden Rule

The student never asks:

"What should I study now?"

Captain Delta has already answered that question.

---

# Success Criteria

This mission is successful when:

The student opens the application.

Presses one button.

Completes one guided flight.

Leaves more confident than before.

And returns tomorrow without wondering where to continue.

---

# Implementation Notes

This document describes the user journey.

Individual implementation details belong to each module chapter.

If any module breaks this journey,

the module should be redesigned.
