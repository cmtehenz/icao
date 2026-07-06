# Part 2 — Evaluation & Coach Prompt

**Flight Manual:** [Chapter 07 — Part 2](../flight-manual/07-part2.md)

**Runtime:** `app/api/evaluate/route.ts`, `app/api/flight-instructor/route.ts`

---

## Evaluate API — type-specific rules

| evaluateType | Scoring focus |
|--------------|---------------|
| `part2-readback` | Clearance **elements** — digits = spoken numbers; callsign start or end OK |
| `part2-interaction` | Facility, callsign, problem, intention, request |
| `part2-reported` | Reported speech — controller message content |
| `part2-interaction` (follow-up) | AFFIRM/NEGATIVE appropriateness |

See `app/api/evaluate/route.ts` and `lib/evaluate/readbackScore.ts`.

---

## Flight Instructor tail

```
part2-readback: clearance elements and phraseology.
part2-interaction: facility, callsign, problem, intention, request.
part2-reported: reported speech and controller message content.
```

Full structured debrief: [`debrief.md`](./debrief.md)

---

## Rules

- Do not penalize readback for missing non-essential words
- Proceed + VORTAC counts even without FLL in transcript normalization
- One priority improvement — e.g. "State intention before request"
