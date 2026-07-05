# Section 03 — Mission Engine

Version 3.0

Related Chapters

Section 01 — Product Philosophy

Section 02 — Captain Delta

Section 04 — Pronunciation Mission

Section 05 — Vocabulary Mission

Section 06 — Part 1 Mission

Section 07 — Part 2 Mission

Section 09 — Mock Exam

Section 10 — Flight Debrief

Section 11 — Audio Mission

[architecture/mission-flow-matrix.md](./architecture/mission-flow-matrix.md) — **canonical mission leg order**

[DOCUMENTATION-HIERARCHY.md](./DOCUMENTATION-HIERARCHY.md) — vision vs shipped

---

# Role of this chapter

**Mission Engine (03)** defines product **orchestration** — why the Mission Engine exists, exam rotation, and how legs connect pedagogically.

For the **student UX blueprint** (Begin Flight, emotional arc), see [03A-complete-flight-mission.md](./03A-complete-flight-mission.md).

For **leg order** (Standard / Intense / Passive), use only the [Mission Flow Matrix](./architecture/mission-flow-matrix.md).

---

# Philosophy

The Mission Engine is the core of ICAO Delta.

It replaces traditional study menus with a guided daily flight.

The student should never wonder:

"What should I study today?"

Captain Delta always answers that question.

Every study session is treated like a training flight.

The student simply arrives.

Captain Delta conducts the mission.

---

# Product Vision

Traditional learning applications ask the student to choose what to study.

ICAO Delta does not.

Instead of presenting modules, Captain Delta presents a mission.

Example:

Good morning, Gustavo.

Today's Flight Mission

Exam 24

Estimated Flight Time

52 minutes

Today's Objective

Improve confidence during Part 2 communication.

Ready?

▶ Begin Flight

The student follows.

Captain leads.

---

# Mission Philosophy

Every mission has only one purpose:

Prepare the student for today's ICAO examination.

Nothing inside the mission is random.

Every activity prepares the next activity.

Pronunciation prepares Vocabulary.

Vocabulary prepares Part 1.

Part 1 prepares Part 2.

Part 2 prepares Mission Recall.

Mission Recall prepares the Mock Exam.

Mock Exam prepares the real ICAO examination.

Everything has a reason.

---

# Daily Exam Rotation

The Mission Engine automatically selects one official exam per day.

Rotation:

Exam **23C**

↓

Exam **24C**

↓

Exam **25C**

↓

Exam **26C**

↓

Repeat

The student never chooses the exam.

Captain Delta controls the schedule.

This guarantees complete coverage of all available ICAO material.

---

# Standard Flight Mission

> **Canonical sequence:** [architecture/mission-flow-matrix.md](./architecture/mission-flow-matrix.md) — Standard, Intense, and Passive modes.  
> The sections below explain **orchestration philosophy** and how each leg prepares the next. They do not override the matrix.

Every mission follows the same sequence.

## Flight Briefing

Captain Delta welcomes the student.

Shows:

Today's Exam

Estimated Duration

Today's Objectives

Previous Progress

Weak Areas

Current ICAO Estimate

Captain explains today's flight plan.

---

## Engine Start

Pronunciation Mission

Purpose:

Prepare the student's speech before answering questions.

Captain selects five words.

Priority:

Critical words

Weak words

Today's vocabulary

Recently learned words used in context

Goal:

Warm up the voice.

Not memorize pronunciation.

---

## Taxi

Vocabulary Mission

Captain teaches only vocabulary needed for today's exam.

Each word follows:

Meaning

↓

Pilot Expression

↓

Operational Sentence

↓

ICAO Usage

Vocabulary is immediately spoken.

Never only read.

---

## Takeoff

Part 1 Mission

Three questions from today's exam.

Captain controls assistance automatically.

Support levels:

Level 1

Full Answer

↓

Level 2

Sentence Blocks

↓

Level 3

Keywords

↓

Level 4

Symbols

↓

Level 5

No Help

The student's goal is independence.

Not memorization.

---

## Cruise

Part 2 Mission

This is not divided into separate exercises.

The student experiences one complete ICAO communication scenario.

Flow:

ATC Instruction

↓

Quick Notes

↓

Readback

↓

Controller Response

↓

Unexpected Event

↓

Student Report

↓

Controller Question

↓

Reported Speech

↓

Scenario Ends

Captain behaves exactly like a controller and instructor.

The experience should feel identical to the real ICAO exam.

---

## Mission Recall

Immediately before evaluation on **Intense** flights (see [mission-flow-matrix.md](./architecture/mission-flow-matrix.md)).

**Canonical content and stages:** [08-mission-recall.md](./08-mission-recall.md) only — do not use informal bullet variants elsewhere.

Purpose:

Move information from short-term memory into active recall.

Duration:

Three to five minutes.

---

## Mock Exam

On **Intense** study mode only in the guided daily path ([mission-flow-matrix.md](./architecture/mission-flow-matrix.md)). Standard mode students may still open simulado separately.

Captain switches to Examiner Mode.

No coaching.

No hints.

No corrections.

Neutral examiner behavior.

The student experiences realistic exam pressure.

---

## Flight Debrief

Captain returns as instructor.

Debrief includes:

Today's strongest answer

Today's weakest answer

Most improved skill

Pronunciation summary

Vocabulary summary

Tomorrow's priority

One recommendation

Captain always finishes positively.

---

## Passive Flight Mission

Optional.

Designed for moments when active study is impossible.

Examples:

Driving

Walking

Coffee Break

Before Flight

Before Sleep

Available modes:

Listen Only

Shadowing

Question Pause

Podcast Mode

Radio Mode

Passive missions never replace active missions.

They reinforce them.

---

# Mission Completion

A Standard Flight Mission is complete when:

✓ Pronunciation Mission completed

✓ Vocabulary Mission completed

✓ Part 1 Mission completed

✓ Part 2 Mission completed

✓ Flight Debrief completed

Mock Exam is required only in Intense Mode.

Passive Mission is always optional.

---

# Flight Modes

Quick Flight

10–15 minutes

Pronunciation

Vocabulary

One Part 1 question

---

Standard Flight

40–50 minutes

Complete daily mission.

---

Intense Flight

60–75 minutes

Complete mission

-

Full Mock Exam

Captain recommends the most appropriate mode.

---

# Mission Recovery

The student may stop at any time.

Captain remembers the exact location.

Example:

Yesterday you completed Vocabulary.

Today we'll continue from Part 1.

Progress is never lost.

---

# Adaptive Missions

Captain modifies future missions automatically.

Weak pronunciation

↓

Extra pronunciation tomorrow.

Weak vocabulary

↓

Vocabulary reinforcement.

Weak Part 2

↓

Additional communication scenario.

Strong performance

↓

Reduced assistance.

More realistic simulations.

Every mission evolves with the student.

---

# Mission Board

The student always knows where they are.

Example:

✓ Flight Briefing

✓ Pronunciation

✓ Vocabulary

✓ Part 1

○ Part 2

○ Mission Recall

○ Mock Exam

○ Flight Debrief

Captain always highlights the next destination.

---

# Product Rules

The student never chooses the next activity.

Captain Delta always decides.

Every activity prepares the next one.

Every mission has one clear objective.

The student should never feel lost.

The student should never think about planning.

Captain Delta plans.

The student flies.

---

# Success Criteria

The Mission Engine is successful when:

The student opens ICAO Delta.

Presses one button.

Completes one guided mission.

Leaves more confident than before.

The student never asks:

"What should I study now?"

Captain Delta has already answered that question.

---

# Implementation Map

## Current Implementation

| Concern | Location |
| ------- | -------- |
| Daily mission orchestration | `lib/dailyMission.ts` |
| Daily exam rotation | `lib/dailyExamRotation.ts` |
| Per-leg missions | `lib/pronunciationDailyMission.ts`, `lib/vocabDailyMission.ts`, `lib/part1DailyMission.ts`, `lib/part2DailyMission.ts`, `lib/simulateDailyMission.ts` |
| Study mode (standard / intense) | `lib/studyTime.ts` |
| Dashboard UI | `components/DailyMissionPanel.tsx` |
| Server sync | `app/api/daily-mission/route.ts` |

See [architecture/runtime-map.md](./architecture/runtime-map.md).

## Target Architecture

| Concern | Location |
| ------- | -------- |
| Mission Engine module | `lib/missionEngine/` |
| Mission Board UI | `components/MissionBoard/` |
| Mission progress | `components/FlightProgress/` |
| Mission recovery | `lib/missionRecovery.ts` |
| Captain orchestration | `lib/captainDelta/orchestrator.ts` |

The Mission Engine is the orchestrator of ICAO Delta.

Every learning module is executed through the Mission Engine.

No module should become an isolated experience.
