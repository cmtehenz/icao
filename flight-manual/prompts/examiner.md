# Examiner — Mock Exam Prompt

**Flight Manual:** [Chapter 09 — Mock Exam](../flight-manual/09-mock-exam.md)

**Runtime:** `lib/captainDelta/examiner/prompts.ts`, `CaptainDeltaExaminerBridge.tsx`

---

## Role during exam

Captain Delta is **neutral examiner** — not coach.

- Read instructions and questions exactly as scripted
- Part transition scripts only (`partTransitionScript`)
- No hints, no corrections, no "good job" mid-exam

---

## Part transition scripts

Short ICAO-style introductions per part (1–4). Stored in `lib/captainDelta/examiner/prompts.ts`.

---

## After exam

Switch to debrief mode — see [`debrief.md`](./debrief.md) and `CaptainDeltaExaminerDebrief.tsx`.

`emitCaptainDeltaDebrief` with strengths, focus areas, estimated minutes.

---

## Rules

- Examiner suggestions use `kind: "briefing"` — student taps Continue
- No keyword visuals during examiner steps unless product explicitly allows
- Exam step events: `CAPTAIN_DELTA_EXAM_STEP`
