# ICAO Delta — Master Knowledge Catalog

## What this is

The **Master Catalog** is the permanent aviation curriculum of ICAO Delta.

It is the single authoritative list of every operational concept the platform should eventually teach — from ATC phraseology and emergency procedures to CRM, helicopter operations, and ICAO speaking skills.

## What this is not

| Not this | Why |
|----------|-----|
| Application code | Lives in `app/`, `lib/`, `components/` |
| Lesson content | Lessons are generated *from* the catalog, not stored here |
| JSON vocabulary entries | Structured entries live in `knowledge/vocabulary/` after curation |
| Captain prompts | Captain teaches from approved knowledge, not from this file directly |
| Word Mission content | Word Mission consumes approved vocabulary, not the catalog |

## How the application uses it

**The Master Catalog is not consumed directly by the application.**

It is a planning document. Future workflows will:

1. Select concepts from the catalog
2. Research trusted aviation sources
3. Draft structured knowledge entries
4. Review and approve into `knowledge/vocabulary/`
5. Publish to Captain Delta, Word Mission, Mission Recall, and Mock Exam

## Rules

- **One concept, one entry.** Every operational idea appears exactly once.
- **Operational concepts only.** "Fly Direct" is valid. "Fly" is not.
- **No invented aviation facts.** Batch 01 concepts come only from the uploaded phraseology document.
- **No explanations in the catalog.** Each row is an index line, not a lesson.
- **Status starts at Pending.** Nothing is published from the catalog without the review workflow.

## Status workflow

```
Pending → Draft → Review → Approved → Published
```

Every concept in Version 1.0 starts as **Pending**.

## Growth target

The full vision is approximately **500 operational aviation concepts**.

Version 1.0 **Batch 01** is extracted from `Students material.pdf` — the official ICAO Delta phraseology document.

## File

| File | Purpose |
|------|---------|
| `icao_master_catalog.md` | The catalog itself — ID, category, concept, priority, ICAO parts, status |

## Relationship to other knowledge folders

```
knowledge/
├── master/           ← curriculum index (this folder)
├── vocabulary/       ← approved structured entries
├── phraseology/      ← future phrase sets
└── scenarios/        ← future situational training
```

The catalog drives *what* gets built. The vocabulary folder holds *how* Captain teaches it.
