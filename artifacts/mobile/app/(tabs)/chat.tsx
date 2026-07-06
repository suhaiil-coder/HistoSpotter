import { Feather } from "@expo/vector-icons";
import { useAuth } from "@clerk/expo";
import { useFocusEffect, useRouter } from "expo-router";
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
  const router = useRouter();
  const topInset = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const bottomInset = insets.bottom || 0;
  const webKbOffset = useWebKeyboardOffset();
  const isWeb = Platform.OS === "web";

  const { ready, senderId, username, isSignedIn, setGuestName } =
    useChatIdentity();
  const { signOut, getToken } = useAuth();
  const { setUnreadChatCount } = useApp();

  // Keep latest auth accessors available to the WS onopen closure.
  const authRef = useRef<{
    isSignedIn: boolean;
    getToken: () => Promise<string | null>;
  }>({ isSignedIn: false, getToken: async () => null });
  authRef.current = { isSignedIn: !!isSignedIn, getToken };

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
      // Prove Clerk identity to the server so `clerk:` senderIds are trusted.
      if (authRef.current.isSignedIn) {
        authRef.current
          .getToken()
          .then((token) => {
            if (token && ws.readyState === 1) {
              ws.send(JSON.stringify({ type: "auth", token }));
            }
          })
          .catch(() => {
            // token unavailable — continue without verified identity
          });
      }
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

  const handleSignOut = useCallback(() => {
    const doSignOut = () => void signOut();
    if (isWeb) {
      if (window.confirm("Sign out of your account?")) doSignOut();
      return;
    }
    Alert.alert("Sign out", "Sign out of your account?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign out", style: "destructive", onPress: doSignOut },
    ]);
  }, [isWeb, signOut]);

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

  // ── Loading identity ─────────────────────────────────────────────────
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

  // ── Guest name picker (only for signed-out users w/o a name) ──────────
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
            Pick a display name to jump in as a guest
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
              Enter as Guest
            </Text>
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerTxt, { color: colors.mutedForeground }]}>
              or
            </Text>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
          </View>

          <Pressable
            style={[styles.signInBtn, { borderColor: colors.border }]}
            onPress={() => router.push("/(auth)/sign-in")}
          >
            <Feather name="log-in" size={16} color={colors.primary} />
            <Text style={[styles.signInBtnTxt, { color: colors.primary }]}>
              Sign in for a real identity
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // ── Chat room ────────────────────────────────────────────────────────
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
            {isSignedIn ? "Signed in as " : "Guest · "}
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
          {isSignedIn ? (
            <Pressable
              style={[styles.accountBtn, { borderColor: colors.border }]}
              onPress={handleSignOut}
              hitSlop={8}
            >
              <Feather name="log-out" size={16} color={colors.mutedForeground} />
            </Pressable>
          ) : (
            <Pressable
              style={[styles.accountBtn, { borderColor: colors.border }]}
              onPress={() => router.push("/(auth)/sign-in")}
              hitSlop={8}
            >
              <Feather name="log-in" size={16} color={colors.primary} />
            </Pressable>
          )}
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

  // Native: keyboard-controller's KeyboardAvoidingView lifts input smoothly.
  if (!isWeb) {
    return (
      <KeyboardAvoidingView style={styles.kav} behavior="padding">
        {content}
      </KeyboardAvoidingView>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  kav: { flex: 1 },
  screen: { flex: 1 },

  // Guest picker
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
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 4,
  },
  divider: { flex: 1, height: 1 },
  dividerTxt: { fontSize: 12, fontFamily: "Inter_500Medium" },
  signInBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 13,
  },
  signInBtnTxt: { fontSize: 14, fontFamily: "Inter_600SemiBold" },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerLeft: { flexShrink: 1 },
  headerTitle: { fontSize: 20, fontFamily: "Inter_700Bold" },
  headerSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 1 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusTxt: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  accountBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

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
