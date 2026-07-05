# Architecture Freeze

**Platform governance after RFC-003.**

**Status:** 🔒 **FROZEN** — July 2026  
**Stress test:** [RFC-003](./architecture/rfc/RFC-003-architecture-stress-test-platform-freeze.md)  
**Technical lock detail:** [architecture/ARCHITECTURE-LOCK.md](./architecture/ARCHITECTURE-LOCK.md)

This document defines **what may change without architecture review** and **what requires an RFC/ADR**.

---

## Freeze status

| Layer | Status | Authority |
|-------|--------|-----------|
| **Mission Engine** | 🔒 Frozen | ADR-001–005, `lib/dailyMission.ts` |
| **Captain Delta authority** | 🔒 Frozen | ADR-009, Section 02 |
| **EIA / CDLI** | 🔒 Frozen | RFC-001, `educational-systems/` |
| **Training Programs (TPA)** | 🔒 Frozen | RFC-002, ADR-013, Section 21 |
| **Mission Flow Matrix** | 🔒 Frozen | Leg types and canonical order |
| **Platform Principles** | 🔒 Frozen | Section 22 (PP-01…PP-15) |
| **Product North Star** | 🔒 Frozen | Section 23 |
| **Implementation** | 🟢 Active | Sprints, features, content |
| **Program content** | 🟢 Active | Manifests and packs |

**Verdict:** No additional architectural work is required before long implementation phase.

---

## Layer definitions

| Term | What it is | What it is not |
|------|------------|----------------|
| **Architecture** | Mission Engine, Captain authority, matrix, ADRs, platform layers | UI polish, copy tweaks |
| **Educational Systems (EIA)** | How Captain teaches — CDLI, principles, loop, graph model | Mission leg order |
| **Training Programs (TPA)** | What each course teaches — manifests, content | Orchestration code |
| **Implementation** | Code, APIs, UI, sync, Azure | Product philosophy |
| **Content** | Vocab, scenarios, cards, audio, prompts text | Control flow |

```
Content → configures → Programs → configures → Platform
                                              ↓
                                         Student experience
```

---

## When a new RFC is required

| Change | RFC? | ADR? |
|--------|------|------|
| New vocabulary pack for ICAO English | **No** | No |
| New Training Program (CRM, H145 oral) | **No** (manifest + content) | No |
| UI redesign of pronunciation screen | **No** | No |
| Bug fix restoring manual behavior | **No** | No |
| `programId` + enrollment in engine | **Yes** (Implementation RFC) | **ADR-014+** |
| New mission leg type (e.g. cockpit drill) | **Yes** (Architecture) | **ADR-014+** |
| Captain marks legs complete | **Yes** (Architecture) | **ADR-014+** — **rejected by default** |
| Change CDLI capabilities (add 6th) | **Yes** (Educational) | Maybe |
| Change Mission Flow Matrix order | **Yes** (Architecture) | **ADR-014+** |
| LMS / simulator integration | **Yes** (Infrastructure) | Maybe |
| Fork `dailyMission.ts` per program | **Yes** (Architecture) | **Rejected** |

---

## Examples (quick reference)

### Adding a new vocabulary pack

- **Layer:** Content  
- **RFC:** None  
- **PR must:** Use existing vocab mission leg; no engine changes  

### Adding CRM Essentials program

- **Layer:** Training Program  
- **RFC:** None (document manifest in `programs/crm-essentials/`)  
- **PR must:** Respect matrix profile; cite PP-04  

### Changing `getNextMissionAction()` algorithm

- **Layer:** Architecture / Mission Engine  
- **RFC:** Architecture RFC required  
- **ADR:** ADR-014+ amendment  

### Captain auto-skips pronunciation when vault empty

- **Layer:** Architecture — **forbidden**  
- **RFC:** Would be rejected unless matrix + ADR explicitly change product rules  

### Re-enabling Captain TTS

- **Layer:** Implementation  
- **RFC:** None (feature flag + Section 02 compliance)  

### i18n UI strings

- **Layer:** Implementation  
- **RFC:** Infrastructure RFC if platform-wide locale framework  

---

## Future RFC categories

| Category | Scope | Approver | ADR required when |
|----------|-------|----------|-------------------|
| **Architecture RFC** | Engine, matrix, Captain authority, new leg types | Chief Architect | Always for authority changes |
| **Educational RFC** | EIA/CDLI, instructional principles | Chief Learning Officer + Architect | Capability model changes |
| **Training Program RFC** | New program **class** affecting platform contract | Product Architect | Rare — prefer Section 21 manifest |
| **AI Capability RFC** | New agent namespaces, prompt governance | Architect + AI lead | Captain write paths |
| **Infrastructure RFC** | LMS, sim, i18n, DB schema for enrollment | Tech Lead | New platform services |
| **Content RFC** | *Not used* | Content lead PR review | Never |

**Implementation RFC** (informal): ships `programId`, enrollment UI, graph read model — references ADR-014 when created; does not reopen ME/CDLI/TPA.

---

## Amendment process

1. **Prove** the freeze cannot hold (stress test failure, production incident, principle violation).  
2. **Document** in RFC — do not code first.  
3. **ADR-014+** for architecture authority changes.  
4. **Update** ARCHITECTURE-LOCK, runtime-map, CURRENT-PRODUCT as needed.  
5. **Never** silently fork deprecated paths (`flightMission.ts`, etc.).

---

## Relationship to ADR-012 (Flight Manual freeze)

ADR-012 freezes **product behavior in the Flight Manual**. This document freezes **platform architecture**.

| Change | ADR-012 (manual) | ARCHITECTURE-FREEZE |
|--------|------------------|---------------------|
| New debrief copy rule | Manual update + approval | No architecture RFC |
| New leg in daily mission | Manual + matrix + ADR | Architecture RFC |
| New CRM scenario pack | Content only | No RFC |

---

## Locked artifact index

| Artifact | Location |
|----------|----------|
| ADR-001–013 | `architecture/adr/` |
| RFC-001 EIA | `architecture/rfc/RFC-001-*.md` |
| RFC-002 TPA | `architecture/rfc/RFC-002-*.md` |
| RFC-003 Freeze | `architecture/rfc/RFC-003-*.md` |
| Platform Principles | `22-platform-principles.md` |
| North Star | `23-product-north-star.md` |
| Programs | `21-training-programs.md` |
| EIA | `educational-systems/` |

---

## Recommendation

**Proceed to long implementation phase.**

Address [IMPLEMENTATION-READINESS.md](./IMPLEMENTATION-READINESS.md) blockers as sprints — not architecture revisions.
