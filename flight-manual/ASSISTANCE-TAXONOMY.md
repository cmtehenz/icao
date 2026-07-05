# Assistance Taxonomy

**Disambiguating “Level” in ICAO Delta.**

The word *Level* means different things in aviation training. This taxonomy **does not rename ICAO proficiency levels** (Level 4, Level 5). It adds **codes** for assistance and mission graduation so engineers, writers, and Captain Delta prompts stay aligned.

Full governance: [DOCUMENTATION-HIERARCHY.md](./DOCUMENTATION-HIERARCHY.md)

Mission chapters may still use prose (“Level 2 — Expression”) for students. **New technical writing** should prefer codes below.

---

## ICAO proficiency (unchanged)

| Term | Meaning | Do not rename |
|------|---------|---------------|
| **ICAO Level 4** | Minimum operational proficiency for license | Exam outcome |
| **ICAO Level 5** | Extended proficiency | Exam outcome |

Never use PA-, PR-, VB-, or P1- codes for ICAO exam results.

---

## Progressive Assistance (universal pedagogy)

Cross-mission methodology: [learning-tools/progressive-assistance.md](./learning-tools/progressive-assistance.md)

| Code | Name | Student experience |
|------|------|-------------------|
| **PA-1** | Demonstration | Captain shows complete model |
| **PA-2** | Guided Reconstruction | Student rebuilds with structure |
| **PA-3** | Guided Recall | Student recalls with prompts |
| **PA-4** | Memory Triggers | Symbols / minimal cues only |
| **PA-5** | Independent Communication | No visual assistance |

Every mission maps its own ladder onto PA-1…PA-5 **by pedagogy**, not by identical labels.

---

## Pronunciation Mission (PR)

Chapter: [04-pronunciation.md](./04-pronunciation.md)

| Code | Name | Graduation | Status |
|------|------|------------|--------|
| **PR-1** | Word | Azure word clarity | Shipped |
| **PR-2** | Expression | Operational phrase | Shipped |
| **PR-3** | Aviation Sentence | Sentence in context | Shipped |
| **PR-4** | ICAO Answer | Exam-style usage | Shipped |
| **PR-5** | Conversation | Natural use in dialogue | Target — vault graduation today stops at PR-4 |

---

## Vocabulary Mission (VB)

Chapter: [05-vocabulary.md](./05-vocabulary.md)

| Code | Name | Status |
|------|------|--------|
| **VB-1** | Meaning | Shipped |
| **VB-2** | Operational Expression | Shipped |
| **VB-3** | Aviation Sentence | Shipped |
| **VB-4** | ICAO Use | Shipped |
| **VB-5** | Natural Conversation | Target — parity with pronunciation mission |

---

## Part 1 Mission (P1)

Chapter: [06-part1.md](./06-part1.md)

| Code | Name | PEEL / assistance | Status |
|------|------|-------------------|--------|
| **P1-1** | Full Answer | Model answer visible | Shipped (shadow) |
| **P1-2** | Sentence Blocks | PEEL puzzle | Shipped |
| **P1-3** | Keywords | Essential ideas only | Shipped |
| **P1-4** | Symbols | Visual memory triggers | Shipped |
| **P1-5** | No Help | Independent answer | Shipped |
| **P1-6** | Examiner Conversation | Follow-up, adaptive dialogue | Target (Section 06 v5) |

*Prose aliases:* “Sentence Puzzle” in learning-tools = **P1-2**. “Independent Answer” in progressive-assistance = **P1-5**.

---

## Part 2 Mission (P2)

Chapter: [07-part2.md](./07-part2.md)

| Code | Name | Status |
|------|------|--------|
| **P2-1** | Complete Readback | Shipped |
| **P2-2** | Partial Readback | Partial |
| **P2-3** | Quick Notes | Partial |
| **P2-4** | Situation Prompt | Target |
| **P2-5** | Full ICAO Interaction | Shipped (simulation) |

---

## Part 3 Mission (P3)

Mock / future daily leg — [09-mock-exam.md](./09-mock-exam.md), [16-icao-knowledge-base.md](./16-icao-knowledge-base.md)

| Code | Name |
|------|------|
| **P3-1** | Guided Listening |
| **P3-2** | Quick Notes |
| **P3-3** | Situation Retelling |
| **P3-4** | Situation Comparison |
| **P3-5** | Operational Discussion |

---

## Part 4 Mission (P4)

| Code | Name |
|------|------|
| **P4-1** | Picture Vocabulary |
| **P4-2** | Description Guide |
| **P4-3** | Guided Description |
| **P4-4** | Independent Description |
| **P4-5** | Examiner Follow-up |

---

## Confidence Gates (CG)

Learning tool: [learning-tools/confidence-gates.md](./learning-tools/confidence-gates.md)

**CG** = checkpoint *between* assistance codes (e.g. PR-2 → PR-3), not a replacement for PR/P1 codes.

Example: “Gate passed at PR-3” = student demonstrated confidence to leave PR-3 toward PR-4.

---

## Visual Coaching (VC)

Learning tool: [learning-tools/visual-coaching.md](./learning-tools/visual-coaching.md)

**VC-1…VC-5** = intensity of visual focus (keyword → syllable → structure), scoped per mission context. Do not confuse with PR- or P1- graduation.

---

## Usage rules

1. **Specs & IMPLEMENTATION-STATUS** — use codes.  
2. **Student-facing UI** — plain language (“Level 2 — Expression”) is fine; optionally show code in dev tools.  
3. **Never** write “Level 5” for assistance when you mean ICAO Level 5 — say **ICAO Level 5** or **PA-5** explicitly.  
4. Chapter rewrites to codes are **not required yet** — this file establishes the standard.

---

## Related

- [TERMINOLOGY.md](./TERMINOLOGY.md)  
- [learning-architecture.md](./architecture/learning-architecture.md)
