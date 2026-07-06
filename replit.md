# HistoSpotter

A dark-themed Expo/React Native histology quiz app with a real-time community chat. Users learn by taking spot-diagnosis quizzes and can chat with others by picking a guest display name — no sign-in required.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/mobile` — Expo/React Native app (expo-router). Theme via `hooks/useColors`, Inter fonts.
  - `app/(tabs)/chat.tsx` — real-time chat screen (WebSocket, unsend, colored names)
  - `hooks/useChatIdentity.ts` — resolves chat identity (persistent `anon:<uuid>` + guest name)
- `artifacts/api-server` — Express 5 API + WebSocket
  - `src/ws/chat.ts` — chat WS: history, broadcast, owner-only unsend
- DB schema source of truth: `@workspace/db` (Drizzle). Chat messages table has a `senderId` column.

## Architecture decisions

- **No authentication required.** Chat is guest-only: users pick a display name and get a persistent anonymous ID stored in AsyncStorage. No sign-in, no passwords, no OAuth.
- **Chat identity is client-supplied.** The server accepts the guest's `anon:<uuid>` senderId as-is. Unsend authorizes by exact `senderId` match, so only the same client/browser can delete their own messages.
- Colored sender names use a stable hash of the display name (WhatsApp-style).

## Product

- Histology spot-diagnosis quizzes (including a Head & Neck quiz), review, results, saved items, and stats.
- Real-time community chat: guests pick a display name, no sign-in needed. Owner-only unsend via long-press.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Ad-hoc WebSocket tests through `localhost:80` have flaky self-echo — use a separate observer connection to verify broadcasts.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
