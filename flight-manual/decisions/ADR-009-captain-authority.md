# ADR-009: Captain Authority

| Field | Value |
|-------|-------|
| **Status** | **Locked** |
| **Date** | July 2026 |
| **Deciders** | Chief Product Architect, Staff Engineer |
| **Related** | ADR-008, ADR-005, Section 02, Section 99 Rule 1 |

---

## Context

Captain Delta is the face of the Digital Flight Academy. The product fails if Captain becomes a chatbot that mutates app state, or if the Mission Engine speaks directly without Captain’s voice.

Sprint 0 showed `CaptainDeltaProvider` importing `getNextMissionAction` (correct) but academy and flightMission paths letting UI layers act like instructors **and** controllers.

---

## Decision

### Captain Delta responsibilities (allowed)

Captain Delta **may**:

| Verb | Examples |
|------|----------|
| **Interpret** | Explain why a readback missed an element |
| **Coach** | One priority improvement after a recording |
| **Encourage** | Confidence-first debrief copy |
| **Explain** | PEEL structure, operational vocabulary |
| **Ask questions** | Follow-up in P1-6 (future), recall prompts (Sprint 3) |

Captain consumes **read-only** mission context:

- `getDailyMissionSummary()`
- `getNextMissionAction()`
- Learning Memory read APIs
- Evaluation JSON from `/api/flight-instructor`

### Captain Delta prohibitions (forbidden)

Captain Delta **must never**:

| Action | Owner instead |
|--------|---------------|
| Change application mission state | Mission Engine (ADR-008) |
| Advance missions / skip legs | `lib/dailyMission.ts` |
| Award achievements | `lib/academy/achievements.ts` |
| Complete tasks (mark words, cards, simulation) | Per-leg `*DailyMission.ts` |
| Persist vault entries directly | `lib/pronunciationVault.ts` via evaluate pipeline |
| Toggle study mode | `lib/studyTime.ts` via UI control — not Captain autonomously |

### Authority split

```
Mission Engine decides  →  what leg is next, what is complete
Captain Delta reacts    →  to recordings, events, and read-only context
```

Captain **reacts** to `CAPTAIN_DELTA_*` events and API responses. Captain **does not emit** mission completion.

**Examiner mode exception:** During Mock Exam (Section 09), Captain adopts examiner **persona** — still does not mutate mission state; simulado runner owns exam progression.

---

## Rationale

| Flight Manual principle | ADR enforcement |
|----------------------|-----------------|
| Captain is never a chatbot (Rule 1) | Captain has no write keys to mission state |
| Student never chooses next activity (Rule 2) | Only engine advances legs |
| Captain always guides | Captain reads `getNextMissionAction()` for CTAs |
| One correction at a time (Rule 7) | Debrief events, not state bulk updates |

---

## Implementation boundaries

| Component | Captain role |
|-----------|--------------|
| `CaptainDeltaProvider` | Subscribe core/visual/examiner events; display coaching |
| `lib/captainDelta/briefing.ts` | Generate copy from **read** summary |
| `lib/captainDelta/memory/*` | Session patterns, **not** leg completion |
| Trainers | Call `emitCaptainDeltaAfterAnswer` **after** evaluate; leg API marks progress separately |

---

## Future examples

| Scenario | Captain | Mission Engine |
|----------|---------|----------------|
| Student passes pronunciation word | “Good rhythm.” | `markWordComplete()` |
| Student asks “what’s next?” | “Next: vocabulary — 20 terms.” (from `getNextMissionAction`) | Already computed |
| Student fails mock | Examiner debrief tone | Simulado history via `lib/simulado/progress.ts` |
| Recall stage (Sprint 3) | Fast “Correct.” / “Try again.” | Recall engine scores; engine gates mock |

---

## Verification

- [ ] Captain Delta code path audit: no `save*DailyMission` calls
- [ ] Briefing copy uses `dailyMission.ts` not `flightMission.ts`
- [ ] Achievements evaluated outside CaptainDeltaProvider mission writes
