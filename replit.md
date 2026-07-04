# HistoSpotter

A dark-themed Expo/React Native histology quiz app with a real-time community chat. Users learn by taking spot-diagnosis quizzes and can chat with others; signing in is optional everywhere.

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
  - `app/(auth)/` — optional Clerk sign-in / sign-up (custom UI, Google + email/password)
  - `hooks/useChatIdentity.ts` — resolves chat identity (`clerk:<id>` when signed in, else persistent `anon:<uuid>` + guest name)
  - `lib/clerkTokenCache.ts` — SecureStore token cache (native only)
  - `app/_layout.tsx` — wraps app in `ClerkProvider`
- `artifacts/api-server` — Express 5 API + WebSocket
  - `src/ws/chat.ts` — chat WS: history, broadcast, server-verified identity + owner-only unsend
  - `src/app.ts` — Clerk server middleware
- DB schema source of truth: `@workspace/db` (Drizzle). Chat messages table has a `senderId` column.

## Architecture decisions

- **Auth is optional everywhere.** The app never blocks on Clerk: chat readiness uses a local-load flag plus a ~3s auth timeout fallback, so guest mode works even if Clerk is slow/unavailable.
- **Chat identity is server-authoritative for signed-in users.** WS upgrades bypass Express middleware, so the client sends its Clerk token over the socket (`{type:"auth",token}`); the server verifies it (`verifyToken`) and forces `clerk:<sub>`. Unverified clients cannot claim a `clerk:` id. Guests use client-supplied `anon:` ids (best-effort, inherently unverifiable).
- **Unsend authorizes by resolved senderId**, so only the true owner can delete a message for everyone.
- Colored sender names use a stable hash of the display name (WhatsApp-style).

## Product

- Histology spot-diagnosis quizzes (including a Head & Neck quiz), review, results, saved items, and stats.
- Real-time community chat: guests pick a display name; optional sign-in (Google or email/password) gives a real identity and enables owner-only unsend.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Clerk env is injected via the mobile `dev` script and `build.js` (`EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`, `EXPO_PUBLIC_CLERK_PROXY_URL`). The app must be wrapped in `ClerkProvider` in `app/_layout.tsx` or every `useAuth()`/`useUser()` call throws "useAuth outside ClerkProvider".
- Ad-hoc WebSocket tests through `localhost:80` have flaky self-echo — use a separate observer connection to verify broadcasts.
- Required secrets: `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY` (server verifies chat tokens with the secret key).

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
