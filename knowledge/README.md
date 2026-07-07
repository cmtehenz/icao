# ICAO Delta — Aviation Knowledge Base

This folder is the **permanent aviation knowledge database** for ICAO Delta.

It is **not** application code.  
It is **not** generated UI.  
It is **not** documentation about the product.

Captain Delta **consumes** this information.  
Future importers **populate** this database.

## Three pillars

| Pillar | Location | Role |
|--------|----------|------|
| Implementation | `app/`, `lib/`, `components/` | Product code |
| Product vision | `flight-manual/` | Architecture, rules, decisions |
| **Operational knowledge** | `knowledge/` | Curated aviation truth |

## Golden rule

**Captain Delta never invents aviation knowledge.**

Captain explains, adapts, asks questions, creates exercises, and motivates — but every operational fact comes from this database (or an approved importer into it).

## Structure

```
knowledge/
├── README.md           ← you are here
├── vocabulary/         ← one JSON file per term
├── phraseology/        ← ATC phrase sets (future)
├── scenarios/          ← situational training (future)
├── pronunciation/      ← pronunciation hints (future)
├── sources/            ← approved source registry
├── importer/           ← importer interfaces (no scrapers in app)
├── schema/             ← JSON schema + TypeScript types
├── generated/          ← machine-generated indexes (future)
└── review/             ← curation review notes
```

## Vocabulary entries

Each term is stored as one file:

```
knowledge/vocabulary/report.json
knowledge/vocabulary/heading.json
```

Every entry follows `schema/vocabulary.schema.json`.

## Approved source priority

1. Curated ICAO Delta content  
2. ICAO publications  
3. FAA  
4. FAA AIM  
5. FAA Pilot Handbook  
6. SKYbrary (summarized + attributed — never bulk-copied)  
7. EASA  
8. Rotorcraft manuals  
9. Real ICAO phraseology  
10. YouGlish pronunciation  

## Content rules

Reject content that is generic, meta, artificial, self-referential, or about the lesson, exam, or app.

Forbidden in Captain speech:

- "In Part 2..."
- "I would explain..."
- "This lesson..."
- "In this exercise..."
- "We are learning..."
- "This vocabulary..."

## Importers

Interfaces live in `importer/`. They define how external sources **output structured knowledge** — not how the app scrapes websites.

Read → Summarize → Extract → Store structured knowledge.

## Growth path

This database will eventually hold thousands of vocabulary entries, hundreds of ICAO situations, phraseology, CRM examples, weather scenarios, helicopter operations, and Brazilian pilot mistake patterns.

Quality here is more important than prompt quality.
