# ICAO Delta — AI Prompts

**AI system prompts only.** Product decisions live in the [Flight Manual](../README.md).

Each prompt file:

1. References the relevant Flight Manual chapter
2. Defines model behavior and output format
3. Does **not** duplicate product philosophy — link to the manual instead

---

## Prompt index

| File | Module | Flight Manual | Runtime (current) |
|------|--------|---------------|-------------------|
| [captain-delta.md](./captain-delta.md) | Screen coach / PTT | [03_CAPTAIN_DELTA](../03_CAPTAIN_DELTA.md) | `app/api/captain-delta/route.ts` |
| [pronunciation.md](./pronunciation.md) | Pronunciation coach copy | [05_RECORDING](../05_RECORDING.md) | `lib/pronunciationCoach.ts` (local) |
| [vocabulary.md](./vocabulary.md) | Vocabulary coach | [01_PRODUCT](../01_PRODUCT.md) | _(planned)_ |
| [part1.md](./part1.md) | Part 1 evaluation coach | [01_PRODUCT](../01_PRODUCT.md) | `app/api/flight-instructor/route.ts` |
| [part2.md](./part2.md) | Part 2 evaluation coach | [01_PRODUCT](../01_PRODUCT.md) | `app/api/flight-instructor/route.ts` |
| [examiner.md](./examiner.md) | Mock exam examiner | [03_CAPTAIN_DELTA](../03_CAPTAIN_DELTA.md) | `lib/captainDelta/examiner/` |
| [debrief.md](./debrief.md) | Post-answer structured debrief | [01_PRODUCT](../01_PRODUCT.md) | `lib/flightInstructor/prompt.ts` |
| [audio-mission.md](./audio-mission.md) | Listen missions | [01_PRODUCT](../01_PRODUCT.md) | _(planned)_ |

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

See [02_ARCHITECTURE.md](../02_ARCHITECTURE.md) for speech services.
