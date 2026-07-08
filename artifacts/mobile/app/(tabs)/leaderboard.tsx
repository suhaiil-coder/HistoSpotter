import { Feather } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

function formatTime(minutes: number): string {
  if (minutes < 1) return "< 1 min";
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const AVATAR_COLORS = [
  "#7C3AED", "#2563EB", "#059669", "#D97706",
  "#DC2626", "#7C3AED", "#0891B2", "#9333EA",
];

function avatarColor(username: string): string {
  let h = 0;
  for (let i = 0; i < username.length; i++) {
    h = (Math.imul(31, h) + username.charCodeAt(i)) | 0;
  }
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

function MedalIcon({ rank }: { rank: number }) {
  if (rank === 1) return <Text style={styles.medal}>🥇</Text>;
  if (rank === 2) return <Text style={styles.medal}>🥈</Text>;
  if (rank === 3) return <Text style={styles.medal}>🥉</Text>;
  return (
    <View style={styles.rankBadge}>
      <Text style={styles.rankText}>{rank}</Text>
    </View>
  );
}

export default function LeaderboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { allUsers, user, refreshUsers } = useAuth();

  useFocusEffect(
    useCallback(() => {
      refreshUsers();
    }, [refreshUsers])
  );

  const sorted = [...allUsers].sort((a, b) => b.totalMinutes - a.totalMinutes);
  const topInset = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: topInset + 16, paddingBottom: 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.title, { color: colors.foreground }]}>Leaderboard</Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              Ranked by time in app
            </Text>
          </View>
          <View style={[styles.trophyCircle, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={styles.trophyEmoji}>🏆</Text>
          </View>
        </View>

        {sorted.length === 0 && (
          <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="users" size={32} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No entries yet</Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Spend time in the app to appear here.
            </Text>
          </View>
        )}

        {sorted.map((u, idx) => {
          const rank = idx + 1;
          const isMe = user?.username === u.username;
          const color = avatarColor(u.username);

          return (
            <View
              key={u.username}
              style={[
                styles.row,
                {
                  backgroundColor: isMe ? "#1E1040" : colors.card,
                  borderColor: isMe ? colors.primary : colors.border,
                  borderWidth: isMe ? 1.5 : 1,
                },
              ]}
            >
              <View style={styles.rankCol}>
                <MedalIcon rank={rank} />
              </View>

              <View style={[styles.avatar, { backgroundColor: color }]}>
                <Text style={styles.avatarText}>{getInitials(u.displayName)}</Text>
              </View>

              <View style={styles.nameCol}>
                <View style={styles.nameRow}>
                  <Text style={[styles.displayName, { color: colors.foreground }]}>
                    {u.displayName}
                  </Text>
                  {isMe && (
                    <View style={[styles.youBadge, { backgroundColor: colors.primary }]}>
                      <Text style={styles.youText}>You</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.username, { color: colors.mutedForeground }]}>
                  @{u.username}
                </Text>
              </View>

              <View style={styles.timeCol}>
                <Text style={[styles.timeValue, { color: isMe ? "#A855F7" : colors.foreground }]}>
                  {formatTime(u.totalMinutes)}
                </Text>
                <Text style={[styles.timeLabel, { color: colors.mutedForeground }]}>
                  time spent
                </Text>
              </View>
            </View>
          );
        })}

        {user && (
          <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="info" size={14} color={colors.mutedForeground} />
            <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
              Time updates every minute while you use the app.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20 },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 28,
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    marginTop: 2,
  },
  trophyCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  trophyEmoji: { fontSize: 22 },

  emptyCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 32,
    alignItems: "center",
    gap: 10,
    marginTop: 16,
  },
  emptyTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
  },
  emptyText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    textAlign: "center",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  rankCol: { width: 32, alignItems: "center" },
  medal: { fontSize: 22 },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#252540",
    alignItems: "center",
    justifyContent: "center",
  },
  rankText: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
    color: "#9090B0",
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
    fontSize: 14,
  },

  nameCol: { flex: 1, gap: 2 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  displayName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
  },
  youBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  youText: {
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
    fontSize: 10,
  },
  username: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
  },

  timeCol: { alignItems: "flex-end", gap: 2 },
  timeValue: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
  },
  timeLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
  },

  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    marginTop: 4,
  },
  infoText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    flex: 1,
  },
});
