import { WebSocketServer, WebSocket } from "ws";
import { db, chatMessages } from "@workspace/db";
import { and, desc, eq } from "drizzle-orm";
import { logger } from "../lib/logger";

const clients = new Set<WebSocket>();

function resolveSenderId(claimed: unknown): string {
  if (typeof claimed === "string" && claimed.trim()) {
    return claimed.trim().slice(0, 128);
  }
  return "legacy";
}

export function setupChatWS(wss: WebSocketServer): void {
  wss.on("connection", async (ws) => {
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

        // ── Unsend / delete ──────────────────────────────────────────────
        if (type === "delete") {
          const { id, senderId } = parsed as unknown as {
            id: unknown;
            senderId: unknown;
          };
          if (typeof id !== "number") return;

          const sid = resolveSenderId(senderId);

          const deleted = await db
            .delete(chatMessages)
            .where(
              and(
                eq(chatMessages.id, id),
                eq(chatMessages.senderId, sid),
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
        const sid = resolveSenderId(senderId);
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
