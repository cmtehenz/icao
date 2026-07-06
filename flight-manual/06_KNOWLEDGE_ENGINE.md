# 06 — Knowledge Engine

## Purpose

The Knowledge Engine ensures ICAO Delta **never depends on AI alone** for operational truth.

It is the curated layer between Flight Manual content, Chief Instructor expertise, official aviation sources, and AI generation.

**Rule:** If knowledge does not exist → **do not invent** → create a **Knowledge TODO**.

---

## Knowledge hierarchy

Priority (highest wins):

| Priority | Source |
|----------|--------|
| 1 | ICAO Delta Knowledge Base (KDB) — verified, versioned |
| 2 | ICAO / EASA / FAA official publications |
| 3 | Manufacturer AFM / FCOM excerpts (licensed) |
| 4 | Operator SOP / company bulletins (licensed) |
| 5 | Chief Instructor verified experience |
| 6 | Community-submitted (future — review queue) |
| 7 | AI-generated — **lowest priority**, flagged until verified |

Captain prompts and UI copy citing operational facts must use tier 1–5.

---

## Knowledge TODO

When content is missing, log a TODO — never fabricate:

```yaml
id: KTODO-2026-001
topic: Manaus departure procedures
priority: high
status: todo
needs: [real_atc_audio, operational_phrases, airport_notes]
blocks: [lesson: pronunciation, feature: operational_context]
notes: Do not let AI invent Manaus phraseology.
```

**Until resolved:** generic operational framing; "Content in preparation" if critical; **never** airport-specific invention.

---

## Content types

Operational phrases, airport notes, ATC audio, cockpit video, ICAO exam questions, PEEL model answers, picture anchors, verified instructor stories, reference PDFs.

Each record carries: source tier, verified_by, verified_at, tags (airport, phase, leg, level), locale.

---

## Captain integration

When `/api/captain-delta` answers:

1. Retrieve KDB snippets by topic
2. If empty → check TODO registry
3. If blocked → refuse specific facts; offer generic coaching
4. Log gap for Chief Instructor

Pronunciation coaching uses **assessment + word context** deterministically — not LLM — for human feedback.

Word context today: `contextPack` on vault words (expression, sentence, icaoPrompt, fragment). Future: link to KDB records.

---

## Chief Instructor role

The Chief Instructor is the **human authority** — operational truth, examiner perspective, local aviation context (Brazil, helicopter ops, SDEA).

| Chief Instructor owns | Engineering owns |
|-----------------------|------------------|
| Operational accuracy | Schema, ingestion, admin UI |
| Captain tone spot-checks | Coaching template code |
| Knowledge TODO priority | Runtime refusal + logging |
| Exam format alignment | Mission Engine configuration |
| Real-world assets (video, ATC, notes) | Platform delivery |

### Content workflow

1. **Identify gap** — student confusion, TODO queue, vault words without context
2. **Prepare asset** — with metadata (airport, phase, phrase, rights)
3. **Submit for review** — source tier, tags, leg links
4. **Verify** — pilot comprehension spot-check, TERMINOLOGY alignment
5. **Publish** — available to Learning Engine, Captain prompts, mission copy

### What not to feed

Unverified forum gossip, unlicensed manuals, generic ESL without aviation frame, AI-generated airport data without review.

---

## Quality bar

Before publish:

- Source tier documented
- Verified by named reviewer
- Matches product terminology
- No conflict with Flight Manual
- Licensed media rights confirmed

---

## Ingestion pipeline (future)

```
Chief Instructor / Admin Panel → Upload + metadata → Review queue → Publish to KDB
  → Learning Engine · Captain prompts · Mission content
```

Every asset should serve multiple legs — tag aggressively at upload.
