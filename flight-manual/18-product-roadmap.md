# Section 18 — Product Roadmap

Version 2.0

Related Chapters

[IMPLEMENTATION-STATUS.md](./IMPLEMENTATION-STATUS.md) — truth table (spec vs code)

[CURRENT-PRODUCT.md](./CURRENT-PRODUCT.md) — shipped today

Section 14 — AI Brain

Section 17 — Development Rules

---

# Philosophy

ICAO Delta is not built around features.

It is built around a long-term vision: an **AI Flight Training Platform** where **Training Programs** plug in as content.

**ICAO English** is Program 1. The roadmap describes platform and program direction. Implementation truth lives in **IMPLEMENTATION-STATUS.md**.

Never mark a future capability as released in this chapter.

**Era 4–10** below are long-term **product evolution buckets**. They are not the same as per-chapter document headers (`Version 3.0` on Section 03 = chapter revision). See [TERMINOLOGY.md](./TERMINOLOGY.md) and [DECISION-RECORDS.md](./DECISION-RECORDS.md) Decision 010.

---

# Released

Capabilities **in production** today.

## Mission Engine (core)

- Daily exam rotation (23C → 24C → 25C → 26C)
- Ordered daily mission: Pronunciation → Vocabulary → Part 1 → Part 2
- Optional Mock Exam on intense study days
- Mission completion logging

## Missions

- **Pronunciation Mission** — vault, four levels, smart graduation, five words/day
- **Vocabulary Mission** — twenty terms/day, SRS, exam pool
- **Part 1 Mission** — three cards/day, PEEL shadow + coach
- **Part 2 Mission** — five situations/day, full simulation mode
- **Mock Exam** — simulado Parts 1–2 primary; Parts 3–4 in flow

## Captain Delta

- Text debrief after coached answers (Flight Instructor JSON)
- Simulation debrief
- Visual coaching (keywords, pronunciation syllables) — context-scoped
- PTT screen coach API
- Examiner mode text in simulado
- Voice/proactive coaching **disabled** by config (released as off)

## Platform

- Auth, vault sync, evaluation history, study activity
- Azure STT, pronunciation assessment, TTS infrastructure
- Escutar Prova with offline audio packs
- PWA, daily dashboard, teacher report

---

# In Development

Work actively tracked against the manual **without** a fixed release date.

*(Empty — update when a feature branch is the agreed focus.)*

Suggested candidates when development starts:

- Documentation-driven Mission Recall prototype
- Vocabulary L1–L4 UI parity design

---

# Next Version

Target for the **next major product slice** after current production. Not yet released.

## Mission completeness

- **Mission Recall** (Section 08) — active recall leg before Mock Exam
- **Unified flight briefing** — single Begin Flight entry (03A)
- **Mission Timeline** learning tool — visible legs and progress
- **Simulado** — Part 1 questions locked to exam version (shipped); polish examiner flow

## Module parity

- **Vocabulary Mission** — Progressive Assistance levels matching Pronunciation
- **Part 1** — conversation follow-up aligned with Section 06 v5
- **Captain Delta voice** — re-enabled with proactive rules from Section 02

## Learning tools (first wave)

- **Confidence Gates** — gate assistance reduction on demonstrated confidence
- **Visual Coaching** — complete context matrix per learning-tools spec
- **Quick Notes** — operational shorthand enforcement in Part 2

---

# Future Vision

Long-term evolution. **Not scheduled.** Preserves philosophy from prior roadmap versions.

## Era 4 — Adaptive Flight Academy

- Adaptive mission planning from Learning Memory
- Personalized schedules and weakness prediction
- Conversation Confidence tracking surfaced to student
- No two identical daily missions

## Era 5 — Professional Pilot Development (programs)

Training programs on the fixed platform (see [21-training-programs.md](./21-training-programs.md)):

- **CRM Essentials** — crew resource management communication
- Airline / technical interview missions
- Leadership and TEM communication modules

## Era 6 — Operational Aviation Training (programs)

- **H145 / AW169** type-rating oral communication tracks
- **Offshore / HAA / NVG** operational communication programs
- Real-world ATC scenarios beyond SDEA exam set
- Multi-crew and emergency communication tracks

## Era 7 — AI Flight Academy

- Full [AI Brain](./14-ai-brain.md) agent fleet as separate orchestrated services
- Persistent multi-year Captain relationship
- Natural voice conversations

## Eras 8–10 — Multi-aircraft & global ecosystem

- Helicopter, airplane, airline tracks
- Flight schools, airlines, training centers as audiences
- VR/simulator integration **only if** pedagogy improves

---

# AI evolution (vision)

Captain Delta phases — aspirational:

1. Instructor *(mostly today — text)*
2. Adaptive Coach
3. Conversation Partner
4. Professional Mentor
5. Persistent Aviation Companion

---

# Principles preserved in every version

Captain Delta identity.

Mission-based learning.

Professional aviation language.

Progressive Assistance.

Mission Recall.

Flight Debrief.

Learning Memory.

Flight Logbook.

Situation Board.

These never become a generic English course.

---

# Features that will never exist

- Generic English course
- Grammar-first platform
- Gamified points without operational meaning
- Chatbot replacing instructor
- PDF-only repository
- Entertainment over exam preparation

---

# Success metrics

Students feel more confident, communicate naturally, think in aviation English, pass ICAO Level 4+, and optionally continue with Captain Delta after the exam.

---

# How to update this roadmap

1. Move items **only** from Next Version → Released when [CURRENT-PRODUCT.md](./CURRENT-PRODUCT.md) and [IMPLEMENTATION-STATUS.md](./IMPLEMENTATION-STATUS.md) are updated.
2. Never use ✅ in this file — use **Released** section instead.
3. Link Flight Manual chapter changes in the same PR as scope changes.

---

# Final statement

ICAO Delta is a long-term aviation training ecosystem.

Every feature moves the platform toward: **one personal instructor, one daily flight, one step closer to ICAO Level 4.**
