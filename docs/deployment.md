# Deployment

---

## Production

| Item | Value |
|------|--------|
| Host | Vercel |
| URL | https://icao-delta.vercel.app |
| Branch | `main` → auto deploy |
| Repo | GitHub `cmtehenz/icao` |

---

## Build

```bash
npm install
npm run build
```

Next.js detects App Router automatically on Vercel.

---

## Environment variables (Vercel)

Required for full functionality:

```
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
AZURE_SPEECH_KEY=...
AZURE_SPEECH_REGION=...
```

Auth/session secret as configured in `lib/auth/` (check project env template).

---

## Database migrations

On deploy, run migrations against production DB:

```bash
npm run migrate:deploy
```

Or via `scripts/migrate-deploy.mjs` in CI/CD if configured.

---

## Static assets

- `public/` — served at root URL
- Exam audio: `npm run setup:audio` (or equivalent) copies `provas/` → `public/provas/`
- PWA: `public/sw.js` — bump cache version on breaking client changes

---

## Scripts (dev/maintenance)

| Script | Purpose |
|--------|---------|
| `scripts/migrate-deploy.mjs` | Production Prisma migrate |
| `scripts/enrich-cards-study.mjs` | Card data enrichment |
| `scripts/setup-audio` | Audio file setup |

Debug probes (`scripts/probe-*.mjs`) — local only, not deployed.

---

## PWA

`app/manifest.ts` — installable on iOS/Android.

Service worker caches app shell; exam audio uses separate offline pack.

---

## Monitoring

- Vercel deployment logs for build/runtime errors
- Client errors surface in browser console; no Sentry configured (2.0 candidate)

---

## Rollback

Revert commit on `main` → Vercel redeploys previous build.

Database rollbacks require manual Prisma migration — avoid destructive migrations on production.
