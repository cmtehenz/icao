# Documentation Hierarchy

**How truth is organized in ICAO Delta.**

ICAO Delta is a **Digital Flight Academy**. Documentation exists to preserve **product philosophy** and **implementation reality** — never to confuse them.

---

## Hierarchy of truth

```
Product Vision
      ↓
Flight Manual
      ↓
Training Programs (what is taught — Section 21)
      ↓
Platform (Mission Engine · Captain · EIA · Tools)
      ↓
CURRENT-PRODUCT.md
      ↓
Gap Between Vision and Reality
      ↓
IMPLEMENTATION-STATUS.md
      ↓
Technical Contracts
      ↓
docs/
      ↓
Implementation
      ↓
app/ · lib/ · components/  (→ src/ when migrated)
```

---

## What each layer owns

| Layer | Document(s) | Answers |
|-------|-------------|---------|
| **Product Vision** | `00-introduction.md`, `01-product-philosophy.md`, `99-non-negotiable-rules.md` | Why ICAO Delta exists; what we will never compromise |
| **Flight Manual** | Chapters `02`–`13`, `03A`, `21`, `learning-tools/`, `architecture/` (product), `educational-systems/` | **What we build** and **how it should behave** — pedagogy, missions, programs, Captain Delta |
| **Training Programs** | `21-training-programs.md`, `architecture/training-program-architecture.md` | **What each course teaches** — manifests and content on the fixed platform |
| **Platform governance** | `ARCHITECTURE-FREEZE.md`, `22-platform-principles.md`, `23-product-north-star.md` | **What may change** without architecture RFC; immutable platform rules; vision compass |
| **Current Product** | `CURRENT-PRODUCT.md` | **What is shipped today** — routes, APIs, flags, study modes |
| **Gap** | `IMPLEMENTATION-STATUS.md` | Spec vs backend vs frontend vs Azure vs DB — per capability |
| **Technical contracts** | `docs/` (API, database, Azure, deploy) | Schemas, endpoints, infrastructure — not product decisions |
| **Implementation** | `app/`, `lib/`, `components/`, `prompts/` | Running code; must match CURRENT-PRODUCT unless a PR explicitly closes a gap |

Supporting references (not separate truth layers):

- [TERMINOLOGY.md](./TERMINOLOGY.md) — names
- [ASSISTANCE-TAXONOMY.md](./ASSISTANCE-TAXONOMY.md) — assistance codes (PA, PR, VB, P1…)
- [architecture/mission-flow-matrix.md](./architecture/mission-flow-matrix.md) — canonical mission sequence
- [architecture/runtime-map.md](./architecture/runtime-map.md) — **real** code paths today
- [educational-systems/](./educational-systems/) — **how Captain teaches** (EIA / CDLI)
- [21-training-programs.md](./21-training-programs.md) — **what each program teaches** (TPA)
- [DECISION-RECORDS.md](./DECISION-RECORDS.md) — irreversible product decisions
- [ARCHITECTURE-FREEZE.md](./ARCHITECTURE-FREEZE.md) — platform freeze and RFC policy
- [ONBOARDING.md](./ONBOARDING.md) — reading paths by role

---

## The rules

### 1. Flight Manual wins for product behavior

When defining **what the student experiences**, **how Captain Delta teaches**, or **how missions connect**, the Flight Manual is authoritative.

Engineers implement toward the manual. Product gaps are recorded in IMPLEMENTATION-STATUS — not silently “fixed” by changing the manual to match shortcuts.

### 2. CURRENT-PRODUCT wins for what is implemented

When describing **what users can do in production today**, CURRENT-PRODUCT wins.

Do not tell a new developer that Mission Recall, unified Begin Flight, or Captain voice are shipped because Section 08 or 03A describe them. Check CURRENT-PRODUCT first.

### 3. IMPLEMENTATION-STATUS explains the difference

Use it for estimation, sprint planning, and PR scope. A 🔴 row means the Flight Manual describes intent; the codebase does not yet fulfill it.

### 4. Source code implements the current product

Code is not the product vision. Code is the **current snapshot**. When code and Flight Manual disagree:

- **Bug** — code diverged unintentionally → fix code (or fix CURRENT-PRODUCT if docs were wrong).
- **Intentional gap** — vision ahead of implementation → update IMPLEMENTATION-STATUS; do not pretend the feature exists in runtime docs.

### 5. Documentation must never pretend unfinished features exist

Implementation Maps in mission chapters may describe **target architecture**. [runtime-map.md](./architecture/runtime-map.md) describes **current implementation** only.

Never document folders that do not exist as if they were live without labeling them **TARGET**.

### 6. Pedagogy is not simplified for docs convenience

The Flight Manual **intentionally repeats** philosophy in mission chapters and learning tools. That is not duplication of truth — it is **application of methodology**. Contradictions are forbidden; educational repetition is required.

---

## AI & prompts (within the hierarchy)

| Layer | Location |
|-------|----------|
| AI responsibilities (product) | `14-ai-brain.md` + `educational-systems/` (CDLI) |
| Prompt rules | `15-prompt-engineering.md` |
| Aviation facts | `16-icao-knowledge-base.md` |
| Prompt text (implementation) | `prompts/` + `lib/*/prompt.ts` |

Prompts implement AI behavior; the Flight Manual defines what that behavior must achieve.

---

## PR checklist

Before merging a feature PR:

1. Flight Manual chapter updated if **product behavior** changed.
2. CURRENT-PRODUCT updated if **shipped behavior** changed.
3. IMPLEMENTATION-STATUS row moved if a gap closed.
4. `runtime-map.md` updated if **entry points** moved.
5. DECISION-RECORDS entry if an **irreversible** product choice was made.

---

## Related

- [README.md](./README.md) — index
- [17-development-rules.md](./17-development-rules.md) — engineering principles
- [AUDIT-RESOLUTION.md](./AUDIT-RESOLUTION.md) — how we resolved the 2026 architecture audit
