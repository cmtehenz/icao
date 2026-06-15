# ICAO Part 1 Flashcards

App de flashcards para estudo do ICAO Part 1, com 42 perguntas no formato ICAO 5.

## Desenvolvimento local

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Deploy na Vercel

1. Faça push do repositório para o GitHub
2. Acesse [vercel.com](https://vercel.com) e importe o repositório
3. A Vercel detecta Next.js automaticamente — não precisa de configuração extra
4. Clique em **Deploy**

Ou via CLI:

```bash
npm i -g vercel
vercel
```

## Estrutura

- `app/` — rotas e layout Next.js
- `components/FlashcardApp.tsx` — app principal (client component)
- `cards.json` — dados dos 42 flashcards
- `lib/` — tipos e utilitários

O arquivo original `icao_part1.html` foi mantido como referência.
