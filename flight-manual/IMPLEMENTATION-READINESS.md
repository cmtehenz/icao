# Implementation Readiness

**RFC-003 deliverable — readiness to enter long implementation phase.**

**Date:** July 2026  
**Architecture status:** 🔒 Frozen ([ARCHITECTURE-FREEZE.md](./ARCHITECTURE-FREEZE.md))

---

## Executive verdict

| Question | Answer |
|----------|--------|
| Is architecture complete? | **Yes** — stress test passed (RFC-003) |
| Is more architectural work required? | **No** — unless shipping K (sim) or L (LMS) at platform level |
| Should implementation proceed? | **Yes** |

**Overall confidence: 8/10** — proceed with Program 1 depth + platform enablers for Program 2.

---

## Maturity scores

| Dimension | Score | Reasoning |
|-----------|-------|-----------|
| **Architecture** | 9/10 | ADR-001–013, RFC-001–003, matrix, engine lock, stress test 10/12 YES/PARTIAL. −1: `programId` not in code yet (documented path). |
| **Educational (EIA)** | 8/10 | CDLI, principles, loop, graph model documented. −2: partial implementation (no graph read model, P1-6 conversation). |
| **Documentation** | 8/10 | Hierarchy, freeze, north star, audit clean. −2: historical sprint docs, some TARGET paths in ch. 03. |
| **Product (Program 1)** | 7/10 | Core mission loop shipped (Sprint 1–2). −3: voice off, timeline, vocab L1–4 parity, i18n. |
| **Governance** | 9/10 | Freeze, RFC policy, PP-01–15, North Star. −1: ADR-014+ process untested in practice. |

**Weighted overall: 8/10**

---

## Risk level

| Risk | Level | Mitigation |
|------|-------|------------|
| Architecture drift (dual orchestrators) | **Low** | PP-12, deprecated paths marked, HomePage tests |
| Program 2 blocked on code coupling | **Medium** | Implement `programId` + manifest read as first platform enabler |
| Captain scope creep | **Medium** | ADR-009 audits on Captain PRs |
| Documentation / code divergence | **Medium** | CURRENT-PRODUCT + IMPLEMENTATION-STATUS per sprint |
| Simulator / LMS expectation creep | **Low** (if deferred) | RFC-003 marks K/L as infrastructure — not v1 |
| i18n (Program I) | **Medium** | Locale packs — implementation, not redesign |

**Aggregate risk: MEDIUM-LOW** — acceptable for implementation phase.

---

## Technical debt (implementation, not architecture)

| Item | Impact | Sprint priority |
|------|--------|-----------------|
| Implicit single program (no `programId`) | Blocks multi-program shipping | P1 platform |
| ICAO-hardcoded rotation in engine | Blocks non-ICAO programs | P1 platform |
| `flightMission.ts` still in repo | Misuse risk | Cleanup |
| English-only prompts | Blocks Program I | P2 i18n |
| Recall/debrief local-only sync | Multi-device gap | P2 sync |
| Captain voice disabled | Product vision gap | P2 voice |
| Vocabulary L1–L4 parity | Spec gap | P2 content |

**None require architecture redesign.**

---

## Remaining blockers before Program 2

| Blocker | Type | Owner |
|---------|------|-------|
| `programId` on user enrollment | Implementation | Platform sprint |
| Engine reads program manifest | Implementation | Platform sprint |
| Program content packs (CRM, etc.) | Content | Curriculum |
| Enrollment UI | Implementation | Product |

**Not blockers:** New ADR, new Mission Engine, new Captain, new CDLI.

---

## Implementation phase recommendation

### Phase A — Program 1 excellence (now)

- Captain voice re-enable (rules-based)
- Mission Timeline, Confidence Gates
- Vocabulary mission parity
- Replay debrief clips
- Pronunciation/recall Azure speech
- Sync recall/debrief to server

### Phase B — Platform enablers (parallel when ready)

- `programId` + enrollment
- Manifest-driven matrix profile
- Graph read model (derived index)
- Locale prompt packs

### Phase C — Program 2 content (after Phase B)

- CRM Essentials manifest + packs
- No architecture RFC

### Deferred (Infrastructure RFC when committed)

- Simulator integration (K)
- Corporate LMS (L)

---

## Confidence statement

The team can say:

> **We understand the product** (North Star, Section 01, Program 1).  
> **We understand the architecture** (frozen layers, stress test).  
> **We understand the teaching philosophy** (EIA, instructional principles).  
> **We know how to build** (runtime-map, CURRENT-PRODUCT, sprints).  
> **No additional architectural work is necessary** before implementation.

---

## Related

- [RFC-003](./architecture/rfc/RFC-003-architecture-stress-test-platform-freeze.md)
- [IMPLEMENTATION-STATUS.md](./IMPLEMENTATION-STATUS.md)
- [CURRENT-PRODUCT.md](./CURRENT-PRODUCT.md)
- [IMPLEMENTATION-ROADMAP.md](./IMPLEMENTATION-ROADMAP.md)
