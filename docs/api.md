# API Reference

Next.js App Router API routes (`app/api/`).

All protected routes use `requireUser()` from `lib/auth/requireUser.ts`.

---

## Auth

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Session login |
| POST | `/api/auth/logout` | Clear session |

---

## Coaching & evaluation

| Method | Path | Body | Response |
|--------|------|------|----------|
| POST | `/api/captain-delta` | `question`, `pageContext`, `lessonContext`, `memoryContext` | `{ reply }` |
| POST | `/api/flight-instructor` | `type`, `question`, `transcript`, `report` inputs | `FlightInstructorReport` JSON |
| POST | `/api/evaluate` | `type`, `question`, `transcript`, `modelAnswer`, … | Scores + feedback |

**Prompts:** see [`prompts/`](../prompts/README.md)

---

## User data sync

| Method | Path | Description |
|--------|------|-------------|
| GET/POST | `/api/vault` | Pronunciation vault sync |
| GET/POST | `/api/daily-mission` | Mission completion log sync |
| GET/POST | `/api/study-activity` | Study day counters |

---

## Media

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/azure/speech` | TTS token or synthesis proxy |
| GET | `/api/evaluation-audio/[key]` | Stored evaluation audio |

---

## Environment variables

| Variable | Used by |
|----------|---------|
| `OPENAI_API_KEY` | evaluate, flight-instructor, captain-delta |
| `AZURE_SPEECH_KEY` | Azure STT/TTS |
| `AZURE_SPEECH_REGION` | Azure region |
| `DATABASE_URL` | Prisma |

See [deployment.md](./deployment.md).

---

## Error handling

- `401` — not authenticated (`requireUser` failed)
- `400` — invalid JSON or missing required fields
- Local fallbacks when OpenAI key missing (captain-delta returns `source: "local"`)

---

## Adding a new route

1. Update Flight Manual if product behavior changes
2. Add route under `app/api/`
3. Document here
4. Add prompt file if LLM-backed
