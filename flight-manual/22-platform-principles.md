# Section 22 — Platform Principles

Version 1.0

**Immutable rules of the ICAO Delta platform.**

These principles are **permanent**. Every future RFC, ADR, and pull request must respect them.

Violating a principle requires an explicit ADR amendment and Chief Architect approval.

Related: [ARCHITECTURE-FREEZE.md](./ARCHITECTURE-FREEZE.md) · [99-non-negotiable-rules.md](./99-non-negotiable-rules.md) · [RFC-003](./architecture/rfc/RFC-003-architecture-stress-test-platform-freeze.md)

---

## How to use

| Audience | Use |
|----------|-----|
| **Engineers** | PR checklist — cite principle ID if touching Captain, engine, or programs |
| **Product** | Feature acceptance — does this bypass a principle? |
| **RFC authors** | Mandatory compatibility section |

---

## Principles

### PP-01 — One responsibility, one owner

Every concern has exactly one authoritative owner. Mission progression → Mission Engine. Teaching pedagogy → EIA/CDLI. Course content → Training Programs. In-leg mechanics → Learning Tools.

No shared ownership of progression or completion.

---

### PP-02 — Mission Engine owns progression

Only `lib/dailyMission.ts` (and its locked successors) decides leg order, next action, and mission complete. No UI, Captain, program, or academy module may invent the next leg.

*Enforced: ADR-001, ADR-004, ADR-005.*

---

### PP-03 — Captain never owns mission state

Captain Delta interprets, coaches, encourages, and explains. Captain **never** marks legs complete, skips missions, toggles study mode, or awards achievements autonomously.

*Enforced: ADR-009, IP-12.*

---

### PP-04 — Programs configure; they never fork

Training Programs supply manifests and content packs. They **never** ship alternate Mission Engines, Captain personas, CDLI modules, or Learning Tool forks.

*Enforced: RFC-002, ADR-013.*

---

### PP-05 — Educational Intelligence teaches; it never orchestrates

CDLI shapes *how* Captain teaches. CDLI **never** chooses the next leg, completes tasks, or replaces the Mission Flow Matrix.

*Enforced: RFC-001.*

---

### PP-06 — Content is data; logic is platform

Vocabulary lists, scenarios, rubrics, and media are **data**. Orchestration, evaluation pipelines, sync, and pedagogy engines are **platform**. New courses add data — not control flow forks.

---

### PP-07 — AI augments pedagogy; it never replaces it

Azure and LLMs score, transcribe, and structure feedback. Flight Manual pedagogy (PA ladder, one priority, recall-not-review) remains authoritative. AI does not silently redefine teaching rules.

---

### PP-08 — Students see one instructor

Captain Delta is the only instructor face across all programs. Students never interact with CDLI, agents, or the Mission Engine directly.

*Enforced: Section 02, Section 14.*

---

### PP-09 — Learning Tools stay orthogonal

Progressive Assistance, gates, replay, timeline, and related tools run **inside** legs. They are not mission legs and not program-specific forks.

*Enforced: mission-flow-matrix, RFC-001.*

---

### PP-10 — Architecture favors simplicity

Prefer one graph, one loop, one engine, five CDLI capabilities. Reject parallel systems that duplicate an existing layer. Elegance over feature accumulation.

*Established: RFC-001, RFC-003 stress test.*

---

### PP-11 — Offline is always supported

Daily mission state must remain usable without continuous connectivity. Server sync enhances — never blocks — local-first practice. New features must not require always-on network for core training loops.

*Aligned: mission-state-sync, PWA.*

---

### PP-12 — No feature bypasses the Mission Engine

Shortcuts, dashboards, and academy widgets may **display** progress. They may not **advance** missions. Every student path to the next leg goes through `getNextMissionAction()`.

*Enforced: ADR-002, ADR-010, Sprint 1.*

---

### PP-13 — Matrix leg types are canonical

Mission sequence uses leg **types** from [mission-flow-matrix.md](./architecture/mission-flow-matrix.md). Programs declare profiles; they do not invent parallel sequences. New leg types require matrix + ADR amendment.

---

### PP-14 — Memory serves learning

Store only what improves tomorrow's teaching. Analytics without learning purpose do not belong in Learning Memory.

*Enforced: Section 13, IP-14.*

---

### PP-15 — Platform freeze is the default

After RFC-003, architectural layers are frozen. Implementation proceeds until a stress test or production failure proves a principle cannot hold — then document and ADR, do not silently fork.

*Governance: [ARCHITECTURE-FREEZE.md](./ARCHITECTURE-FREEZE.md).*

---

## PR checklist

- [ ] Identified owner (PP-01)
- [ ] No Captain mission writes (PP-03)
- [ ] No program fork (PP-04)
- [ ] No engine bypass (PP-12)
- [ ] Content vs logic separated (PP-06)

---

## Related

- [instructional-principles.md](./educational-systems/instructional-principles.md) — teaching rules (IP-*)
- [23-product-north-star.md](./23-product-north-star.md) — vision compass
