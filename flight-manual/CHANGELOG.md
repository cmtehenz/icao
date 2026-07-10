# Changelog

Manual version history only. Sprint and audit details belong in Git history.

---

## 3.7 — July 2026

**Home secondary training strip.**

- Escutar Prova and ICAOFlix always visible below daily mission CTA (outline cards, not primary buttons)
- Records & insights collapsed section is analytics only — quick links removed from widgets
- §07 documents three-layer home shell; §09 ICAOFlix home entry updated

---

## 3.6 — July 2026

**Part 1 mission reform — anti-memorization mastery pipeline.**

- Default `/part1` is mission mode: brief → anchors → PEEL shadow → keywords → coach
- Mission CTA and deep links never skip brief or anchor steps
- Card #01 model answer aligned with FAA Rotorcraft Collective, SKYbrary OGHFA, CRM
- Brief step includes curated reference videos (FAA) and links (SKYbrary)
- Flight Manual §06 documents study techniques and 12-question bank
- Browse mode at `/part1?browse=1` for library review only

---

## 3.5 — July 2026

**Part 1 mastery + mission progression fix.**

- Pronunciation warm-up only blocks before Word Mission; after vocab leg → Part 1 (TAKEOFF)
- Dedicated warm-up mode at `/word-mission?warmup=1`
- Part 1 mastery tracker: 12 SDEA questions, PEEL shadow + coach → exam ready
- Flight Manual documents Part 1 teaching method

---

## 3.4 — July 2026

**Adaptive training redesign (RFC-004) — Phase 4 progressive scaffolding.**

- Part 1 and Word Mission read assistance level from `StudentTrainingProfile`
- Scaffolding ladder: full model → blocks → keywords → solo
- Re-checkride cadence by phase; plateau detection pulls checkride forward after debrief

---

## 3.3 — July 2026

**Adaptive training redesign (RFC-004) — Phase 3 UX shell.**

- Home: phase badge, plan strip (leg progress + hint), Ready CTA
- Checkride polish: kind chips, recording pulse, quieter skip, phase result badge
- Token refresh: academy slate/mist, dark-theme academy vars, spacing rhythm

---

## 3.2 — July 2026

**Adaptive training redesign (RFC-004) — Phase 0–2.**

- Entry speaking checkride (`/checkride`) with skip → Foundation
- `StudentTrainingProfile` stores phase, weak areas, probe results
- Home gates on checkride before Begin Flight
- Mission Engine reads adaptive plan: pronunciation-first + phase term counts
- Visual refresh: flight academy premium (navy/amber, DM Sans)

---

## 3.1 — July 2026

**Captain-led conversation.** Captain initiates coaching turns and mission handoffs; student responds and flies.

- Mission milestones speak via TTS with Ready CTAs from `getNextMissionAction()`
- Word Mission listen steps auto-advance after Captain finishes speaking
- Standby / FAB copy prioritizes continuing the mission over “ask a question”
- ADR-009 unchanged: Captain coaches; Mission Engine owns state

---

## 3.0 — July 2026

**Flight Manual reset.** Consolidated 100+ documents into eight chapters + decisions.

- Deleted: sprint reports, audits, implementation status, runtime snapshots, migration notes
- Merged: product philosophy, mission engine, captain delta, architecture, pipelines, knowledge engine, UX
- Single source of truth: `flight-manual/` only

---

## 2.0 — July 2026

Documentation architecture: numbered chapters, educational-systems, learning-tools, ADRs.

---

## 1.0 — Initial

Flight Manual v1 — product philosophy and mission specifications.
