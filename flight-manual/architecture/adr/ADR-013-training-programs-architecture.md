# ADR-013: Training Programs Architecture

| Field | Value |
|-------|-------|
| **Status** | **Locked** |
| **Date** | July 2026 |
| **Deciders** | Chief Product Architect |
| **Related** | RFC-002, [21-training-programs.md](../../21-training-programs.md), ADR-001–012 |

---

## Context

RFC-002 defined Training Programs as pluggable content on a fixed platform. ICAO English is Program 1. Implementation must not fork Mission Engine, Captain Delta, EIA, or Learning Tools per program.

---

## Decision

1. **Training Programs** configure the platform via manifests and content packs — they do not replace platform layers.
2. **Mission Engine** remains the sole orchestrator of leg progression (`lib/dailyMission.ts`).
3. **Matrix leg types** are canonical; programs declare **profiles** (subset/mode), not ad-hoc sequences.
4. **`programId` and enrollment** are future implementation concerns — require RFC + code only when shipping Program 2+.
5. **New leg types** require Mission Flow Matrix amendment + new ADR — not program-side forks.

---

## Alternatives rejected

| Alternative | Why |
|-------------|-----|
| Per-program Mission Engine | ADR-001 violation |
| Programs inventing leg order | Matrix violation |
| Program-specific Captain persona | Section 02 violation |

---

## Verification

- [ ] New program PR cites manifest + content only
- [ ] No `dailyMission` fork per program
- [ ] ARCHITECTURE-FREEZE governance followed
