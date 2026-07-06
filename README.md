# ICAO Delta

Personal ICAO/SDEA exam preparation for helicopter pilots — speak, listen, get debriefed, pass.

**Production:** https://icao-delta.vercel.app

**Documentation:** [flight-manual/00_HOME.md](flight-manual/00_HOME.md) — the only source of truth.

---

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Repository layout

```
icao/
├── flight-manual/     # All official documentation + AI prompts
├── app/               # Next.js routes + API
├── components/        # React UI
├── lib/               # Business logic
├── hooks/             # React hooks
├── data/              # Exam datasets
└── prisma/            # Database schema
```

| Folder | Role |
|--------|------|
| **flight-manual/** | Product, architecture, prompts — start at [00_HOME.md](flight-manual/00_HOME.md) |
| **app/, lib/, …** | Application code |

### Golden rules

1. **Flight Manual wins** — if code and manual disagree, fix code or update the manual.
2. **No UX invention** — document in `flight-manual/` before implementing.
3. **No parallel documentation** — everything official lives under `flight-manual/`.

---

## Daily mission

One exam per day (23C → 24C → 25C → 26C):

Pronunciation → Vocabulary → Part 1 → Part 2 → (Intense: Mock) → Debrief

Details: [flight-manual/01_PRODUCT.md](flight-manual/01_PRODUCT.md)

---

## Development

```bash
npm run build
npx tsc --noEmit
npx prisma migrate dev
```

Push to `main` → Vercel auto-deploy.
