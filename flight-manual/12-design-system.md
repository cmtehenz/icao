# Section 12 — Experience & Design System

Version 3.0

Related Chapters

Section 02 — Captain Delta

Section 03 — Mission Engine

Section 03A — Complete Flight Mission

All Mission Chapters

---

# Philosophy

ICAO Delta is not an English application.

It is a digital flight academy.

Every screen should feel like professional aviation training.

The student should never feel lost.

Never wonder what to do next.

Every interface should quietly guide the student.

Captain Delta is always in command.

---

# Product Identity

ICAO Delta should feel like:

• A senior helicopter instructor.

• A modern glass cockpit.

• A premium aviation training center.

Never like:

❌ Duolingo

❌ Generic AI chatbot

❌ PDF reader

❌ Flashcard application

❌ Language learning website

The experience must communicate professionalism, calmness and confidence.

---

# Design Principles

Every screen follows five principles.

## 1. One Mission

Every screen has one clear objective.

Only one primary action should dominate.

The student should never think:

"What do I do now?"

Captain already answers that.

---

## 2. Calm Interface

Reduce visual noise.

Avoid unnecessary colors.

Avoid large paragraphs.

White space is part of the design.

Silence is part of the experience.

---

## 3. Progressive Disclosure

Only show what is needed now.

Never overwhelm.

Captain reveals information gradually.

Exactly like a flight instructor.

---

## 4. Aviation First

Every interaction should resemble aviation.

Mission.

Briefing.

Checklist.

Debrief.

Logbook.

Captain.

Never:

Lesson.

Quiz.

Module.

Homework.

---

## 5. Confidence

Everything should increase confidence.

Nothing should make the student feel overwhelmed.

The interface should constantly communicate:

"You can do this."

---

# Navigation Philosophy

The student never navigates.

Captain navigates.

The Home screen always recommends exactly one action.

Begin Mission.

Continue Mission.

Resume Mock Exam.

Review Pronunciation.

Nothing else competes for attention.

---

# Mission Board

The Home screen is the Mission Board.

Example

Today's Flight

Exam 24

Mission Progress

🟢 Pronunciation

🟢 Vocabulary

🟡 Part 1

⚪ Part 2

⚪ Mission Recall

⚪ Mock Exam

Captain Recommendation

Continue Part 1

One click starts exactly where the student stopped.

---

# Captain Delta

Captain is always available.

Floating.

Persistent.

Never intrusive.

Captain may:

Speak.

Answer questions.

Explain the current screen.

Replay instructions.

Provide hints.

Explain mistakes.

Captain never replaces navigation.

Captain assists it.

---

# Floating Captain

Captain appears on every screen.

States

Idle

Listening

Speaking

Thinking

Recording

Muted

Expanded

Collapsed

Captain always occupies the same screen position.

The student builds muscle memory.

---

# Visual Language

Everything follows aviation semantics.

Green

Operational

Amber

Needs Attention

Red

Critical

Blue

Information

Purple

Captain Delta

Gray

Secondary Information

Colors never communicate emotion.

They communicate operational status.

---

# Typography

Portuguese

Navigation

Buttons

Menus

Settings

English

Everything related to ICAO.

Questions.

Vocabulary.

Coach.

Captain.

Debrief.

Mock Exam.

Training always happens in English.

---

# Motion

Animations are slow.

Purposeful.

Professional.

Never playful.

Examples

Captain speaking.

Mission completed.

Microphone activation.

Checklist completion.

Avoid unnecessary movement.

Motion should reduce anxiety.

Never increase it.

---

# Audio Feedback

Every important action has audio support.

Mission Start.

Mission Complete.

Recording.

Playback.

Replay.

Captain Voice.

Audio should always be optional.

Never mandatory.

---

# Screen Structure

Every mission screen follows the same structure.

Captain

↓

Mission Title

↓

Current Objective

↓

Main Activity

↓

Primary Action

↓

Captain Feedback

↓

Next Step

Consistency reduces cognitive load.

---

# Cards

Cards represent flight activities.

Never generic containers.

Examples

Pronunciation Card

Vocabulary Card

Question Card

Situation Card

Picture Card

Debrief Card

Every card has:

Title

Objective

Main Content

Primary Action

Status

Captain Insight

---

# Buttons

Every screen has one dominant button.

Examples

Begin Mission

Continue

Record

Next Situation

Finish Mission

Secondary actions remain visually quiet.

---

# Captain Speech Bubble

Captain messages should feel spoken.

Never like documentation.

Maximum

Three short sentences.

One idea at a time.

Natural pauses.

Conversational tone.

---

# Mission Complete

Completing a mission should feel rewarding.

Not gamified.

Captain congratulates naturally.

Mission Board updates.

Flight Logbook updates.

Tomorrow's mission becomes available.

The experience should resemble finishing a successful flight.

---

# Flight Logbook

Every completed mission creates a flight log.

Mission Number

Exam Version

Duration

Confidence

Captain Note

Next Mission

The Flight Logbook becomes the student's learning history.

Not a score history.

---

# Passive Flight

After today's mission,

Captain offers passive learning.

Driving Mode.

Walking Mode.

Coffee Break.

Bedtime Review.

Learning naturally continues throughout the day.

---

# Accessibility

Large buttons.

High contrast.

Keyboard navigation.

Voice-first compatibility.

Reduced Motion support.

Offline support.

Everything should work under cockpit-like conditions.

---

# Responsive Design

Mobile first.

Desktop enhanced.

Tablet supported.

Every screen should work comfortably using one hand.

Mission progress is always visible.

---

# Design Language

The application should feel:

Professional.

Modern.

Calm.

Premium.

Human.

Trustworthy.

Everything unnecessary should disappear.

Everything important should remain.

---

# Golden Rule

Every screen should answer three questions instantly.

Where am I?

What am I doing?

What should I do next?

If any screen fails to answer these questions,

the design must be simplified.

---

# Future Vision

ICAO Delta should eventually feel less like software...

...and more like having an experienced flight instructor sitting beside you every day.

The interface should disappear.

Only the learning experience should remain.

---

# Implementation Map

| Concern | Suggested Location |
|----------|-------------------|
| Design Tokens | src/designSystem/ |
| Components | components/ui/ |
| Mission Board | components/MissionBoard/ |
| Captain Floating UI | components/CaptainDelta/ |
| Flight Logbook | components/FlightLogbook/ |
| Animations | lib/motion/ |
| Audio Feedback | lib/audioFeedback/ |
| Theme | src/theme/ |

The Experience & Design System exists to make ICAO Delta feel like professional flight training.

Every visual decision must reinforce that identity.