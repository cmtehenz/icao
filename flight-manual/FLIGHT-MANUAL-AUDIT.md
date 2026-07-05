# Flight Manual Audit Report

**Date:** July 2026  
**Role:** Lead Product Architect — documentation architecture pass  
**Scope:** Internal consistency, navigation, developer onboarding. **No product philosophy changes. No concept removal.**

---

## Executive summary

The Flight Manual grew from a foundation doc (~15 files) to a **35+ file specification** with extensive learning-tools. This audit:

- Rewrote navigation (`README.md`, indexes, architecture folder)
- Separated **shipped product**, **implementation truth**, and **roadmap**
- Standardized terminology (Mission Recall, Learning Memory, Situation Board)
- Fixed broken references and one duplicated learning-tool file
- Preserved all concepts and methodology

---

## Files created

| File | Purpose |
|------|---------|
| `flight-manual/TERMINOLOGY.md` | Authoritative glossary |
| `flight-manual/CURRENT-PRODUCT.md` | Shipped behavior only |
| `flight-manual/IMPLEMENTATION-STATUS.md` | Spec vs code tables |
| `flight-manual/learning-tools/README.md` | Learning tools index |
| `flight-manual/architecture/README.md` | Architecture index |
| `flight-manual/architecture/product-architecture.md` | Product layers |
| `flight-manual/architecture/learning-architecture.md` | Pedagogy pipeline |
| `flight-manual/architecture/ai-architecture.md` | AI spec vs production |
| `flight-manual/architecture/data-flow.md` | Runtime data movement |
| `flight-manual/architecture/folder-structure.md` | Repo layout |
| `flight-manual/architecture/product-map.md` | Complete learning flow |
| `flight-manual/FLIGHT-MANUAL-AUDIT.md` | This report |
| `flight-manual/13-database.md` | Redirect stub → 13-learning-memory |

---

## Files modified

| File | Change |
|------|--------|
| `flight-manual/README.md` | Complete rewrite — index, 5-min orientation, all sections |
| `flight-manual/18-product-roadmap.md` | Rewritten — Released / In Development / Next / Vision; removed false ✅ |
| `flight-manual/13-learning-memory.md` | Renamed from `13-database.md` |
| `flight-manual/11-audio-missions.md` | Legacy filename note |
| `flight-manual/01-product-philosophy.md` | Rapid Review → Mission Recall |
| `flight-manual/03-mission-engine.md` | Rapid Review → Mission Recall |
| `flight-manual/03A-complete-flight-mission.md` | Rapid Review → Mission Recall |
| `flight-manual/learning-tools/mission-timeline.md` | Rapid Review → Mission Recall |
| `flight-manual/learning-tools/flight-logbook.md` | Rapid Review → Mission Recall |
| `flight-manual/learning-tools/quick-notes.md` | Operational Situation Analysis → Situation Board |
| `flight-manual/learning-tools/captain-radio.md` | **Replaced duplicate** Progressive Assistance content with Captain Radio spec |
| `flight-manual/learning-tools/situation-board.md` | Title → Situation Board; terminology note |
| `flight-manual/learning-tools/confidence-gates.md` | Added Category: Learning Tool |
| `flight-manual/learning-tools/conversation-confidence.md` | Added Category: Learning Tool |
| `flight-manual/learning-tools/passive-flight-training.md` | Quick Review → Short Audio Session (scheduling, not Mission Recall) |
| `docs/database.md` | Link → 13-learning-memory.md |

---

## Broken references fixed

| Was | Now |
|-----|-----|
| `08-rapid-review.md` (missing) | `08-mission-recall.md` |
| `14-roadmap.md` (missing) | `18-product-roadmap.md` |
| `13-database.md` as Learning Memory chapter | `13-learning-memory.md` + redirect stub |
| Operational Situation Analysis | Situation Board |
| Visual Scenario Discussion | Visual Coaching |
| captain-radio.md = copy of progressive-assistance | Dedicated Captain Radio document |
| docs/database.md → wrong FM chapter | → 13-learning-memory.md |

---

## Terminology standardized

| Preferred | Deprecated / removed |
|-----------|----------------------|
| Mission Recall | Rapid Review |
| Learning Memory | Database (in product writing) |
| Situation Board | Operations Room, Operational Situation Analysis |
| Instructor Whiteboard | _(component of Situation Board, not separate tool)_ |
| Flight Debrief | Mission Debrief (in replay-debrief related chapters) |
| Short Audio Session | Quick Review (passive scheduling only) |

Full glossary: [TERMINOLOGY.md](./TERMINOLOGY.md)

---

## Duplicate concepts addressed

| Issue | Resolution |
|-------|------------|
| `captain-radio.md` duplicated Progressive Assistance | Reauthored as Captain Radio; passive-flight-training retains deep passive spec |
| Roadmap ✅ implied shipped features | Moved truth to IMPLEMENTATION-STATUS; roadmap uses Released/Next/Vision |
| 03 vs 03A overlap | Both kept; README explains 03 = engine, 03A = UX blueprint |
| 11 filename vs title | `11-audio-missions.md` kept; canonical name Passive Flight Training documented |

**Not merged (intentional):** `03-mission-engine.md` and `03A-complete-flight-mission.md` — complementary depth.

---

## Learning tools audit

All 13 tools verified for standard sections:

| Tool | Category | Golden Rule | Success Criteria | Impl. Map | Notes |
|------|----------|-------------|------------------|-----------|-------|
| progressive-assistance | ✅ | ✅ | ✅ | ✅ | v2.0 |
| confidence-gates | ✅ | ✅ | ✅ | ✅ | Category added |
| conversation-confidence | ✅ | ✅ | ✅ | ✅ | Category added |
| mission-readiness | ✅ | ✅ | ✅ | ✅ | |
| mission-timeline | ✅ | ✅ | ✅ | ✅ | Terminology fixed |
| situation-board | ✅ | ✅ | ✅ | ✅ | Title fixed |
| quick-notes | ✅ | ✅ | ✅ | ✅ | Refs fixed |
| replay-debrief | ✅ | ✅ | ✅ | ✅ | |
| visual-coaching | ✅ | ✅ | ✅ | ✅ | |
| flight-logbook | ✅ | ✅ | ✅ | ✅ | |
| captain-radio | ✅ | ✅ | ✅ | ✅ | **Rewritten** |
| passive-flight-training | ✅ | ✅ | ✅ | ✅ | |
| adaptive-conversation-engine | ✅ | ✅ | ✅ | ✅ | |

---

## Remaining inconsistencies (low priority)

1. **Section numbering in body text** — some chapters use "Section 04" while filenames are `04-pronunciation.md`; acceptable if TERMINOLOGY is canonical.
2. **Part 1 spec v5 vs app PEEL** — manual describes conversation-first; app is PEEL-heavy. Documented in IMPLEMENTATION-STATUS, not a doc bug.
3. **05-vocabulary.md** table row "Vocabulary Database" — refers to data file path, not Learning Memory; optional rename to "Vocabulary dataset".
4. **11 vs learning-tools/passive-flight-training.md** — overlapping content; 11 is chapter, LT is deep spec. Cross-link could be added in a future pass.
5. **progressive-assistance.md Related Chapters** — uses mission names without "Section NN" prefix; consistent enough within learning-tools.
6. **Root `README.md`** — project architecture section predates this audit; could add links to TERMINOLOGY + IMPLEMENTATION-STATUS.

---

## Architecture suggestions

1. **Maintain IMPLEMENTATION-STATUS.md** in every release PR that ships product behavior.
2. **Update CURRENT-PRODUCT.md** when disabling/enabling Captain voice or mission order changes.
3. **Chapter PR rule** — Flight Manual chapter + TERMINOLOGY if new terms + IMPLEMENTATION-STATUS row.
4. **Consider `03A` merge into `03` appendix** in a future pass (not done — preserves existing docs).
5. **Prompt sync CI** — optional check that `prompts/debrief.md` matches `lib/flightInstructor/prompt.ts`.
6. **`src/` migration** — update `architecture/folder-structure.md` when code moves.

---

## Future documentation improvements

- [ ] Add mermaid diagram to `product-map.md` (optional visual)
- [ ] Cross-link Section 11 ↔ `learning-tools/passive-flight-training.md` at top of both
- [ ] Part 3 / Part 4 dedicated mission chapters (currently in mock-exam + simulado data)
- [ ] `learning-tools/confidence-gates.md` ↔ Section 06/07 explicit level mapping table
- [ ] Automated link checker for flight-manual markdown
- [ ] Portuguese UX copy guide (UI chrome vs training English) in design system
- [ ] Sync `.cursor/rules/product.mdc` with TERMINOLOGY.md links

---

## Philosophy preservation statement

This audit **did not**:

- Remove Captain Delta identity or Progressive Assistance
- Simplify the five-level assistance methodology
- Replace aviation terminology with generic language-learning terms
- Delete any chapter or learning-tool specification
- Mark vision features as completed

ICAO Delta remains documented as a **Digital Flight Academy**.

---

## Quick links for new developers

1. [README.md](./README.md) — 5 minutes  
2. [00-introduction.md](./00-introduction.md) — promise  
3. [CURRENT-PRODUCT.md](./CURRENT-PRODUCT.md) — what runs today  
4. [architecture/product-map.md](./architecture/product-map.md) — how it fits together  
5. [99-non-negotiable-rules.md](./99-non-negotiable-rules.md) — hard rules  
