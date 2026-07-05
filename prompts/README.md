# ICAO Delta — AI Prompts

**AI system prompts only.** Product decisions live in [`flight-manual/`](../flight-manual/README.md).

Each prompt file:

1. References the relevant Flight Manual chapter
2. Defines model behavior and output format
3. Does **not** duplicate product philosophy — link to the manual instead

---

## Prompt index

| File | Module | Flight Manual | Runtime (current) |
|------|--------|---------------|-------------------|
| [captain-delta.md](./captain-delta.md) | Screen coach / PTT | Ch. 02 | `app/api/captain-delta/route.ts` |
| [pronunciation.md](./pronunciation.md) | Pronunciation coach copy | Ch. 04 | `lib/pronunciationCoach.ts` (local) |
| [vocabulary.md](./vocabulary.md) | Vocabulary coach | Ch. 05 | _(planned)_ |
| [part1.md](./part1.md) | Part 1 evaluation coach | Ch. 06 | `app/api/flight-instructor/route.ts` |
| [part2.md](./part2.md) | Part 2 evaluation coach | Ch. 07 | `app/api/flight-instructor/route.ts` |
| [examiner.md](./examiner.md) | Mock exam examiner | Ch. 09 | `lib/captainDelta/examiner/` |
| [debrief.md](./debrief.md) | Post-answer structured debrief | Ch. 10 | `lib/flightInstructor/prompt.ts` |
| [audio-mission.md](./audio-mission.md) | Listen missions | Ch. 11 | _(planned)_ |

---

## Maintenance rules

- When changing a prompt in code, update the matching file here in the same PR
- When changing product behavior, update the Flight Manual **first**, then the prompt
- Prompts return JSON where specified — never free-form essays for coaching

---

## Models (current)

| Endpoint | Model | Temperature |
|----------|-------|-------------|
| `/api/captain-delta` | gpt-4o-mini | 0.4 |
| `/api/flight-instructor` | gpt-4o-mini | 0.5 |
| `/api/evaluate` | gpt-4o-mini | varies |

See [`docs/azure.md`](../docs/azure.md) for speech services.
