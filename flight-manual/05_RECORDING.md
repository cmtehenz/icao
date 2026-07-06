# 05 — Recording

## Principle

**One owner. One state machine. One mic mutex.**

Captain calls methods. Mission card observes. Azure is an implementation detail hidden from the student.

---

## Ownership boundaries

```
Captain        → calls start/stop/replay/playSlow — observes phase
Mission card   → observes controller state — no duplicate Record button
Controller     → owns state machine + side effects (vault, study, mission progress)
Azure hook     → I/O only (mic, SDK, assessment parse)
```

Captain never imports Azure. Controller never delivers coaching copy.

---

## State machine

| Phase | Student sees | Can start | Can stop |
|-------|--------------|-----------|----------|
| idle | Record | ✓ | — |
| starting | Starting microphone… | — | — |
| recording | Recording | — | ✓ |
| assessing | Assessing… | — | — |
| success | Record next / Continue | ✓ | — |
| error | Try again | ✓ | — |

Mic UI is **derived** from controller phase — never duplicated in Captain or mission card.

---

## referenceText contract

Recording must not start with empty reference text.

1. Build text from word + practice level (`practiceTextForLevel`)
2. Assert non-empty before Azure start
3. Never run pronunciation assessment with blank reference at L4

---

## Azure pipeline

```
Record click
  → Fetch speech config token
  → Acquire mic mutex
  → getUserMedia + Speech SDK
  → Pronunciation assessment with reference text
  → Stop → merge segments → parse result
  → Internal scores (never shown raw to student)
```

**Global mic mutex:** only one recognizer active application-wide. Acquire before start; release on stop/error.

Assessment types map to context: single word, readback phrase, long-form Part 1 answer.

---

## Human feedback layer

```
Assessment + target word + level + reference text
  → buildHumanCaptainFeedback
  → { message, speechText, focus, technicalDetails, youGlishQuery }
```

**Never** pass raw Azure metrics to `speechText` or primary coaching copy. Scores may appear in collapsed "Technical details" only.

---

## Side effects (controller-owned)

After successful assessment:

- Update vault practice stats and graduation level
- Record study activity points
- Mark daily mission word/term complete when threshold met
- Emit Captain suggestion with human feedback

Captain receives the suggestion — Captain does not perform these writes.

---

## Secondary actions

| Action | Controller method |
|--------|-------------------|
| Replay | `replay()` |
| Slow audio | `playSlow()` |
| Real examples | `openYouGlish()` |

---

## Failure handling

| Failure | Student message |
|---------|-----------------|
| Mic permission denied | Permission guidance |
| Azure not configured | Configuration message |
| Token failure | Retry guidance |
| Empty reference | Cannot start — missing text |
| Assessment null | Try again with specific hint |

Messages must be plain language — never API error codes.

---

## Unified recording interface (design target)

All mission legs should register the same controller contract:

```
phase, start(), stop(), replay?(), playSlow?(), canStart(), canStop(), getBlockReason()
```

Captain triggers primary action through registered handles per leg. One architecture — one mic — one truth.
