# Changelog

Manual version history only. Sprint and audit details belong in Git history.

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
