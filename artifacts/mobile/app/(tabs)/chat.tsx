import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
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
const INPUT_BAR_HEIGHT = 68; // approximate height of the input bar

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

/** On mobile browsers, the keyboard overlaps content — detect how much. */
function useWebKeyboardOffset(): number {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    if (Platform.OS !== "web") return;
    const vv = (window as Window & { visualViewport?: VisualViewport })
      .visualViewport;
    if (!vv) return;
    const update = () => {
      const hidden = window.innerHeight - vv.height - vv.offsetTop;
      setOffset(Math.max(0, Math.round(hidden)));
    };
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
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
  const isWeb = Platform.OS === "web";

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
        // ignore malformed frames
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
      ? "#22C55E"
      : status === "connecting"
        ? "#F59E0B"
        : "#EF4444";
  const statusLabel =
    status === "connected"
      ? "Live"
      : status === "connecting"
        ? "Connecting…"
        : "Offline";

  // ── Username picker ──────────────────────────────────────────────────
  if (!username) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
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
                { color: nameInput.trim() ? "#fff" : colors.mutedForeground },
              ]}
            >
              Enter Chat
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // ── Chat room ────────────────────────────────────────────────────────
  // On web: input bar is absolutely positioned so the flex layout can't
  // push it off screen, and it lifts above the keyboard via webKbOffset.
  // On native: use KeyboardAvoidingView + normal flow layout.
  const msgBottomPad = isWeb
    ? INPUT_BAR_HEIGHT + webKbOffset + 8
    : bottomInset + 16;

  const content = (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
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
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusTxt, { color: statusColor }]}>
            {statusLabel}
          </Text>
        </View>
      </View>

      {/* Messages */}
      {messages.length === 0 ? (
        <View style={[styles.empty, { paddingBottom: msgBottomPad }]}>
          <Feather name="message-circle" size={40} color={colors.border} />
          <Text style={[styles.emptyTxt, { color: colors.mutedForeground }]}>
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
          style={styles.list}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: msgBottomPad },
          ]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isSelf = item.username === username;
            return (
              <View style={[styles.msgRow, isSelf && styles.msgRowSelf]}>
                {!isSelf ? (
                  <View
                    style={[
                      styles.avatar,
                      { backgroundColor: colors.primary + "26" },
                    ]}
                  >
                    <Text style={[styles.avatarTxt, { color: colors.primary }]}>
                      {item.username.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.avatarSpacer} />
                )}

                <View style={[styles.msgBody, isSelf && styles.msgBodySelf]}>
                  {!isSelf && (
                    <Text style={[styles.senderName, { color: colors.primary }]}>
                      {item.username}
                    </Text>
                  )}
                  <View
                    style={[
                      styles.bubble,
                      isSelf
                        ? [styles.bubbleSelf, { backgroundColor: colors.primary }]
                        : [
                            styles.bubbleOther,
                            {
                              backgroundColor: colors.card,
                              borderColor: colors.border,
                            },
                          ],
                    ]}
                  >
                    <Text
                      style={[
                        styles.bubbleTxt,
                        { color: isSelf ? "#fff" : colors.foreground },
                      ]}
                    >
                      {item.message}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.timestamp,
                      {
                        color: colors.mutedForeground,
                        textAlign: isSelf ? "right" : "left",
                      },
                    ]}
                  >
                    {isSelf ? "You · " : ""}
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
            borderTopColor: colors.border,
            backgroundColor: colors.card,
            paddingBottom: isWeb ? 10 : bottomInset + 10,
          },
          // On web: absolute so it can't be pushed off-screen by content,
          // and shifts upward by the keyboard height.
          isWeb && {
            position: "absolute",
            bottom: webKbOffset,
            left: 0,
            right: 0,
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

  // Native: wrap with KeyboardAvoidingView so input rises above keyboard
  if (!isWeb) {
    return (
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {content}
      </KeyboardAvoidingView>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  kav: { flex: 1 },
  screen: { flex: 1 },

  // Username picker
  namePicker: {
    width: "100%",
    maxWidth: 340,
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    gap: 12,
    alignItems: "stretch",
    alignSelf: "center",
    marginTop: "auto",
    marginBottom: "auto",
  },
  nameTitle: { fontSize: 22, fontFamily: "Inter_700Bold", textAlign: "center" },
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
  statusRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusTxt: { fontSize: 12, fontFamily: "Inter_600SemiBold" },

  // Empty
  empty: {
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
  list: { flex: 1 },
  listContent: { paddingHorizontal: 12, paddingTop: 16, gap: 16 },
  msgRow: { flexDirection: "row", alignItems: "flex-end", gap: 8 },
  msgRowSelf: { flexDirection: "row-reverse" },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    flexShrink: 0,
  },
  avatarSpacer: { width: 34, flexShrink: 0 },
  avatarTxt: { fontSize: 13, fontFamily: "Inter_700Bold" },
  msgBody: { flex: 1, gap: 3, alignItems: "flex-start" },
  msgBodySelf: { alignItems: "flex-end" },
  senderName: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    marginLeft: 4,
    marginBottom: 2,
  },
  bubble: {
    maxWidth: "82%",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleSelf: {
    borderRadius: 18,
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  bubbleTxt: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 20 },
  timestamp: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    marginHorizontal: 4,
    marginTop: 1,
  },

  // Input bar
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
    minHeight: 44,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
});
