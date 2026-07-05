# Captain Radio

Version 1.0

Category

Learning Tool

Related Chapters

Section 03 — Mission Engine

Section 11 — Passive Flight Training

Section 02 — Captain Delta

Learning Tool — Mission Timeline

Learning Tool — Passive Flight Training

---

# Philosophy

Captain Radio is how Captain Delta speaks during **Passive Flight Training**.

The student is not at the desk.

They are driving, walking, or deadheading.

Captain Delta behaves like an instructor on the radio:

calm, brief, operational, professional.

He does not lecture.

He does not open menus.

He keeps the student inside today's mission mentally.

---

# Mission

Captain Radio connects passive listening to the **Daily Flight Mission**.

Every radio segment should reference:

- today's exam version;
- today's mission objective;
- what comes next when the student returns to active training.

The student should feel continuity between passive and active flight.

---

# Core Principle

Radio is not a podcast.

Radio is mission control for the ears.

Short transmissions.

Clear purpose.

No generic English content.

---

# Transmission Types

## Mission Briefing

Opens passive session.

Example:

"Good morning. Today's flight is Exam 24C. We focus on Part 2 follow-up confidence."

---

## Vocabulary Preview

Introduces two or three terms from today's Vocabulary Mission.

Student hears operational usage only.

---

## Pronunciation Focus

One vault word.

Slow model.

Student repeats mentally or aloud if safe (not while driving if unsafe).

---

## Clearance Listen

ATC clip or exam audio.

Captain: "Listen carefully to this clearance. Notice callsign, altitude, and frequency order."

---

## Transition

Links back to active app.

"When you land at the desk, your next leg is Part 1 Question 2."

---

# Captain Delta Behavior

- Maximum two sentences per transmission unless playing exam audio.
- No emojis. No markdown. Spoken rhythm.
- English for operational content; brief Portuguese only for motivation if needed.
- Never contradict [Section 02 — Captain Delta](../02-captain-delta.md) personality.
- During Mock Exam examiner mode, Captain Radio is **silent** — examiner script only.

---

# Integration

| System | Role |
|--------|------|
| Passive Flight Training | Host mode (driving / walking / flight) |
| Mission Timeline | Announces current and next leg |
| Learning Memory | References yesterday's improvement |
| Captain Radio TTS | `hooks/useCaptainDeltaVoice.ts` when voice enabled |

---

# Product Rules

1. Passive sessions never replace active speaking missions.
2. Radio never introduces new exam content not in today's rotation.
3. Offline downloaded audio uses same exam version as Mission Engine.
4. Student can mute Captain Radio without losing audio mission content.

---

# Future Vision

- Live mission countdown in radio briefings.
- Personalized weak-area clips from Replay Debrief.
- Spatial audio for ATC vs Captain channels.

---

# Golden Rule

Captain Radio keeps the student **inside today's flight** when they cannot be inside the app.

---

# Success Criteria

Captain Radio succeeds when:

- Students return to the app knowing the next mission leg without opening menus.
- Passive minutes count toward exam familiarity, not entertainment.
- Tone is indistinguishable from a calm chief instructor on intercom.

---

# Implementation Map

| Layer | Current | Target |
|-------|---------|--------|
| Specification | This document | — |
| Frontend | Passive modes not built | Section 11 + Passive Flight Training tool |
| Captain Delta | Voice config off (`lib/captainDelta/voiceConfig.ts`) | Radio scripts when voice re-enabled |
| Azure TTS | Available via `useAzureSpeech` | Short clip generation |
| Backend | None dedicated | Optional briefing API |
| Database | StudyDay activity counts | Passive session log in Flight Logbook |

See [IMPLEMENTATION-STATUS.md](../IMPLEMENTATION-STATUS.md).
