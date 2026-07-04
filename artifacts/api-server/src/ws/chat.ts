import { WebSocketServer, WebSocket } from "ws";
import { db, chatMessages } from "@workspace/db";
import { desc } from "drizzle-orm";
import { logger } from "../lib/logger";

const clients = new Set<WebSocket>();

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
        if (
          typeof parsed !== "object" ||
          parsed === null ||
          !("username" in parsed) ||
          !("message" in parsed)
        ) return;

        const { username, message } = parsed as { username: unknown; message: unknown };
        if (typeof username !== "string" || typeof message !== "string") return;
        const trimmedUsername = username.trim().slice(0, 30);
        const trimmedMessage = message.trim().slice(0, 500);
        if (!trimmedUsername || !trimmedMessage) return;

        const [saved] = await db
          .insert(chatMessages)
          .values({ username: trimmedUsername, message: trimmedMessage })
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
