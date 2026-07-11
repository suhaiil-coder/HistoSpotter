import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { CATEGORIES } from "@/constants/questions";
import DrawerMenu from "@/components/DrawerMenu";

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { stats, settings, quizHistory } = useApp();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const lastQuiz = quizHistory[0];
  const accuracy =
    stats.totalQuestions > 0
      ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100)
      : 0;

  const topInset = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: topInset + 16,
            paddingBottom: Platform.OS === "web" ? 100 : 100,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          {/* Hamburger */}
          <Pressable
            onPress={() => setDrawerOpen(true)}
            style={({ pressed }) => [
              styles.menuBtn,
              { backgroundColor: colors.card, borderColor: colors.border },
              pressed && { opacity: 0.7 },
            ]}
            hitSlop={8}
          >
            <Feather name="menu" size={20} color={colors.foreground} />
          </Pressable>

          <View style={{ flex: 1 }}>
            <Text style={[styles.appTitle, { color: colors.foreground }]}>
              Med<Text style={{ color: colors.primary }}>Spotter</Text>
            </Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              Histology Quiz
            </Text>
          </View>
        </View>

        {/* Last Quiz Card */}
        {lastQuiz ? (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.cardLabel, { color: colors.mutedForeground }]}>LAST QUIZ</Text>
            <View style={styles.lastQuizRow}>
              <View>
                <Text style={[styles.scoreText, { color: colors.foreground }]}>
                  {lastQuiz.score}/{lastQuiz.total}
                </Text>
                <Text style={[styles.scorePct, { color: colors.primary }]}>
                  {Math.round((lastQuiz.score / lastQuiz.total) * 100)}% correct
                </Text>
              </View>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/review",
                    params: { resultsJson: JSON.stringify(lastQuiz) },
                  })
                }
                style={[styles.reviewBtn, { borderColor: colors.primary }]}
              >
                <Text style={[styles.reviewBtnText, { color: colors.primary }]}>Review</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.cardLabel, { color: colors.mutedForeground }]}>WELCOME</Text>
            <Text style={[styles.welcomeText, { color: colors.foreground }]}>
              Test your knowledge of histology slides. Start a quiz to begin!
            </Text>
          </View>
        )}

        {/* Overall Stats Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statPill, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statPillNum, { color: colors.primary }]}>
              {stats.totalQuizzes}
            </Text>
            <Text style={[styles.statPillLabel, { color: colors.mutedForeground }]}>Quizzes</Text>
          </View>
          <View style={[styles.statPill, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statPillNum, { color: colors.primary }]}>
              {accuracy}%
            </Text>
            <Text style={[styles.statPillLabel, { color: colors.mutedForeground }]}>Accuracy</Text>
          </View>
          <View style={[styles.statPill, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statPillNum, { color: colors.primary }]}>
              {stats.bestScore}%
            </Text>
            <Text style={[styles.statPillLabel, { color: colors.mutedForeground }]}>Best</Text>
          </View>
        </View>

        {/* Category Progress */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Categories</Text>
        {CATEGORIES.map((cat) => {
          const catStat = stats.categoryStats[cat];
          const pct = catStat && catStat.total > 0 ? catStat.correct / catStat.total : 0;
          return (
            <View
              key={cat}
              style={[styles.catCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={styles.catRow}>
                <Text style={[styles.catName, { color: colors.foreground }]}>{cat}</Text>
                <Text style={[styles.catPct, { color: catStat ? colors.primary : colors.mutedForeground }]}>
                  {catStat ? `${catStat.correct}/${catStat.total}` : "Not started"}
                </Text>
              </View>
              <View style={[styles.barBg, { backgroundColor: colors.secondary }]}>
                <View
                  style={[
                    styles.barFill,
                    { backgroundColor: colors.primary, width: `${pct * 100}%` as any },
                  ]}
                />
              </View>
            </View>
          );
        })}

        {/* Quiz Settings Summary */}
        <View style={[styles.settingsSummary, { backgroundColor: colors.muted, borderColor: colors.border }]}>
          <Text style={[styles.settingsLabel, { color: colors.mutedForeground }]}>
            {settings.questionsPerQuiz} questions
            {settings.timerEnabled ? `  •  ${settings.timePerQuestion}s per question` : "  •  No timer"}
          </Text>
        </View>
      </ScrollView>

      {/* Start Quiz Button — fixed at bottom */}
      <View
        style={[
          styles.startBtnContainer,
          {
            paddingBottom: Platform.OS === "web" ? 100 : insets.bottom + 90,
            paddingHorizontal: 24,
          },
        ]}
      >
        <Pressable
          onPress={() => router.push("/quiz")}
          style={({ pressed }) => [
            styles.startBtn,
            { opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <LinearGradient
            colors={["#7C3AED", "#A855F7"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.startBtnGradient}
          >
            <Text style={styles.startBtnText}>Start Quiz</Text>
          </LinearGradient>
        </Pressable>
      </View>

      {/* Slide-out drawer — rendered last so it sits on top */}
      <DrawerMenu
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSelect={(id) => {
          if (id === "head-neck" || id === "charts-quiz") {
            router.push("/head-neck-quiz");
          } else if (id === "upper-limb") {
            router.push("/upper-limb-quiz");
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20 },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 20,
  },
  menuBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  appTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 32,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    marginTop: 2,
  },

  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  cardLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  lastQuizRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  scoreText: {
    fontFamily: "Inter_700Bold",
    fontSize: 28,
  },
  scorePct: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    marginTop: 2,
  },
  reviewBtn: {
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  reviewBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
  welcomeText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  statPill: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  statPillNum: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
  },
  statPillLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    marginTop: 2,
  },
  sectionTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    marginBottom: 12,
  },
  catCard: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
  },
  catRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  catName: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
  },
  catPct: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
  },
  barBg: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  barFill: {
    height: 4,
    borderRadius: 2,
  },
  settingsSummary: {
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    marginTop: 4,
    marginBottom: 16,
    borderWidth: 1,
  },
  settingsLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
  },
  startBtnContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  startBtn: {
    borderRadius: 16,
    overflow: "hidden",
  },
  startBtnGradient: {
    paddingVertical: 18,
    alignItems: "center",
  },
  startBtnText: {
    fontFamily: "Inter_700Bold",
    fontSize: 17,
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
});
