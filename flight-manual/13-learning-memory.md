# Section 13 — Learning Memory

Version 3.0

Related Chapters

Section 02 — Captain Delta

Section 03 — Mission Engine

Section 10 — Flight Debrief

---

# Philosophy

ICAO Delta does not store data.

ICAO Delta remembers learning.

Every piece of information exists for one purpose:

Helping Captain Delta make tomorrow's mission better than today's.

If a piece of data does not improve learning,

it should not be stored.

Learning comes before analytics.

Always.

---

# Learning Memory

Captain Delta remembers the student's aviation journey.

Not just scores.

Captain remembers:

Weak pronunciation.

Strong vocabulary.

Conversation confidence.

Mission history.

Repeated mistakes.

Successful recoveries.

Favorite missions.

Study consistency.

The student should feel:

"Captain remembers how I learn."

---

# Memory Categories

Learning Memory is divided into several areas.

---

## Student Profile

Stores long-term information.

Examples

Name

Exam Date

Preferred Aircraft

Native Language

Study Preferences

Mission Preferences

This information rarely changes.

---

## Pronunciation Memory

Stores pronunciation history.

Examples

Weak words.

Graduated words.

Best score.

Current level.

Weak syllables.

Next review date.

Related ICAO question.

Purpose

Adaptive pronunciation missions.

---

## Vocabulary Memory

Stores operational vocabulary.

Examples

Known terms.

Review schedule.

Context learned.

Exam association.

Last successful usage.

Purpose

Adaptive vocabulary missions.

---

## Part 1 Memory

Stores communication development.

Captain remembers:

Questions answered.

Conversation confidence.

Naturalness trends.

Favorite personal stories.

Repeated structures.

Weak topics.

Purpose

Improve future coaching.

---

## Part 2 Memory

Captain remembers:

Readback accuracy.

Listening performance.

Reported Speech.

Quick Notes quality.

Operational communication.

Common mistakes.

Purpose

Create better communication missions.

---

## Part 3 Memory

Captain remembers:

Listening comprehension.

Situation comparison.

Emergency reasoning.

Decision making.

Operational analysis.

Purpose

Improve future situation analysis.

---

## Part 4 Memory

Captain remembers:

Description ability.

Storytelling.

Picture vocabulary.

Discussion quality.

Technical aviation language.

Purpose

Develop natural speaking.

---

## Mock Exam Memory

Captain stores:

Every completed examination.

Conversation confidence.

Mission readiness.

Replay moments.

Improvement history.

Overall trends.

Purpose

Measure long-term readiness.

---

## Flight Logbook

Every mission creates a permanent flight log.

Each log contains:

Mission Number.

Exam Version.

Mission Duration.

Captain Note.

Overall Readiness.

Mission Completed.

Flight Logbook becomes the student's learning diary.

---

# Daily Memory Cycle

Every completed mission updates memory.

Captain remembers.

↓

Tomorrow's Mission changes.

↓

Captain Briefing changes.

↓

Vocabulary changes.

↓

Pronunciation changes.

↓

Mock Exam adapts.

Learning is continuous.

---

# Adaptive Learning

Captain Delta never teaches randomly.

Every recommendation is based on memory.

Examples

Weak pronunciation

↓

Pronunciation Mission.

Weak Part 2

↓

Communication Mission.

Weak Follow-up Questions

↓

Conversation Practice.

Strong Performance

↓

Support decreases automatically.

The system adapts continuously.

---

# Offline Philosophy

Learning should never stop.

Local memory stores:

Current Mission.

Progress.

Vocabulary.

Pronunciation.

Captain Memory.

Audio Downloads.

When internet returns,

Captain synchronizes automatically.

Offline first.

Cloud enhanced.

Never cloud dependent.

---

# Synchronization

Cloud synchronization should be invisible.

Merge.

Never overwrite.

Preserve progress.

Resolve conflicts safely.

The student should never think about synchronization.

---

# Privacy

Captain remembers learning.

Not personal life.

No sensitive personal information is stored unless explicitly required by the user.

Learning data belongs to the student.

Always.

---

# Golden Rule

Only Remember What Improves Tomorrow's Mission.

Every stored value should answer one question.

"Will this help Captain teach better tomorrow?"

If the answer is no,

the data should not exist.

---

# Future Vision

Eventually,

Captain Delta should know the student's learning style.

Not because the student configured it.

Because Captain observed it.

Examples

Best study time.

Preferred mission length.

Weak pronunciation patterns.

Confidence under pressure.

Favorite learning methods.

The more missions completed,

the better Captain teaches.

---

# Success Criteria

Learning Memory is successful when:

The student feels every mission is personalized.

Captain always knows what to practice next.

Progress feels continuous.

Nothing important is forgotten.

The student never needs to explain their learning history again.

---

# Implementation Map

## Current Implementation

| Concern | Location |
| ------- | -------- |
| Instructor memory (client) | `lib/captainDelta/memory/store.ts` |
| Captain memory types | `lib/captainDelta/memory/*` |
| Vault sync | `app/api/vault/route.ts`, `lib/vaultMerge.ts`, Prisma `VaultWord` |
| Evaluations | `app/api/evaluations/`, Prisma `Evaluation` |
| Study activity | Prisma `StudyDay`, `DailyMissionDay` |
| Session close / briefing builders | `lib/captainDelta/memory/sessionClose.ts`, `briefing.ts` |

See [architecture/runtime-map.md](./architecture/runtime-map.md).

## Target Architecture

| Concern              | Location        |
| -------------------- | --------------- |
| Student Profile      | lib/memory/profile/       |
| Pronunciation Memory | lib/memory/pronunciation/ |
| Vocabulary Memory    | lib/memory/vocabulary/    |
| Part 1 Memory        | lib/memory/part1/         |
| Part 2 Memory        | lib/memory/part2/         |
| Part 3 Memory        | lib/memory/part3/         |
| Part 4 Memory        | lib/memory/part4/         |
| Flight Logbook       | lib/memory/logbook/       |
| Sync Engine          | lib/memory/sync/          |
| Offline Store        | lib/memory/offline/       |

Learning Memory exists to make every future mission smarter than the previous one.

Every implementation must preserve this philosophy.
