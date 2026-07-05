# Section 17 — Development Rules

Version 1.0

Related Chapters

Flight Manual (All)

Section 14 — AI Brain

Section 15 — Prompt Engineering

Section 16 — ICAO Knowledge Base

---

# Philosophy

ICAO Delta is a long-term product.

Every new feature must improve the learning experience.

Never increase complexity.

Never break the teaching philosophy.

The student experience is always more important than implementation speed.

Every developer becomes a guardian of the ICAO Delta philosophy.

---

# Development Principles

Every implementation should answer four questions.

1.

Does this improve learning?

2.

Does this simplify the student experience?

3.

Does it follow the Flight Manual?

4.

Would Captain Delta recommend this feature?

If any answer is "No",

the implementation should be reconsidered.

---

# Source of Truth

ICAO Delta documentation is layered. Full rules: [DOCUMENTATION-HIERARCHY.md](../DOCUMENTATION-HIERARCHY.md).

**Product behavior** — Flight Manual chapters + learning-tools + architecture (product).

**Shipped today** — [CURRENT-PRODUCT.md](../CURRENT-PRODUCT.md).

**Gap** — [IMPLEMENTATION-STATUS.md](../IMPLEMENTATION-STATUS.md).

**AI product rules** (within the manual):

1. Flight Manual — student experience and pedagogy  
2. AI Brain ([14-ai-brain.md](../14-ai-brain.md)) — agent responsibilities  
3. Prompt Engineering ([15-prompt-engineering.md](../15-prompt-engineering.md)) — prompt discipline  
4. ICAO Knowledge Base ([16-icao-knowledge-base.md](../16-icao-knowledge-base.md)) — aviation facts  

**Technical contracts** — `docs/`, `prompts/`, [runtime-map.md](../architecture/runtime-map.md).

No implementation may contradict Flight Manual **product intent**. Shipped behavior must match CURRENT-PRODUCT until a PR closes a documented gap.

---

# Before Writing Code

Every developer must read:

00 Introduction

↓

01 Product Philosophy

↓

02 Captain Delta

↓

03 Mission Engine

↓

[ONBOARDING.md](../ONBOARDING.md) — full paths for your role

↓

[architecture/runtime-map.md](../architecture/runtime-map.md) — before touching code

03A Complete Flight Mission

↓

Related Module

Only then should implementation begin.

---

# Feature Development Workflow

Every new feature follows the same lifecycle.

Idea

↓

Flight Manual

↓

Knowledge Base (if aviation content)

↓

Prompt (if AI)

↓

Implementation

↓

Testing

↓

Review

↓

Release

Code should never come first.

Documentation comes first.

---

# Flight Manual Rule

Every behavior change must update the Flight Manual first.

Examples

New Mission

New Captain behavior

New scoring

New evaluation

New navigation

If behavior changes,

documentation changes first.

---

# Prompt Rule

Every new AI behavior requires:

Prompt update.

Prompt version increment.

Regression testing.

Flight Manual reference.

Prompts never become the source of truth.

---

# Knowledge Rule

Operational aviation information belongs only in the Knowledge Base.

Never duplicate:

ICAO procedures.

Vocabulary.

Phraseology.

Emergencies.

Grammar rules.

If aviation knowledge changes,

only the Knowledge Base should require updating.

---

# AI Rule

Every AI agent must have exactly one responsibility.

Never create generic AI.

Examples

Correct

Pronunciation Coach

Incorrect

General AI Assistant

Single responsibility always wins.

---

# Captain Delta Rule

Captain Delta is the only AI visible to the student.

All other agents work behind the scenes.

The student should feel they are talking to one instructor.

Never multiple assistants.

---

# UI Rule

Every screen answers three questions immediately.

Where am I?

What am I doing?

What should I do next?

If not,

the UI must be simplified.

---

# Design Rule

Every new screen follows the Mission Flow.

Captain

↓

Objective

↓

Activity

↓

Feedback

↓

Next Step

Consistency reduces cognitive load.

---

# Coding Principles

Prefer:

Simple

Readable

Predictable

Modular

Reusable

Avoid:

Magic values.

Duplicated logic.

Business rules inside UI.

Large components.

Unclear naming.

---

# Architecture Principles

Business Logic

↓

Services

↓

AI

↓

Components

↓

Pages

UI should never contain business rules.

AI should never control navigation.

Navigation belongs to the Mission Engine.

---

# Testing Requirements

Every new feature should include:

Happy path.

Edge cases.

Offline behavior.

Captain behavior.

Mission integration.

Regression test.

If AI output changes,

golden examples should be updated.

---

# Performance Rules

Learning flow comes first.

Performance comes second.

However,

the application should feel instantaneous.

Target:

Mission transitions under 300 ms.

Captain responses under 2 seconds.

Audio playback immediate.

Recording feedback under 5 seconds.

---

# Accessibility

Every feature should support:

Keyboard navigation.

Screen readers.

Reduced motion.

Large touch targets.

Offline usage whenever possible.

Accessibility is part of product quality.

---

# Versioning

Every important change updates:

Flight Manual

↓

Prompt

↓

Knowledge Base

↓

Version History

Documentation and implementation evolve together.

---

# Pull Request Checklist

Before merging any feature:

☐ Flight Manual updated

☐ Prompt updated (if AI)

☐ Knowledge Base updated (if aviation)

☐ Tests added

☐ Captain Delta behavior verified

☐ Mission integration verified

☐ Mobile verified

☐ Desktop verified

☐ Offline verified

☐ No duplicated logic

---

# Release Philosophy

Never release unfinished learning experiences.

Prefer:

One polished feature.

Instead of:

Five incomplete features.

Quality always wins.

---

# Golden Rules

Documentation First.

Student First.

Captain Delta First.

Mission First.

Learning First.

Everything else is secondary.

---

# Future Vision

ICAO Delta should continue evolving for many years.

The architecture should allow new missions,

new AI agents,

new ICAO examinations,

new aviation knowledge,

without redesigning the product.

The product should become richer,

never more complicated.

---

# Success Criteria

Development is successful when:

New developers understand the project quickly.

Features remain consistent.

Captain Delta always behaves the same.

The student experience continuously improves.

The product becomes easier to maintain over time.

---

# Final Principle

Every line of code should answer one question.

"Will this help a pilot pass the ICAO examination?"

If the answer is no,

that code probably does not belong in ICAO Delta.