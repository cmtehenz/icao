# 07 — UI / UX

## Identity

ICAO Delta is a **digital flight academy** — not a language app.

Every screen should feel like professional aviation training: calm, focused, instructor-led.

Reference feeling: senior helicopter instructor + modern glass cockpit + premium training center.

Never feel like: Duolingo, generic AI chatbot, PDF reader, flashcard app.

---

## The 30-second rule

Within **30 seconds** of opening a mission leg, the student must be:

- listening, or
- speaking, or
- receiving one clear Captain instruction to start

No walls of text. No configuration. No competing primary actions.

If a screen violates this rule, redesign before adding features.

---

## Mission-focus layout

Mission routes share one layout pattern:

- One clear objective per screen
- Progress visible (route strip, mission card)
- Captain FAB as primary mic on speaking legs
- No choice paralysis — Mission Engine drives navigation

Mission-focus routes: home dashboard, pronunciation, vocabulary, Part 1, Part 2, mission recall, flight debrief, mock exam.

---

## Recording UI states

Mic label and color derive from controller phase — single source, no duplicate buttons.

| Phase | Mic label | Color |
|-------|-----------|-------|
| idle | Record | green |
| starting | Starting microphone… | gray |
| recording | Recording | red |
| assessing | Assessing… | gray |
| success | Record next | green |
| error | Try again | amber |

---

## Coaching surfaces

| Surface | When |
|---------|------|
| Inline coaching card | After assessment — human copy + collapsed technical details |
| Floating Captain | Proactive tips, PTT, mission guidance |
| Avatar state | idle / listening / speaking / celebrating / correcting |

One clear coaching message per event — never duplicate inline and floating with the same content.

---

## Copy authenticity

Student-facing copy must sound like a senior helicopter instructor:

- Name the target word or phrase
- One actionable fix
- Aviation-framed reason
- Clear next step

**Forbidden in student copy:** raw Azure metrics, API field names, generic AI filler ("Great job on your pronunciation journey!").

---

## Progressive visual assistance

Visual coaching shows **one focus at a time** — keywords, syllables, or structure depending on context. Never overwhelm with multiple highlights.

Quick notes use pilot shorthand for Part 2 pressure tasks.

---

## Mobile and accessibility

Touch targets sized for in-hand use. FAB ergonomics on small screens. `aria-live` regions on coaching and recorder state changes.

---

## Anxiety reduction

Every interface decision should reduce anxiety:

- Captain always visible on mission routes
- One next action always clear
- Errors explain what to do, not what failed internally
- Strong passes get brief encouragement — move forward, don't over-coach

---

## Design principles

1. Captain Delta is always in command of the student's attention.
2. Speaking surfaces beat reading surfaces.
3. Professional aviation aesthetic — restrained, not playful.
4. Mission card shows one status line — no duplicate actions.
5. Debrief always closes with tomorrow's focus.
