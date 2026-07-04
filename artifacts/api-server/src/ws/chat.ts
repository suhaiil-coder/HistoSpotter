import { WebSocketServer, WebSocket } from "ws";
import { verifyToken } from "@clerk/express";
import { db, chatMessages } from "@workspace/db";
import { and, desc, eq } from "drizzle-orm";
import { logger } from "../lib/logger";

const clients = new Set<WebSocket>();

interface SockState {
  /** Clerk user id proven via a verified session token, if any. */
  verifiedUserId: string | null;
  /** In-flight verification so message handling can await it. */
  authPromise: Promise<void> | null;
}
const sockState = new WeakMap<WebSocket, SockState>();

/**
 * Resolve the server-authoritative senderId for a socket.
 * - A verified Clerk user always resolves to `clerk:<id>` (client claim ignored).
 * - An unverified client that claims a `clerk:` id is rejected (spoof attempt).
 * - Otherwise the client-supplied guest id (`anon:<uuid>`) is used as-is.
 */
async function resolveSenderId(
  ws: WebSocket,
  claimed: unknown,
): Promise<{ ok: true; sid: string } | { ok: false }> {
  const s = sockState.get(ws);
  if (s?.authPromise) {
    try {
      await s.authPromise;
    } catch {
      // verification failure already recorded on state
    }
  }
  if (s?.verifiedUserId) return { ok: true, sid: `clerk:${s.verifiedUserId}` };
  if (typeof claimed === "string" && claimed.startsWith("clerk:")) {
    return { ok: false }; // unverified client cannot claim a Clerk identity
  }
  if (typeof claimed === "string" && claimed.trim()) {
    return { ok: true, sid: claimed.trim().slice(0, 128) };
  }
  return { ok: true, sid: "legacy" };
}

export function setupChatWS(wss: WebSocketServer): void {
  wss.on("connection", async (ws) => {
    sockState.set(ws, { verifiedUserId: null, authPromise: null });
    // Send last 50 messages as history
    try {
      const history = await db
        .select()
        .from(chatMessages)
        .orderBy(desc(chatMessages.createdAt))
        .limit(50);
      ws.send(JSON.stringify({ type: "history", messages: history.reverse() }));
    } catch (err) {
      logger.error({ err }, "Failed to load chat history");
      ws.send(JSON.stringify({ type: "history", messages: [] }));
    }

    clients.add(ws);
    logger.info({ clients: clients.size }, "Chat client connected");

    ws.on("message", async (data) => {
      try {
        const parsed = JSON.parse(data.toString()) as unknown;
        if (typeof parsed !== "object" || parsed === null) return;
        const type = "type" in parsed ? (parsed as { type: unknown }).type : undefined;

        // ── Auth: prove a Clerk identity for this socket ──────────────────
        if (type === "auth") {
          const { token } = parsed as { token: unknown };
          if (typeof token !== "string" || !token) return;
          const s = sockState.get(ws);
          if (!s) return;
          s.authPromise = (async () => {
            try {
              const claims = await verifyToken(token, {
                secretKey: process.env.CLERK_SECRET_KEY ?? "",
              });
              s.verifiedUserId =
                typeof claims.sub === "string" ? claims.sub : null;
            } catch (err) {
              s.verifiedUserId = null;
              logger.warn({ err }, "Chat auth token verification failed");
            }
          })();
          return;
        }

        // ── Unsend / delete ──────────────────────────────────────────────
        if (type === "delete") {
          const { id, senderId } = parsed as unknown as {
            id: unknown;
            senderId: unknown;
          };
          if (typeof id !== "number") return;

          const resolved = await resolveSenderId(ws, senderId);
          if (!resolved.ok) return; // spoofed Clerk identity

          const deleted = await db
            .delete(chatMessages)
            .where(
              and(
                eq(chatMessages.id, id),
                eq(chatMessages.senderId, resolved.sid),
              ),
            )
            .returning({ id: chatMessages.id });

          if (deleted.length === 0) return; // not found or not owner

          const payload = JSON.stringify({ type: "delete", id });
          for (const client of clients) {
            if (client.readyState === WebSocket.OPEN) client.send(payload);
          }
          return;
        }

        // ── New message ──────────────────────────────────────────────────
        if (!("username" in parsed) || !("message" in parsed)) return;

        const { username, message, senderId } = parsed as {
          username: unknown;
          message: unknown;
          senderId: unknown;
        };
        if (typeof username !== "string" || typeof message !== "string") return;
        const trimmedUsername = username.trim().slice(0, 30);
        const trimmedMessage = message.trim().slice(0, 500);
        const resolved = await resolveSenderId(ws, senderId);
        if (!resolved.ok) return; // spoofed Clerk identity
        const sid = resolved.sid;
        if (!trimmedUsername || !trimmedMessage) return;

        const [saved] = await db
          .insert(chatMessages)
          .values({ senderId: sid, username: trimmedUsername, message: trimmedMessage })
          .returning();

        const payload = JSON.stringify({ type: "message", message: saved });
        for (const client of clients) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
          }
        }
      } catch (err) {
        logger.error({ err }, "Error handling chat message");
      }
    });

    ws.on("close", () => {
      clients.delete(ws);
      logger.info({ clients: clients.size }, "Chat client disconnected");
    });

    ws.on("error", (err) => {
      logger.error({ err }, "Chat WebSocket error");
    });
  });
}
