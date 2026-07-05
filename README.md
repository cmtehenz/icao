# ICAO Delta

Personal ICAO/SDEA exam preparation for helicopter pilots — speak, listen, get debriefed, pass.

**Production:** https://icao-delta.vercel.app

---

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Architecture

ICAO Delta 2.0 separates **product truth**, **AI prompts**, **technical docs**, **assets**, and **application code**.

```
icao-delta/                    # Repository root (this project)
│
├── flight-manual/             # 📖 Product Bible — Source of Truth
│   ├── README.md, TERMINOLOGY, CURRENT-PRODUCT, IMPLEMENTATION-STATUS
│   ├── Chapters 00–13, 99 · 14–18 · learning-tools/ · architecture/
│
├── prompts/                   # 🤖 AI system prompts only
│   └── *.md                   # Must reference flight-manual chapters
│
├── docs/                      # 🔧 Technical documentation
│   └── architecture, api, database, azure, deployment
│
├── assets/                    # 🎨 Static media catalog (migration target)
│   └── audio/, images/, icons/, voices/
│
├── src/                       # 💻 Application code (→ migrate here)
│   └── README.md              # Current code still at repo root (app/, lib/, …)
│
├── app/                       # Next.js routes (current)
├── components/                # React UI (current)
├── lib/                       # Business logic (current)
├── hooks/                     # React hooks (current)
├── data/                      # Exam & vocab datasets
├── prisma/                    # Database schema
├── public/                    # Static files served in production
│
└── README.md                  # This file
```

### Folder responsibilities

| Folder | Responsibility | Who reads it |
|--------|----------------|--------------|
| **flight-manual/** | Product Bible — start at [flight-manual/README.md](flight-manual/README.md) |
| **prompts/** | Exact LLM system prompts, linked to manual chapters | AI integration work |
| **docs/** | How the system works technically — never product decisions | Engineers |
| **assets/** | Audio, images, icons, voice references | Design + audio pipeline |
| **src/** | All runnable application code (target layout) | Engineers |
| **app/, lib/, …** | Current Next.js app until `src/` migration | Engineers |

### Golden rules

1. **Flight Manual wins** — if code and manual disagree, fix code or update manual first.
2. **No UX invention** — document in `flight-manual/` before implementing.
3. **Prompts stay in `prompts/`** — don't bury prompts in product docs.
4. **Product ≠ tech** — exam philosophy in manual; Prisma schema in `docs/`.

Cursor agents: see [`.cursor/rules/product.mdc`](.cursor/rules/product.mdc).

---

## Daily mission (product summary)

One exam per day (23C → 24C → 25C → 26C):

1. Pronunciation (5 words)
2. Vocabulary (20 terms)
3. Part 1 (3 questions — shadow + coach)
4. Part 2 (5 situations)
5. Mock exam (optional / intense days)

Details: [flight-manual/03-mission-engine.md](flight-manual/03-mission-engine.md)

---

## Development

```bash
npm run build          # Production build
npx tsc --noEmit       # Typecheck
npx prisma migrate dev # Local DB migrations
```

---

## Deploy

Push to `main` → Vercel auto-deploy.

See [docs/deployment.md](docs/deployment.md).

---

## Legacy note

This project evolved from ICAO Part 1 flashcards. The original `icao_part1.html` and `cards.json` remain as reference; the app now covers Part 1, Part 2, pronunciation, vocabulary, simulado, and Captain Delta coaching.
