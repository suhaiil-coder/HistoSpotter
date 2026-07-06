import { Feather } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useChatIdentity } from "@/hooks/useChatIdentity";
import { useColors } from "@/hooks/useColors";

const MAX_USERNAME = 20;
const MAX_MESSAGE = 400;
const INPUT_BAR_HEIGHT = 68; // approximate height of the input bar

// WhatsApp-style stable colors for sender names.
const NAME_COLORS = [
  "#A855F7",
  "#22D3EE",
  "#F472B6",
  "#34D399",
  "#FBBF24",
  "#60A5FA",
  "#FB7185",
  "#4ADE80",
  "#C084FC",
  "#F59E0B",
];

function colorForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  return NAME_COLORS[Math.abs(hash) % NAME_COLORS.length];
}

interface ChatMsg {
  id: number;
  username: string;
  message: string;
  createdAt: string;
  senderId?: string;
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

  const { ready, senderId, username, setGuestName } = useChatIdentity();
  const { setUnreadChatCount } = useApp();

  const [nameInput, setNameInput] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<ConnStatus>("idle");
  const [connecting, setConnecting] = useState(false);
  const isFocusedRef = useRef(true);

  const wsRef = useRef<WebSocket | null>(null);
  const listRef = useRef<FlatList<ChatMsg>>(null);
  const inputRef = useRef<TextInput>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const connect = useCallback((name: string) => {
    const domain =
      process.env.EXPO_PUBLIC_DOMAIN ||
      (Platform.OS === "web" ? location.host : undefined);
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
    setConnecting(true);
    ws.onopen = () => {
      setStatus("connected");
      setConnecting(false);
    };
    ws.onclose = () => {
      setStatus("disconnected");
      setConnecting(false);
      reconnectTimer.current = setTimeout(() => connect(name), 4000);
    };
    ws.onerror = () => {
      setStatus("disconnected");
      setConnecting(false);
    };
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data as string) as
          | { type: "history"; messages: ChatMsg[] }
          | { type: "message"; message: ChatMsg }
          | { type: "delete"; id: number };
        if (data.type === "history") {
          setMessages(data.messages);
          setTimeout(
            () => listRef.current?.scrollToEnd({ animated: false }),
            100,
          );
        } else if (data.type === "message") {
          setMessages((prev) => [...prev, data.message]);
          setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 80);
          // Increment unread if not focused and not from self
          if (!isFocusedRef.current && data.message.senderId !== senderId) {
            setUnreadChatCount((prev) => prev + 1);
          }
        } else if (data.type === "delete") {
          setMessages((prev) => prev.filter((m) => m.id !== data.id));
        }
      } catch {
        // ignore malformed frames
      }
    };
  }, [senderId, setUnreadChatCount]);

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

  // Track when chat is focused to clear unread badge
  useFocusEffect(
    useCallback(() => {
      isFocusedRef.current = true;
      setUnreadChatCount(0);
      return () => {
        isFocusedRef.current = false;
      };
    }, [setUnreadChatCount]),
  );

  const saveGuestName = useCallback(() => {
    const trimmed = nameInput.trim().slice(0, MAX_USERNAME);
    if (!trimmed) return;
    void setGuestName(trimmed);
  }, [nameInput, setGuestName]);

  const sendMessage = useCallback(() => {
    const text = input.trim();
    if (!text || !username || !senderId || wsRef.current?.readyState !== 1)
      return;
    wsRef.current.send(JSON.stringify({ username, message: text, senderId }));
    setInput("");
  }, [input, username, senderId]);

  const unsend = useCallback(
    (id: number) => {
      if (!senderId || wsRef.current?.readyState !== 1) return;
      wsRef.current.send(JSON.stringify({ type: "delete", id, senderId }));
    },
    [senderId],
  );

  const confirmUnsend = useCallback(
    (id: number) => {
      if (isWeb) {
        if (window.confirm("Unsend this message for everyone?")) unsend(id);
        return;
      }
      Alert.alert("Unsend message", "Delete this message for everyone?", [
        { text: "Cancel", style: "cancel" },
        { text: "Unsend", style: "destructive", onPress: () => unsend(id) },
      ]);
    },
    [isWeb, unsend],
  );

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

  // ── Loading identity ──────────────────────────────────────────────
  if (!ready || connecting) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background, alignItems: "center", justifyContent: "center", gap: 16 }]}>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_400Regular", fontSize: 14 }}>
          Connecting to chat…
        </Text>
      </View>
    );
  }

  // ── Guest name picker ────────────────────────────────────────────────
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
            Pick a display name to jump in
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
            onSubmitEditing={saveGuestName}
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
            onPress={saveGuestName}
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

  // ── Chat room ──────────────────────────────────────────────────
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
        <View style={styles.headerLeft}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>
            Chat
          </Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            <Text style={{ color: colors.primary }}>{username}</Text>
          </Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusTxt, { color: statusColor }]}>
              {statusLabel}
            </Text>
          </View>
        </View>
      </View>

      {/* Messages — tap anywhere to focus the input */}
      <TouchableWithoutFeedback onPress={() => inputRef.current?.focus()}>
        <View style={{ flex: 1 }}>
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
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: msgBottomPad },
          ]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isSelf = item.senderId
              ? item.senderId === senderId
              : item.username === username;
            const canUnsend = !!senderId && item.senderId === senderId;
            const nameColor = colorForName(item.username);
            return (
              <View style={[styles.msgRow, isSelf && styles.msgRowSelf]}>
                {!isSelf ? (
                  <View
                    style={[
                      styles.avatar,
                      { backgroundColor: nameColor + "26" },
                    ]}
                  >
                    <Text style={[styles.avatarTxt, { color: nameColor }]}>
                      {item.username.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.avatarSpacer} />
                )}

                <View style={[styles.msgBody, isSelf && styles.msgBodySelf]}>
                  {!isSelf && (
                    <Text style={[styles.senderName, { color: nameColor }]}>
                      {item.username}
                    </Text>
                  )}
                  <Pressable
                    onLongPress={
                      canUnsend ? () => confirmUnsend(item.id) : undefined
                    }
                    delayLongPress={350}
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
                  </Pressable>
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
                    {canUnsend ? " · hold to unsend" : ""}
                  </Text>
                </View>
              </View>
            );
          }}
        />
      )}
        </View>
      </TouchableWithoutFeedback>

      {/* Input bar */}
      <View
        style={[
          styles.inputBar,
          {
            borderTopColor: colors.border,
            backgroundColor: colors.card,
            paddingBottom: isWeb ? 10 : bottomInset + 10,
          },
          isWeb && {
            position: "absolute",
            bottom: webKbOffset,
            left: 0,
            right: 0,
          },
        ]}
      >
        <TextInput
          ref={inputRef}
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
        />
        <Pressable
          onPress={sendMessage}
          disabled={!input.trim()}
          style={[
            styles.sendBtn,
            {
              backgroundColor: input.trim()
                ? colors.primary
                : colors.secondary,
              opacity: input.trim() ? 1 : 0.5,
            },
          ]}
        >
          <Feather
            name="send"
            size={18}
            color={input.trim() ? "#fff" : colors.mutedForeground}
          />
        </Pressable>
      </View>
    </View>
  );

  return isWeb ? (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={0}
      style={{ flex: 1 }}
    >
      {content}
    </KeyboardAvoidingView>
  ) : (
    content
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  namePicker: {
    margin: 24,
    marginTop: "30%",
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    gap: 14,
  },
  nameTitle: { fontFamily: "Inter_700Bold", fontSize: 22, textAlign: "center" },
  nameSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 4,
  },
  nameInput: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontFamily: "Inter_500Medium",
    fontSize: 15,
  },
  nameBtn: {
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  nameBtnTxt: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  headerLeft: { gap: 2 },
  headerTitle: { fontFamily: "Inter_700Bold", fontSize: 20 },
  headerSub: { fontFamily: "Inter_400Regular", fontSize: 13 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusTxt: { fontFamily: "Inter_600SemiBold", fontSize: 12 },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  emptyTxt: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    textAlign: "center",
  },
  list: { flex: 1 },
  listContent: { paddingHorizontal: 16, paddingTop: 12, gap: 8 },
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
  avatarSpacer: { width: 32 },
  avatarTxt: { fontFamily: "Inter_700Bold", fontSize: 13 },
  msgBody: { maxWidth: "78%", gap: 2 },
  msgBodySelf: { alignItems: "flex-end" },
  senderName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    marginBottom: 2,
  },
  bubble: { borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10 },
  bubbleSelf: { borderBottomRightRadius: 4 },
  bubbleOther: { borderWidth: 1, borderBottomLeftRadius: 4 },
  bubbleTxt: { fontFamily: "Inter_400Regular", fontSize: 15, lineHeight: 21 },
  timestamp: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    marginTop: 2,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  textInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    lineHeight: 20,
    textAlignVertical: "center",
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
