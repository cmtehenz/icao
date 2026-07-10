# RFC-004: Adaptive Training Redesign

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | July 2026 |
| **Deciders** | Product, Tech Lead |
| **Related** | ADR-001, ADR-002, ADR-009, ADR-010, Section 01, 04, 07, 08 |

---

## Context

The daily flight template works as orchestration, but the **study method** no longer matches how students learn:

- No entry diagnostic — day 1 jumps into full exam-day content
- Study plan exists in memory copy only — Mission Engine ignores it
- Pronunciation leg is orphaned from `getNextMissionAction()`
- UI still feels like stacked modules, not an instructor-led academy

Product rules still hold: Captain guides, Mission Engine decides, speaking > reading.

---

## Decision (locked intent)

### A. Hybrid Checkride (entry)

On first authenticated session (or until completed / skipped):

1. Captain Delta runs a **~5 minute speaking checkride**
2. Student **must speak** (Azure + short oral)
3. Skip → assume **Foundation** phase (conservative plan)
4. Result persists as `StudentTrainingProfile`

Checkride measures:

| Probe | Signal |
|-------|--------|
| 6–8 operational words | Pronunciation accuracy / problem sounds |
| 1–2 short readbacks | Rhythm, completeness |
| 1 light Part 1 prompt | Structure / fluency under light pressure |

Output: estimated band (Foundation / Operational / Exam), weak areas, focus sounds, recommended phase.

### B. Training phases

| Phase | Goal | Daily load |
|-------|------|------------|
| **Foundation** | Speak safely, build clarity | Fewer terms, heavy scaffolding, pronunciation first |
| **Operational** | Use language in context | Word Mission + Part 1 scaffolded → solo |
| **Exam** | Pressure and exam shape | Full legs, recall, mock when ready |

Mission Engine **reads phase + profile** when building today's flight. Captain narrates the plan; Engine owns routing (ADR-009).

### C. Adaptive study plan (engine-owned)

`buildAdaptiveDailyFlight(profile)` becomes the source for:

- which legs run today
- term count / difficulty band for Word Mission
- pronunciation warm-up set (bootstrap if vault empty)
- scaffolding level for Part 1

Captain briefing speaks the plan. Adaptive memory no longer “suggestions only.”

### D. UX / UI redesign (same PR stream, phased)

Identity remains Flight Manual §07: digital flight academy, glass-cockpit calm, instructor-led.

Redesign surfaces:

1. **Onboarding / Checkride** — one composition, Captain leads, mic primary
2. **Home** — phase + today's plan + one Ready CTA (no module picker)
3. **Mission legs** — 30-second rule, less chrome, clearer speak-first hierarchy
4. **Design tokens** — refresh in `globals.css` / `theme-refined.css` (calm aviation, not edtech purple)

---

## Non-goals

- Student picking modules from home
- Duolingo-style gamification
- Captain writing mission completion state
- Full visual clone of other language apps

---

## Implementation phases

### Phase 0 — Flight Manual

Update `01_PRODUCT.md`, `04_LEARNING_ENGINE.md`, `07_UI_UX.md`, `CHANGELOG.md` with Checkride + phases + adaptive plan ownership.

### Phase 1 — Checkride + profile

- Route `/checkride` (mission-focus)
- Profile store (`lib/trainingProfile/`)
- Gate on home: incomplete → Checkride CTA
- Skip → Foundation defaults

### Phase 2 — Adaptive Mission Engine ✅

- Wire profile into `dailyMission` / `pickWordDailyTerms`
- Restore pronunciation as first active leg when profile says so
- Phase-based load (Foundation lighter)
- Home CTA surfaces `planHint` from adaptive plan

### Phase 3 — UX shell refresh ✅

- Home: phase badge, plan strip, Ready
- Checkride UI polish
- Token refresh (colors, type, spacing)

### Phase 4 — Progressive scaffolding

- Part 1 / Word Mission assistance levels from profile
- Re-checkride every N days or on readiness plateau

---

## Authority split

```
Checkride / Azure / oral probes  →  StudentTrainingProfile
Mission Engine                   →  today's legs from profile + phase
Captain Delta                    →  speaks plan, coaches, Ready CTAs
```

Captain never marks legs complete. Engine never invents coaching copy.

---

## Open visual choice

**Locked:** flight academy premium — cool slate surfaces, navy primary CTAs, amber accents, DM Sans. Not glass-cockpit-dark-first; not Duolingo purple.
