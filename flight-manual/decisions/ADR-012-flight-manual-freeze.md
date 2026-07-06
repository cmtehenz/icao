# ADR-012: Flight Manual Freeze

| Field | Value |
|-------|-------|
| **Status** | **Locked** |
| **Date** | July 2026 |
| **Deciders** | Chief Product Architect |
| **Related** | [DOCUMENTATION-HIERARCHY.md](../../DOCUMENTATION-HIERARCHY.md), ADR-008 |

---

## Context

ICAO Delta documentation grew to 50+ files. The Flight Manual defines product philosophy for a Digital Flight Academy. Implementation must not silently redefine product behavior.

Architecture phase ends; implementation phase begins.

---

## Decision

### Flight Manual is architecture-frozen

The Flight Manual (`flight-manual/` chapters, learning-tools, mission-flow-matrix) defines **normative product behavior**.

Implementation adapts to the manual. **The manual does not adapt to shortcuts in code.**

### Major product change protocol

Any change that alters **student-visible behavior** defined in the Flight Manual requires **all** of:

| Step | Artifact |
|------|----------|
| 1 | **ADR** — why architecture or behavior changes (`architecture/adr/ADR-NNN`) |
| 2 | **Product approval** — Chief Product Architect sign-off |
| 3 | **Flight Manual update** — chapter(s) in same PR as implementation |
| 4 | **Implementation** — code + prompts |
| 5 | **IMPLEMENTATION-STATUS.md** — row status updated |
| 6 | **CURRENT-PRODUCT.md** — if shipped behavior changes |

Missing any step → PR blocked.

### What is NOT a major change (no Flight Manual edit)

| Change type | Update only |
|-------------|-------------|
| Bug fix restoring manual behavior | Code + IMPLEMENTATION-STATUS if row was wrong |
| Refactor, same behavior | `runtime-map.md` if paths move |
| Performance, same UX | Technical docs |
| Test additions | — |

### Silent redefinition is forbidden

| Forbidden | Example |
|-----------|---------|
| Ship Recall without Section 08 | Feature exists; manual says otherwise |
| Change leg order without matrix update | Code disagrees with mission-flow-matrix |
| Mark IMPLEMENTATION-STATUS ✅ without CURRENT-PRODUCT | Gap hidden |
| Change pedagogy in code only | Vocab becomes flashcards-only |

### Implementation phase entry

**July 2026:** Project transitions from Architecture Phase to Software Implementation Phase.

Frozen artifacts:

- Flight Manual philosophy chapters  
- Mission Flow Matrix leg order  
- ADR-001 through ADR-012  
- Assistance Taxonomy codes  

Living artifacts (updated each sprint):

- CURRENT-PRODUCT.md  
- IMPLEMENTATION-STATUS.md  
- runtime-map.md  

---

## Alternatives rejected

| Alternative | Why |
|-------------|-----|
| “Manual wins” without CURRENT-PRODUCT | Caused governance paradox — resolved in DOCUMENTATION-HIERARCHY |
| Implement first, document later | Produced TD-01/TD-02 |
| Freeze code instead of manual | Would cement wrong home UX |

---

## Verification

- [ ] PR checklist includes manual + status docs
- [ ] No 🔴 → ✅ without CURRENT-PRODUCT evidence
