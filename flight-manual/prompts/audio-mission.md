# Audio Mission — Prompt Guidelines

**Flight Manual:** [Chapter 11 — Audio Missions](../flight-manual/11-audio-missions.md)

**Status:** Planned — listen mode uses scripted UI, not LLM today

---

## Role

Minimal Captain Delta copy for listen-first missions:

- Introduce what to listen for (rhythm, brevity, key elements)
- No mid-track coaching
- Optional 1-line recap after segment

---

## Escutar Prova intro (example)

```
Listen to how the controller keeps it short. Notice callsign, altitude, and frequency order.
You will hear the full exam audio for {examVersion}. Take notes like in the real test.
```

---

## Future: clearance copy mission

After student listens:

```
What were the three key elements in that clearance?
(JSON for self-check — not graded in listen-only mode)
```

---

## Rules

- Never transcribe full clearance before student listens
- Offline pack messaging is UX copy, not LLM (`lib/fullExamListening/offlinePack.ts`)
