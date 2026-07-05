# Azure Services

Speech and pronunciation integration.

---

## Services used

| Service | Purpose |
|---------|---------|
| Azure Speech STT | Transcription for recordings |
| Azure Pronunciation Assessment | Word/syllable accuracy scores |
| Azure Neural TTS | Captain Delta voice, model answers, Escutar Prova |

---

## Key files

| File | Role |
|------|------|
| `lib/azure/azureSpeech.ts` | Speech SDK wrapper |
| `lib/azure/azureTts.ts` | TTS synthesis |
| `lib/azure/pronunciation.ts` | Pronunciation assessment parsing |
| `hooks/useAzurePronunciation.ts` | Client recording hook |
| `hooks/useAzureSpeech.ts` | Client TTS hook |
| `hooks/useCaptainDeltaVoice.ts` | Captain Delta audio playback |
| `app/api/azure/speech/route.ts` | Server token/synthesis proxy |

---

## Pronunciation assessment types

Passed to Azure as reference text type:

| App type | Azure context |
|----------|---------------|
| `part1` | General / long-form answer |
| `part2-readback` | Short phrase readback |
| Word level | Single word reference |

Results → `AzurePronunciationResult` → vault add filter (&lt; 40% auto-add).

---

## TTS voices

Captain Delta and examiner use neural English voices configured in speech hooks.

Voice catalog target: `assets/voices/` (documentation; config remains in code until migration).

---

## Environment

```
AZURE_SPEECH_KEY=
AZURE_SPEECH_REGION=brazilsouth   # or your region
```

---

## Offline / Escutar Prova

Exam audio uses **pre-generated MP3s** and original ATC files — not live TTS for ATC tracks.

Pipeline: `lib/fullExamListening/examAudioPipeline.ts`

Offline cache: `lib/fullExamListening/offlinePack.ts` — Cache API `icao-escutar-prova-audio-v1`

---

## Cost & reliability

- Pronunciation assessment runs client-side with SDK token from API route
- Fallback messaging when microphone or Azure unavailable
- OpenAI separate from Azure (see [api.md](./api.md))
