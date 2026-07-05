# Event Governance

**When events require ADRs vs documentation only.**

Avoid bureaucracy. Two tiers only.

---

## Breaking events → require ADR

A **breaking** event change is any of:

| Type | Example |
|------|---------|
| New **Core** coaching event | `CAPTAIN_DELTA_MISSION_RECALL` |
| New **Examiner** event fired outside simulado | Examiner hint during Part 1 |
| Renamed event string | Changing `icao-captain-delta-debrief` |
| Payload shape change | Removing `priority` from debrief payload |
| Mission event that **skips** engine | `SKIP_TO_MOCK_EVENT` |
| Captain event that **writes** mission state | Forbidden by ADR-009 — ADR required if proposed |

**Process:** ADR-013+ → update [event-catalog.md](./event-catalog.md) → implement emitter in owner file only.

---

## Minor events → documentation only

A **minor** event change is any of:

| Type | Example |
|------|---------|
| New **Mission** leg refresh event | `MISSION_RECALL_DAILY_MISSION_EVENT` (Sprint 3) |
| New **Telemetry** activity type | `STUDY_ACTIVITY_*` for new activity enum |
| New **Visual** plan variant | Same `VISUAL_PLAN` payload, new `context` value |
| Additional subscriber to existing event | Timeline listens to `VOCAB_DAILY_MISSION_EVENT` |
| **Learning Memory** notification | New memory store refresh |

**Process:** Add row to [event-catalog.md](./event-catalog.md) in same PR. No ADR.

---

## Namespace placement rules

| If the event… | Namespace |
|---------------|-----------|
| Changes Captain UI coaching card | Core |
| Changes keywords/syllables on screen | Visual |
| Changes examiner persona/step | Examiner |
| Records study points/time | Telemetry |
| Signals leg localStorage changed | Mission |
| Signals memory/personalization updated | Learning Memory (catalog section) |

When unsure → Mission vs Telemetry: **if it mutates `*DailyMission` keys, it's Mission.**

---

## Forbidden patterns

- String literals `dispatchEvent(new CustomEvent("icao-..."))` outside owner files  
- Captain subscribing to Mission events for **mutation**  
- Mission events that carry **instructions** instead of **notifications**

---

## Related

- ADR-006 (ownership)  
- ADR-008 (mission writes)  
- ADR-009 (Captain read-only)
