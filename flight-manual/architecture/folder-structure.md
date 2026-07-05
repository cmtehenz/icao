# Folder Structure

**Repository layout** and where to put new work.

---

## Product documentation

```
flight-manual/
├── README.md                    # Index — start here
├── DOCUMENTATION-HIERARCHY.md   # Vision vs shipped vs technical
├── ONBOARDING.md                # 4h / 1d / 1w paths
├── TERMINOLOGY.md               # Glossary
├── ASSISTANCE-TAXONOMY.md       # PA / PR / VB / P1 codes
├── DECISION-RECORDS.md          # Irreversible product decisions
├── AUDIT-RESOLUTION.md          # Audit response (2026)
├── CURRENT-PRODUCT.md           # Shipped behavior
├── IMPLEMENTATION-STATUS.md     # Spec vs code tables
├── FLIGHT-MANUAL-AUDIT.md       # Senior architect audit (historical)
├── 00–13, 99                    # Core chapters
├── 14–18                        # AI & engineering reference
├── 03A-complete-flight-mission.md
├── architecture/                # How the system works
│   ├── mission-flow-matrix.md   # Canonical leg order
│   └── runtime-map.md           # Real code paths
└── learning-tools/              # Cross-cutting specs
```

---

## AI prompts (not product decisions)

```
prompts/
├── README.md
├── captain-delta.md
├── debrief.md
└── …
```

Must reference Flight Manual chapters.

---

## Technical documentation

```
docs/
├── architecture.md    # App stack (code-oriented) — complements flight-manual/architecture/
├── api.md
├── database.md        # Prisma — not Learning Memory
├── azure.md
└── deployment.md
```

**Product system design** lives in `flight-manual/architecture/` (mission-flow-matrix, runtime-map, product-map).  
**Technical stack** lives in `docs/architecture.md`. Do not merge the two trees.

---

## Assets (migration target)

```
assets/
├── audio/
├── images/
├── icons/
└── voices/
```

Production files still primarily in `public/` and `provas/`.

---

## Application code (current)

```
app/           # Next.js routes + API
components/    # React UI
lib/           # Business logic
hooks/         # React hooks
data/          # Static exam datasets
prisma/        # Schema
```

Target: `src/` — see [src/README.md](../../src/README.md).

---

## Rules

| Content type | Location |
|--------------|----------|
| Product UX decision | `flight-manual/` |
| Prompt text | `prompts/` |
| Schema, API, deploy | `docs/` |
| Implementation | `app/`, `lib/`, `components/` |

Never store product philosophy only in `docs/`.

---

## Cursor rules

`.cursor/rules/product.mdc` — agents must read Flight Manual first.

---

## Related

- [product-architecture.md](./product-architecture.md)
