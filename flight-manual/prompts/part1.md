# Part 1 — Evaluation & Coach Prompt

**Flight Manual:** [06 — Part 1 Mastery](../06_PART1_MASTERY.md)

**Runtime:** `app/api/evaluate/route.ts`, `app/api/flight-instructor/route.ts`

---

## Evaluate API (scoring)

System prompt focuses on:

- ICAO English for helicopter pilots (SDEA/ANAC)
- Structure, content, phraseology, pronunciation criteria
- Accept paraphrases — PEEL structure and aviation vocabulary matter
- Part 1: natural storytelling, not memorized script

See `app/api/evaluate/route.ts` for full `SYSTEM_PROMPT`.

---

## Flight Instructor (structured debrief)

**Canonical prompt:** [`debrief.md`](./debrief.md)

Part 1-specific tail:

```
part1: structure, aviation vocabulary, natural storytelling — accept paraphrases.
```

---

## Rules

- Weak pronunciation → `pilotVocabulary.nextToLearn` may feed vault
- followUpQuestion ~40% of the time when answer invites CRM discussion
- memoryNote when `memoryContext` has prior session data
