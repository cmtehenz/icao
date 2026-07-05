# ADR-004: Mission Progression Ownership

| Field | Value |
|-------|-------|
| **Status** | Proposed → **Locked on approval** |
| **Date** | July 2026 |
| **Deciders** | Tech Lead, Product Architect |
| **Related** | ADR-001, ADR-005, Section 99 Rule 2, mission-flow-matrix |

---

## Context

“Mission progression” means: **which leg the student is on**, **whether a leg is complete**, and **what happens next**.

Today:

- `dailyMission.ts` implements progression correctly
- `flightMission.ts` builds unrelated leg sequences
- Individual trainers sometimes deep-link without checking global progression
- `dailyMissionSync.missionsComplete()` ignores pronunciation and simulado

The Flight Manual states the student never chooses the next activity (Rule 2). Progression must be centralized.

---

## Decision

### Progression owner: `lib/dailyMission.ts`

Only `dailyMission.ts` may:

| Function | Responsibility |
|----------|----------------|
| `getNextMissionAction()` | Return the single next href/title/hint |
| `isDailyMissionComplete()` | Boolean — all required legs done for today's mode |
| `getDailyMissionSummary()` | Per-leg progress snapshot for UI |

### Leg modules: mutation only

Per-leg files may:

- Mark items complete within their leg (word, term, card, simulation flag)
- Emit change events

Per-leg files **must not**:

- Skip to another leg
- Show “mission complete” for the full day
- Compute next route across legs

### UI rule

Components may call `getNextMissionAction()` for CTAs. They **must not** implement fallback chains like “if part1 done go part2” locally.

**Allowed exception:** Within-leg progression (e.g. next PEEL block inside Part 1) stays in `lib/peelBlocks.ts` / trainer components — that is **intra-leg**, not mission progression.

### Mode-aware progression

| Mode | Required legs for `isDailyMissionComplete()` |
|------|---------------------------------------------|
| **standard** | pronunciation + vocabulary + part1 + part2 |
| **intense** | above + simulado full mock for today's exam |

Future (Sprint 3+): add Mission Recall before mock (intense) and before debrief (standard) — still defined only in `dailyMission.ts`.

---

## Alternatives considered

| Alternative | Rejected because |
|-------------|------------------|
| **Progression in React context** | Captain Delta and debrief APIs cannot access it |
| **Per-trainer owns exit redirect** | Causes race and wrong order |
| **`flightMission.ts` adaptive progression** | Violates matrix; conflates weakness priority with leg order |

---

## Consequences

**Positive**

- Rule 2 enforceable in code
- Single function to test (Vitest target for Sprint 1)
- Recall/Debrief slot in without UI rewrites

**Negative**

- Trainers must call leg completion APIs that trigger events, not self-redirect to next module

---

## Verification

- [ ] Vitest: `getNextMissionAction()` order for empty/partial/complete states
- [ ] No `router.push('/part2')` on part1 complete outside leg-specific flows
- [ ] `isDailyMissionComplete()` includes simulado only when intense
