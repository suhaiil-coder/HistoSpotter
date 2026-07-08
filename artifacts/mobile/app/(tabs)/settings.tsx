import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

const TIME_OPTIONS = [15, 30, 60] as const;
const QUESTION_OPTIONS = [5, 10, 15, 20] as const;

function SegmentedControl<T extends number>({
  options,
  value,
  onChange,
  labelFn,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  labelFn?: (v: T) => string;
}) {
  const colors = useColors();
  return (
    <View style={[styles.segmented, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
      {options.map((opt) => {
        const active = opt === value;
        return (
          <Pressable
            key={opt}
            onPress={() => onChange(opt)}
            style={[styles.segment, active && { backgroundColor: colors.primary }]}
          >
            <Text
              style={[
                styles.segmentText,
                { color: active ? colors.primaryForeground : colors.mutedForeground },
              ]}
            >
              {labelFn ? labelFn(opt) : opt.toString()}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function SettingRow({ children }: { children: React.ReactNode }) {
  const colors = useColors();
  return (
    <View style={[styles.settingRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {children}
    </View>
  );
}

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { settings, updateSettings, resetStats, stats } = useApp();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [confirmReset, setConfirmReset] = useState(false);
  const topInset = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  const handleToggleTimer = (v: boolean) => {
    if (settings.hapticsEnabled) Haptics.selectionAsync();
    updateSettings({ timerEnabled: v });
  };

  const handleToggleHaptics = (v: boolean) => {
    if (v) Haptics.selectionAsync();
    updateSettings({ hapticsEnabled: v });
  };

  const handleReset = () => {
    if (Platform.OS === "web") {
      setConfirmReset(true);
      return;
    }
    Alert.alert(
      "Reset Statistics",
      "This will permanently erase all your quiz history and stats. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            if (settings.hapticsEnabled)
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            await resetStats();
          },
        },
      ]
    );
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: topInset + 16, paddingBottom: 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: colors.foreground }]}>Settings</Text>

        {user && (
          <>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>ACCOUNT</Text>
            <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.profileAvatar, { backgroundColor: colors.primary }]}>
                <Text style={styles.profileAvatarText}>
                  {user.displayName
                    .split(" ")
                    .map((w) => w[0] ?? "")
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={[styles.profileName, { color: colors.foreground }]}>
                  {user.displayName}
                </Text>
                <Text style={[styles.profileUsername, { color: colors.mutedForeground }]}>
                  @{user.username}
                </Text>
              </View>
            </View>
          </>
        )}

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>QUIZ</Text>

        <SettingRow>
          <View style={styles.settingHeader}>
            <Feather name="hash" size={18} color={colors.primary} />
            <Text style={[styles.settingTitle, { color: colors.foreground }]}>
              Questions per Quiz
            </Text>
          </View>
          <SegmentedControl
            options={QUESTION_OPTIONS}
            value={settings.questionsPerQuiz as typeof QUESTION_OPTIONS[number]}
            onChange={(v) => updateSettings({ questionsPerQuiz: v })}
          />
        </SettingRow>

        <SettingRow>
          <View style={styles.settingToggleRow}>
            <View style={styles.settingHeader}>
              <Feather name="clock" size={18} color={colors.primary} />
              <Text style={[styles.settingTitle, { color: colors.foreground }]}>Timer</Text>
            </View>
            <Switch
              value={settings.timerEnabled}
              onValueChange={handleToggleTimer}
              trackColor={{ false: colors.secondary, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </SettingRow>

        {settings.timerEnabled && (
          <SettingRow>
            <View style={styles.settingHeader}>
              <Feather name="activity" size={18} color={colors.primary} />
              <Text style={[styles.settingTitle, { color: colors.foreground }]}>
                Seconds per Question
              </Text>
            </View>
            <SegmentedControl
              options={TIME_OPTIONS}
              value={settings.timePerQuestion as typeof TIME_OPTIONS[number]}
              onChange={(v) => updateSettings({ timePerQuestion: v })}
              labelFn={(v) => `${v}s`}
            />
          </SettingRow>
        )}

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>FEEDBACK</Text>

        <SettingRow>
          <View style={styles.settingToggleRow}>
            <View style={styles.settingHeader}>
              <Feather name="zap" size={18} color={colors.primary} />
              <Text style={[styles.settingTitle, { color: colors.foreground }]}>Haptics</Text>
            </View>
            <Switch
              value={settings.hapticsEnabled}
              onValueChange={handleToggleHaptics}
              trackColor={{ false: colors.secondary, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </SettingRow>

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>DATA</Text>

        <View style={[styles.statsInfo, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.statsInfoRow}>
            <Text style={[styles.statsInfoLabel, { color: colors.mutedForeground }]}>Total Quizzes</Text>
            <Text style={[styles.statsInfoValue, { color: colors.foreground }]}>{stats.totalQuizzes}</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.statsInfoRow}>
            <Text style={[styles.statsInfoLabel, { color: colors.mutedForeground }]}>Total Questions</Text>
            <Text style={[styles.statsInfoValue, { color: colors.foreground }]}>{stats.totalQuestions}</Text>
          </View>
        </View>

        {confirmReset ? (
          <View style={[styles.confirmBox, { backgroundColor: colors.card, borderColor: colors.destructive }]}>
            <Text style={[styles.confirmText, { color: colors.foreground }]}>
              Erase all stats and history?
            </Text>
            <View style={styles.confirmButtons}>
              <Pressable
                onPress={() => setConfirmReset(false)}
                style={[styles.confirmBtn, { backgroundColor: colors.secondary }]}
              >
                <Text style={[styles.confirmBtnText, { color: colors.foreground }]}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={async () => {
                  setConfirmReset(false);
                  await resetStats();
                }}
                style={[styles.confirmBtn, { backgroundColor: colors.destructive }]}
              >
                <Text style={[styles.confirmBtnText, { color: "#FFFFFF" }]}>Reset</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Pressable
            onPress={handleReset}
            style={({ pressed }) => [
              styles.resetBtn,
              { backgroundColor: colors.card, borderColor: colors.destructive, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Feather name="trash-2" size={18} color={colors.destructive} />
            <Text style={[styles.resetBtnText, { color: colors.destructive }]}>
              Reset All Statistics
            </Text>
          </Pressable>
        )}

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>ABOUT</Text>
        <View style={[styles.aboutCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.aboutTitle, { color: colors.foreground }]}>
            Med<Text style={{ color: colors.primary }}>Spotter</Text>
          </Text>
          <Text style={[styles.aboutText, { color: colors.mutedForeground }]}>
            A histology quiz app with questions across multiple categories. Practice identifying tissue types and structures from microscopy slides.
          </Text>
          <Text style={[styles.version, { color: colors.mutedForeground }]}>Version 1.0.0</Text>
        </View>

        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [
            styles.logoutBtn,
            { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Feather name="log-out" size={18} color={colors.mutedForeground} />
          <Text style={[styles.logoutText, { color: colors.mutedForeground }]}>Sign Out</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20 },
  title: { fontFamily: "Inter_700Bold", fontSize: 28, marginBottom: 20 },

  sectionLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 16,
  },

  profileCard: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  profileAvatarText: {
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
    fontSize: 16,
  },
  profileInfo: { flex: 1 },
  profileName: { fontFamily: "Inter_600SemiBold", fontSize: 16 },
  profileUsername: { fontFamily: "Inter_400Regular", fontSize: 13, marginTop: 2 },

  settingRow: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    gap: 12,
  },
  settingHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  settingTitle: { fontFamily: "Inter_500Medium", fontSize: 15 },
  settingToggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  segmented: {
    flexDirection: "row",
    borderRadius: 10,
    padding: 3,
    borderWidth: 1,
  },
  segment: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: "center" },
  segmentText: { fontFamily: "Inter_600SemiBold", fontSize: 13 },

  statsInfo: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
  },
  statsInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  statsInfoLabel: { fontFamily: "Inter_400Regular", fontSize: 14 },
  statsInfoValue: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  divider: { height: 1, marginVertical: 8 },

  resetBtn: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 10,
  },
  resetBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 15 },

  confirmBox: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1.5,
    gap: 12,
  },
  confirmText: {
    fontFamily: "Inter_500Medium",
    fontSize: 15,
    textAlign: "center",
  },
  confirmButtons: { flexDirection: "row", gap: 10 },
  confirmBtn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  confirmBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 14 },

  aboutCard: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    gap: 8,
  },
  aboutTitle: { fontFamily: "Inter_700Bold", fontSize: 18 },
  aboutText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 19,
  },
  version: { fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 4 },

  logoutBtn: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 8,
    marginBottom: 10,
  },
  logoutText: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
});
