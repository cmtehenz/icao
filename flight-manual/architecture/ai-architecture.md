# AI Architecture

**How AI is structured** in specification vs production.

---

## Specification ([14-ai-brain.md](../14-ai-brain.md))

Captain Delta orchestrates specialized agents:

```
Captain Delta
├── Mission Planner
├── Pronunciation Coach
├── Vocabulary Coach
├── Flight Instructor
├── ICAO Examiner
├── Part 2 ATC Engine
├── Part 3 Situation Analyzer
├── Part 4 Discussion Coach
├── Debrief Engine
├── Replay Analyzer
├── Memory Engine
├── Recommendation Engine
└── Analytics Engine
```

Student sees **Captain Delta only**.

---

## Production (today)

Logical agents collapsed into **three API routes**:

| Route | Agent role | Prompt source |
|-------|------------|---------------|
| `/api/flight-instructor` | Flight Instructor / Debrief | `prompts/debrief.md` → `lib/flightInstructor/prompt.ts` |
| `/api/captain-delta` | Screen coach | `prompts/captain-delta.md` |
| `/api/evaluate` | Scoring coach | `prompts/part1.md`, `part2.md` |

Local deterministic copy:

- `lib/pronunciationCoach.ts` (pronunciation feedback)
- Captain briefing/debrief builders in `lib/captainDelta/`

---

## Orchestration flow

```
Student action (record / PTT / exam step)
        ↓
   Azure STT + pronunciation (client)
        ↓
   /api/evaluate (scores)
        ↓
   /api/flight-instructor (structured debrief JSON)
        ↓
   Events: CAPTAIN_DELTA_AFTER_ANSWER / DEBRIEF / SUGGESTION
        ↓
   CaptainDeltaProvider (UI + optional TTS)
        ↓
   recordInstructorSession → Learning Memory (local + server)
```

---

## Prompt governance

- Product behavior: Flight Manual chapters.
- Prompt text: [`prompts/`](../../prompts/) — version with code.
- Rules: [15-prompt-engineering.md](../15-prompt-engineering.md).

---

## ICAO Knowledge Base

Aviation facts separate from product docs: [16-icao-knowledge-base.md](../16-icao-knowledge-base.md).

Agents consult knowledge base; manual defines **when** they speak.

---

## Vision path

Split monolithic prompts into agent-specific services behind Captain Delta orchestrator — without changing student-facing identity.

CDLI ([educational-systems/](../educational-systems/)) provides the pedagogical unity; agents remain implementation backends.

Track in [18-product-roadmap.md](../18-product-roadmap.md) **Era 7**.

---

## Related

- [runtime-map.md](./runtime-map.md) — current API and lib paths
- [data-flow.md](./data-flow.md)
- [IMPLEMENTATION-STATUS.md](../IMPLEMENTATION-STATUS.md)
