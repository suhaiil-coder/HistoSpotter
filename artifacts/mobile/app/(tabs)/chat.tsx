import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

const USERNAME_KEY = "histospotter_chat_username";
const MAX_USERNAME = 20;
const MAX_MESSAGE = 400;

interface ChatMsg {
  id: number;
  username: string;
  message: string;
  createdAt: string;
}

type ConnStatus = "idle" | "connecting" | "connected" | "disconnected";

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function useWebKeyboardOffset(): number {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    if (Platform.OS !== "web") return;
    const vv = (window as Window & { visualViewport?: VisualViewport }).visualViewport;
    if (!vv) return;
    const handler = () => {
      const hidden = window.innerHeight - vv.height - vv.offsetTop;
      setOffset(Math.max(0, hidden));
    };
    vv.addEventListener("resize", handler);
    vv.addEventListener("scroll", handler);
    return () => {
      vv.removeEventListener("resize", handler);
      vv.removeEventListener("scroll", handler);
    };
  }, []);
  return offset;
}

export default function ChatScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topInset = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const bottomInset = insets.bottom || 0;
  const webKbOffset = useWebKeyboardOffset();

  const [username, setUsername] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<ConnStatus>("idle");

  const wsRef = useRef<WebSocket | null>(null);
  const listRef = useRef<FlatList<ChatMsg>>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(USERNAME_KEY).then((name) => {
      if (name) setUsername(name);
    });
  }, []);

  const connect = useCallback((name: string) => {
    const domain = process.env.EXPO_PUBLIC_DOMAIN;
    if (!domain) return;

    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.close();
    }

    const proto =
      Platform.OS === "web"
        ? location.protocol === "https:"
          ? "wss"
          : "ws"
        : "wss";
    const ws = new WebSocket(`${proto}://${domain}/api/chat/ws`);
    wsRef.current = ws;
    setStatus("connecting");

    ws.onopen = () => setStatus("connected");

    ws.onclose = () => {
      setStatus("disconnected");
      reconnectTimer.current = setTimeout(() => connect(name), 4000);
    };

    ws.onerror = () => setStatus("disconnected");

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data as string) as
          | { type: "history"; messages: ChatMsg[] }
          | { type: "message"; message: ChatMsg };
        if (data.type === "history") {
          setMessages(data.messages);
          setTimeout(() => listRef.current?.scrollToEnd({ animated: false }), 100);
        } else if (data.type === "message") {
          setMessages((prev) => [...prev, data.message]);
          setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 80);
        }
      } catch {
        // ignore malformed
      }
    };
  }, []);

  useEffect(() => {
    if (!username) return;
    connect(username);
    return () => {
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
      }
    };
  }, [username, connect]);

  const saveUsername = useCallback(() => {
    const trimmed = nameInput.trim().slice(0, MAX_USERNAME);
    if (!trimmed) return;
    AsyncStorage.setItem(USERNAME_KEY, trimmed);
    setUsername(trimmed);
  }, [nameInput]);

  const sendMessage = useCallback(() => {
    const text = input.trim();
    if (!text || !username || wsRef.current?.readyState !== 1) return;
    wsRef.current.send(JSON.stringify({ username, message: text }));
    setInput("");
  }, [input, username]);

  const statusColor =
    status === "connected"
      ? colors.success
      : status === "connecting"
        ? "#F59E0B"
        : colors.destructive;
  const statusLabel =
    status === "connected"
      ? "Live"
      : status === "connecting"
        ? "Connecting…"
        : "Offline";

  // ── Username picker ──────────────────────────────────────────────────
  if (!username) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <View
          style={[
            styles.namePicker,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.nameTitle, { color: colors.foreground }]}>
            Join the Chat
          </Text>
          <Text style={[styles.nameSub, { color: colors.mutedForeground }]}>
            Pick a display name to get started
          </Text>
          <TextInput
            style={[
              styles.nameInput,
              {
                backgroundColor: colors.secondary,
                borderColor: colors.border,
                color: colors.foreground,
              },
            ]}
            placeholder="Your name…"
            placeholderTextColor={colors.mutedForeground}
            value={nameInput}
            onChangeText={setNameInput}
            maxLength={MAX_USERNAME}
            autoFocus
            onSubmitEditing={saveUsername}
            returnKeyType="done"
          />
          <Pressable
            style={[
              styles.nameBtn,
              {
                backgroundColor: nameInput.trim()
                  ? colors.primary
                  : colors.secondary,
              },
            ]}
            onPress={saveUsername}
            disabled={!nameInput.trim()}
          >
            <Text
              style={[
                styles.nameBtnTxt,
                {
                  color: nameInput.trim() ? "#fff" : colors.mutedForeground,
                },
              ]}
            >
              Enter Chat
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // ── Chat screen ──────────────────────────────────────────────────────
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingBottom: webKbOffset },
      ]}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: topInset + 8,
            borderBottomColor: colors.border,
            backgroundColor: colors.card,
          },
        ]}
      >
        <View>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>
            Chat
          </Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            Signed in as{" "}
            <Text style={{ color: colors.primary }}>{username}</Text>
          </Text>
        </View>
        <View style={styles.statusChip}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusTxt, { color: statusColor }]}>
            {statusLabel}
          </Text>
        </View>
      </View>

      {/* Messages */}
      {messages.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Feather name="message-circle" size={40} color={colors.border} />
          <Text
            style={[styles.emptyTxt, { color: colors.mutedForeground }]}
          >
            {status === "connected"
              ? "No messages yet — say hello!"
              : "Connecting to chat…"}
          </Text>
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => String(m.id)}
          style={styles.msgListContainer}
          contentContainerStyle={[
            styles.msgList,
            { paddingBottom: bottomInset + 16 },
          ]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isSelf = item.username === username;
            return (
              <View style={[styles.msgRow, isSelf && styles.msgRowSelf]}>
                {!isSelf && (
                  <View
                    style={[
                      styles.avatar,
                      { backgroundColor: colors.primary + "33" },
                    ]}
                  >
                    <Text
                      style={[styles.avatarTxt, { color: colors.primary }]}
                    >
                      {item.username.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
                <View style={styles.msgBody}>
                  {!isSelf && (
                    <Text
                      style={[
                        styles.msgUser,
                        { color: colors.mutedForeground },
                      ]}
                    >
                      {item.username}
                    </Text>
                  )}
                  <View
                    style={[
                      styles.bubble,
                      {
                        backgroundColor:
                          item.username === username
                            ? colors.primary
                            : colors.card,
                        borderColor: isSelf
                          ? colors.primary
                          : colors.border,
                        alignSelf: isSelf ? "flex-end" : "flex-start",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.bubbleTxt,
                        {
                          color: isSelf ? "#fff" : colors.foreground,
                        },
                      ]}
                    >
                      {item.message}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.msgTime,
                      {
                        color: colors.mutedForeground,
                        textAlign: isSelf ? "right" : "left",
                      },
                    ]}
                  >
                    {formatTime(item.createdAt)}
                  </Text>
                </View>
              </View>
            );
          }}
        />
      )}

      {/* Input bar */}
      <View
        style={[
          styles.inputBar,
          {
            paddingBottom: bottomInset + 10,
            borderTopColor: colors.border,
            backgroundColor: colors.card,
          },
        ]}
      >
        <TextInput
          style={[
            styles.textInput,
            {
              backgroundColor: colors.secondary,
              borderColor: colors.border,
              color: colors.foreground,
            },
          ]}
          placeholder="Type a message…"
          placeholderTextColor={colors.mutedForeground}
          value={input}
          onChangeText={setInput}
          maxLength={MAX_MESSAGE}
          multiline
          returnKeyType="send"
          blurOnSubmit
          onSubmitEditing={sendMessage}
        />
        <Pressable
          style={[
            styles.sendBtn,
            {
              backgroundColor:
                input.trim() && status === "connected"
                  ? colors.primary
                  : colors.secondary,
            },
          ]}
          onPress={sendMessage}
          disabled={!input.trim() || status !== "connected"}
        >
          <Feather
            name="send"
            size={18}
            color={
              input.trim() && status === "connected"
                ? "#fff"
                : colors.mutedForeground
            }
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  // Username picker
  namePicker: {
    width: "100%",
    maxWidth: 340,
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    gap: 12,
    alignItems: "stretch",
  },
  nameTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
  },
  nameSub: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    marginBottom: 4,
  },
  nameInput: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
  nameBtn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
  nameBtnTxt: { fontSize: 15, fontFamily: "Inter_600SemiBold" },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 20, fontFamily: "Inter_700Bold" },
  headerSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 1 },
  statusChip: { flexDirection: "row", alignItems: "center", gap: 5 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusTxt: { fontSize: 12, fontFamily: "Inter_600SemiBold" },

  // Empty state
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  emptyTxt: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    maxWidth: 220,
  },

  // Messages
  msgListContainer: { flex: 1 },
  msgList: { paddingHorizontal: 12, paddingTop: 16, gap: 12 },
  msgRow: { flexDirection: "row", alignItems: "flex-end", gap: 8 },
  msgRowSelf: { flexDirection: "row-reverse" },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  avatarTxt: { fontSize: 13, fontFamily: "Inter_700Bold" },
  msgBody: { flex: 1, gap: 2 },
  msgUser: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    marginLeft: 4,
  },
  bubble: {
    maxWidth: "80%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
  },
  bubbleTxt: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
  msgTime: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    marginHorizontal: 4,
  },

  // Input
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  textInput: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    maxHeight: 100,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
});
