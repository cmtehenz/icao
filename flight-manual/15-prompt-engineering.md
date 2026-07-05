# Section 15 — Prompt Engineering

Version 1.0

Related Chapters

Section 14 — AI Brain

All AI Prompt Files

---

# Philosophy

Prompts are software.

They should be treated with the same care as source code.

A prompt is never temporary.

A prompt defines the behavior of an AI agent.

Poor prompts create inconsistent learning.

Well-designed prompts create consistent instructors.

---

# Objective

Standardize every AI prompt used inside ICAO Delta.

Every prompt should:

Have one responsibility.

Produce predictable outputs.

Follow the same writing style.

Remain easy to maintain.

---

# Prompt Principles

Every prompt should:

• Have one purpose.

• Have one expected output.

• Avoid unnecessary instructions.

• Produce deterministic responses whenever possible.

Prompts should teach.

Never improvise.

---

# Standard Prompt Structure

Every prompt follows the same structure.

1. Identity

Who is the AI?

Example

"You are an ICAO Flight Instructor."

---

2. Objective

What should the AI accomplish?

---

3. Context

What information is available?

Examples

Question

Transcript

Vocabulary

Memory

Mission

---

4. Rules

Mandatory behaviors.

Examples

One priority improvement only.

Never rewrite the student's story.

Never coach during Mock Exam.

---

5. Output Format

Every prompt must define its output.

Preferred formats:

Structured JSON

Markdown

Typed Objects

Never free-form responses if consumed by code.

---

# Prompt Categories

Captain Delta

Mission Planner

Pronunciation Coach

Vocabulary Coach

Flight Instructor

ICAO Examiner

Replay Analyzer

Debrief Engine

Recommendation Engine

Memory Engine

Analytics Engine

Every AI owns exactly one prompt.

---

# Prompt Versioning

Every prompt contains:

Version

Purpose

Owner

Last Update

Related Flight Manual Chapter

Breaking Changes

---

# Prompt Design Rules

Never duplicate business rules.

Business rules belong in the Flight Manual.

Prompts implement the Flight Manual.

Never the opposite.

---

# Prompt Testing

Every prompt should have:

Golden examples.

Edge cases.

Failure cases.

Regression tests.

Expected outputs.

Prompt changes should never be deployed without testing.

---

# AI Consistency

Different prompts must never contradict each other.

Captain Delta remains the final voice.

Other agents provide structured information.

Captain communicates it.

---

# Future Vision

Prompt templates should eventually generate new prompts automatically.

Every future AI agent inherits the same architecture.

---

# Golden Rule

The Flight Manual defines behavior.

Prompts execute behavior.

Never duplicate the source of truth.

---

# Success Criteria

Every AI behaves consistently.

Prompt updates become safe.

Future AI agents can be added without redesigning the system.

---

# Suggested Folder Structure

prompts/

captain-delta.md

mission-planner.md

pronunciation.md

vocabulary.md

flight-instructor.md

examiner.md

part2-atc.md

part3.md

part4.md

debrief.md

memory.md

recommendation.md

analytics.md
