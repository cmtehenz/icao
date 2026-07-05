# Adaptive Operational Briefing

**Captain opens the flight with context — not control.**

Adaptive briefing adjusts **what Captain says**, not **where the student goes**.

Related: [03A-complete-flight-mission.md](../03A-complete-flight-mission.md) · [lib/captainDelta/briefing.ts](../../lib/captainDelta/briefing.ts) · [CDLI Instructor Voice](./captain-delta-learning-intelligence.md)

---

## Philosophy

Every training flight begins with orientation:

- Who is flying today
- Which exam block is active
- What the first leg is
- How long the flight may take
- Calm, professional tone

The student should feel they entered a **flight academy**, not a menu.

---

## What "adaptive" means

| Adaptive (allowed) | Not adaptive (forbidden) |
|--------------------|--------------------------|
| Greeting by time of day | Reordering mission legs |
| Exam countdown | Skipping pronunciation because "weak area" |
| Naming **next leg** from `getNextMissionAction()` | Inventing alternate leg lists |
| Referencing memory ("yesterday's readback") | Marking legs complete |
| Intense vs standard **copy** | Toggling study mode silently |

**CDLI capability:** Instructor Voice.  
**Data source:** Mission Engine (read-only) + Learning Memory (read-only).

---

## Briefing inputs

| Input | Source |
|-------|--------|
| Today's exam label | `dailyExamRotation` |
| Next leg title + hint | `getNextMissionAction()` |
| Study mode | `loadStudyPlanMode()` |
| Estimated minutes | Standard / intense goals |
| Days to exam | Captain exam date |
| Optional memory line | Vault / difficulty insights |

---

## Briefing outputs

| Surface | Status |
|---------|--------|
| Home `CaptainBriefing` | Shipped |
| `buildTodayBriefing()` | Shipped |
| TTS auto-play | Not shipped (voice off) |
| Unified "Begin Flight" cinematic | Partial — CTA shipped |

---

## Product rules

1. Briefing is **short** — student flies within seconds.
2. Briefing ends with **clear next action** (Begin / Continue Flight).
3. Briefing never shows model answers.
4. Briefing uses **official exam rotation** — not random topics.

---

## Future programs

CRM or HAA briefings change **terminology and scenario framing** — same adaptation rules. Program ID comes from Mission Engine (future), not from Captain guessing.

---

## Related

- [instructional-principles.md](./instructional-principles.md) — IP-12
- [ADR-009](../architecture/adr/ADR-009-captain-authority.md)
