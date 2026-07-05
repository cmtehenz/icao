# RFC-003 — Architecture Stress Test & Platform Freeze

| Field | Value |
|-------|-------|
| **Status** | Accepted — **Platform freeze declared** |
| **Date** | July 2026 |
| **Scope** | Validation and governance — no product evolution |
| **Locks preserved** | ADR-001–013, Mission Engine, EIA/CDLI (RFC-001), TPA (RFC-002) |

---

## Executive summary

The architecture **survives** the stress test for communication-focused aviation training programs (A–H) **without structural redesign**.

**Partial** support is expected for: multi-language UI, military content policy, simulator hooks, and corporate LMS — these require **implementation features** or **content policy**, not a new architectural model.

**Recommendation:** Freeze platform architecture. Begin long implementation phase. Address documented couplings (below) as **implementation work** under existing layers — not new architecture RFCs unless a stress item fails a future re-test.

---

## 1. Architecture stress test

Legend: **YES** = manifest + content on current platform · **PARTIALLY** = architecture OK; implementation gaps · **NO** = would break current model (needs ADR-014+)

| ID | Program | Verdict | Why |
|----|---------|---------|-----|
| **A** | CRM Essentials | **YES** | Vocab + Part 1 discussion + Part 2 scenarios + Recall + Debrief. Matrix profile omits Mock. CDLI Instructional Judgment + scenario graph. No new leg types. |
| **B** | H145 Type Rating | **PARTIALLY** | **Oral communication track: YES** — pronunciation packs, systems vocab, emergency scenarios on existing legs. **Full sim integration: NO** without platform extension (see K). Coupling: evaluate prompts ICAO-biased; content packs sufficient for oral. |
| **C** | AW169 Differences | **YES** | Transition program = vocab diff packs + comparative scenarios + shortened matrix profile. Same as RFC-002 example. |
| **D** | IFR Recurrent Training | **YES** | Readback-heavy Part 2, clearance pronunciation, Recall, Debrief. Mock omitted. Quick Notes LT enabled in manifest. |
| **E** | Company SOP Academy | **PARTIALLY** | **SOP as content: YES** — operator vocab, scenarios, resource categories. **Enterprise LMS gradebook sync: NO** without L (see L). Coupling: no `programId`; content authoring only until enrollment ships. |
| **F** | Offshore Operations | **YES** | Operational scenarios + Passive Flight Training audio + Part 2 comms. Graph nodes for offshore topics. |
| **G** | HAA Training | **PARTIALLY** | **Communication curriculum: YES** (same as F with HAA tags). **Regulatory checkride fidelity: PARTIALLY** — depends on scenario content depth, not architecture. |
| **H** | NVG Operations | **PARTIALLY** | **Phraseology and CRM comms: YES** on existing legs. **NVG-specific media/interaction: PARTIALLY** — may need richer media assets; Passive + visual coaching suffice architecturally. No new leg type required for v1. |
| **I** | Multi-language ICAO Academy | **PARTIALLY** | **Program model: YES** — separate manifests per locale. **Platform i18n: PARTIALLY** — UI strings, Captain copy, evaluate language not fully built. Coupling: English-centric prompts in `prompts/`; architecture allows locale packs, implementation required. |
| **J** | Military Adaptation | **PARTIALLY** | **Platform: YES** for non-classified comms training. **Constraints: content policy** (classification, NATO phraseology) — not architecture. May need separate program manifest and rubric; same layers. |
| **K** | Simulator-connected Training | **NO** (platform extension) | No sim telemetry API, session sync, or hardware bridge today. **Architecture does not block** adding an **optional** `simulator` content capability + external integration layer — but that is **ADR-014+ / Infrastructure RFC**, not program manifest alone. Oral-only type rating remains YES without K. |
| **L** | Corporate LMS Integration | **NO** (platform extension) | No LTI/xAPI/SCORM enrollment or grade passback. Lifecycle stages (Enrollment, Certification) documented; **LMS is infrastructure**, not program content. Requires Infrastructure RFC when prioritized — does not invalidate TPA. |

### Stress test summary

| Verdict | Count | Programs |
|---------|-------|----------|
| **YES** | 5 | A, C, D, F, (+ B oral track) |
| **PARTIALLY** | 6 | B, E, G, H, I, J |
| **NO** (extension, not redesign) | 2 | K, L |

**Architecture model: VALIDATED.** Weaknesses are **implementation and integration**, not wrong layering.

### Documented couplings (implementation debt)

| Coupling | Blocks programs? | Remediation (no architecture redesign) |
|----------|------------------|----------------------------------------|
| Implicit single program (no `programId`) | Blocks multi-program **shipping**, not modeling | Implementation: enrollment + engine reads manifest |
| ICAO-hardcoded exam rotation | Blocks non-ICAO programs using same code path | Program manifest `contentRotation` |
| English-centric prompts | Blocks I partially | Locale prompt packs per program |
| No LMS/sim APIs | Blocks L, K only | Infrastructure layer — orthogonal to ME/CDLI/TPA |
| Deprecated `flightMission.ts` still in repo | Risk of misuse, not architecture | Code cleanup — ADR-007 already deprecated |

---

## 2. Platform principles

**Deliverable:** [22-platform-principles.md](../22-platform-principles.md)

Fifteen immutable principles (PP-01…PP-15). Mandatory for future RFCs and PRs.

---

## 3. Product north star

**Deliverable:** [23-product-north-star.md](../23-product-north-star.md)

Non-technical compass for product decisions.

---

## 4. Architecture freeze

**Deliverable:** [ARCHITECTURE-FREEZE.md](../ARCHITECTURE-FREEZE.md)

Governance model distinguishing Architecture · Educational Systems · Training Programs · Implementation · Content.

Supplements [architecture/ARCHITECTURE-LOCK.md](./ARCHITECTURE-LOCK.md) (technical lock detail).

---

## 5. Future RFC policy

Documented in [ARCHITECTURE-FREEZE.md](../ARCHITECTURE-FREEZE.md) § RFC categories.

| Category | When | Approval |
|----------|------|----------|
| **Architecture RFC** | Mission Engine, Captain authority, matrix, new leg types | Chief Architect + ADR |
| **Educational RFC** | EIA/CDLI capability changes | Chief Learning Officer + Product Architect |
| **Training Program RFC** | New program **category** affecting platform contract | Product Architect (content-only programs: no RFC) |
| **AI Capability RFC** | New agent namespace, Captain write paths | Architect + ADR if authority changes |
| **Infrastructure RFC** | LMS, sim, i18n platform, new DB models | Tech Lead |
| **Content RFC** | None — use program manifest + PR | Content lead review |

---

## 6. Documentation audit

**Full report:** [DOCUMENTATION-AUDIT.md](../DOCUMENTATION-AUDIT.md)

### Summary

| Check | Result |
|-------|--------|
| Mission Engine sole orchestrator | **PASS** — ADR-001, runtime-map, RFC-002 |
| Captain never owns progression | **PASS** — ADR-009, IP-12, PP-02 |
| CDLI educational only | **PASS** — RFC-001, educational-systems |
| Programs = configuration | **PASS** — RFC-002, ADR-013, Section 21 |
| Learning Tools orthogonal | **PASS** — mission-flow-matrix, RFC-001 |
| Duplicated philosophy | **ACCEPTABLE** — intentional pedagogy repetition per DOCUMENTATION-HIERARCHY §6 |
| Terminology conflicts | **MINOR** — see audit (target `lib/missionEngine/` paths in ch. 03) |
| Obsolete references | **MINOR** — SPRINT-0/FINAL-REVIEW pre-Sprint-1-2 state; CURRENT-PRODUCT authoritative |

**No blocking documentation contradictions** against frozen architecture.

---

## 7. Implementation readiness

**Deliverable:** [IMPLEMENTATION-READINESS.md](../IMPLEMENTATION-READINESS.md)

| Dimension | Confidence | Summary |
|-----------|------------|---------|
| Architecture | **9/10** | Frozen; stress test passed |
| Educational (EIA) | **8/10** | Principles documented; partial CDLI in code |
| Documentation | **8/10** | Minor stale refs; hierarchy clear |
| Product (Program 1) | **7/10** | Core legs shipped; polish gaps |
| **Overall readiness** | **8/10** | **Proceed to long implementation phase** |

---

## Recommendation

> **Freeze the platform architecture. Begin long implementation phase.**

No additional architectural RFCs are required before implementation unless:

1. A new **leg type** is proposed (matrix + ADR-014+), or  
2. Captain gains **mission state write** authority (ADR violation), or  
3. A second orchestrator is proposed (ADR-001 violation), or  
4. Simulator/LMS integration scope is committed (Infrastructure RFC).

Program 2+ (CRM, H145, etc.) ship as **content + manifests** once `programId` implementation lands — not architecture work.

---

## Approval

| Role | Decision | Date |
|------|----------|------|
| Chief Product Architect | Platform freeze accepted | July 2026 |
| Stress test | Passed with documented partials | July 2026 |
