---
name: Optional Clerk auth on Expo (web + native)
description: Decisions for making Clerk auth truly optional in an Expo app and securing an anonymous-first realtime chat.
---

# Optional Clerk auth on Expo

## Never gate app/screen readiness on Clerk `isLoaded`
When auth is optional, do NOT compute a screen's `ready` flag as `authLoaded && localLoaded`.
If Clerk never reaches loaded (misconfig, offline, proxy issue) the screen blocks forever.
Use local state plus a timeout fallback, e.g. `ready = localLoaded && (authLoaded || authTimedOut)`
where `authTimedOut` flips true ~3s after mount if Clerk hasn't loaded. Then guest mode still works.

**Why:** a lost/absent `ClerkProvider` or a stalled Clerk load presented as a permanently blank screen.
**How to apply:** any Expo screen that reads `useAuth()`/`useUser()` but must remain usable signed-out.

## Chat WS identity is client-spoofable unless verified server-side
A realtime chat that trusts a client-supplied `senderId` (e.g. `clerk:<id>` / `anon:<uuid>`) lets any
client forge another user's identity and delete their messages. WebSocket upgrades bypass Express
`clerkMiddleware`, so verify explicitly:
- Client sends `{type:"auth", token}` on every (re)connect, token from `getToken()`; only when signed in.
- Server verifies with `verifyToken(token, { secretKey })` (re-exported from `@clerk/express`), stores the
  proven `sub` per-socket (WeakMap keyed by the ws), and resolves the authoritative senderId:
  verified → force `clerk:<sub>` (ignore client claim); unverified but client claims `clerk:` → reject the
  frame; otherwise accept the guest `anon:` id best-effort.
- Message handling must `await` the in-flight auth-verification promise before resolving identity, to avoid a
  race where an early message is processed as unverified.

**Why:** guests are inherently unverifiable, but a signed-in "real identity" must be trustworthy for
owner-only unsend to mean anything.
**How to apply:** any WS feature that authorizes actions by identity (unsend, edit, moderation).

## Ad-hoc WS testing gotcha
Self-echo (server broadcasting a message back to the same socket that sent it) is flaky through the
`localhost:80` shared proxy in quick node scripts — inserts still succeed (history grows) but the sender may
not receive its own broadcast. Test broadcast/authorization with a SEPARATE observer connection, not self-echo.
