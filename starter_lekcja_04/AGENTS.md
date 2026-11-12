<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Zasady tego projektu (kurs Agenci AI)

- Rozmawiaj z autorem po polsku, prostym językiem. Autor nie musi być programistą.
- Biblioteki: Next.js 16, AI SDK 7 (`ai`, `@ai-sdk/react`), `@openrouter/ai-sdk-provider`, `zod`. Zanim użyjesz funkcji z tych bibliotek, sprawdź ją w `node_modules/ai/docs/` albo w plikach typów — nazwy różnią się od starszych wersji (np. `instructions`, `inputSchema`, `stopWhen: isStepCount(n)`, `toUIMessageStream`).
- Model i klucz są w jednym miejscu: `lib/model.ts`. Charakter chatbota: `lib/persona.ts`. Narzędzia agenta: `lib/tools.ts`.
- Każdy endpoint w `app/api/` najpierw sprawdza sesję (`hasSession()` z `lib/session.ts`) i bez niej zwraca 401, zanim wywoła model.
- Nie czytaj, nie wypisuj i nie zmieniaj wartości w `.env.local`. Możesz podawać tylko nazwy zmiennych.
- Po zmianach uruchom `npm run build` i napraw błędy. Na końcu napisz w 3 punktach, co zrobiłeś i jak to sprawdzić w przeglądarce.
