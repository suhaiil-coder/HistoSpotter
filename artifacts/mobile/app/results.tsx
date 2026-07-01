import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { QuizResult } from "@/context/AppContext";

export default function ResultsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { resultsJson } = useLocalSearchParams<{ resultsJson: string }>();
  const topInset = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  const result: QuizResult | null = useMemo(() => {
    try {
      return resultsJson ? JSON.parse(resultsJson) : null;
    } catch {
      return null;
    }
  }, [resultsJson]);

  if (!result) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.foreground }}>No results found.</Text>
        <Pressable onPress={() => router.replace("/(tabs)")} style={{ marginTop: 16 }}>
          <Text style={{ color: colors.primary }}>Go Home</Text>
        </Pressable>
      </View>
    );
  }

  const pct = Math.round((result.score / result.total) * 100);
  const grade = pct >= 90 ? "A" : pct >= 80 ? "B" : pct >= 70 ? "C" : pct >= 60 ? "D" : "F";
  const message =
    pct >= 90 ? "Excellent work!" : pct >= 70 ? "Good job!" : pct >= 50 ? "Keep practicing!" : "Keep studying!";

  const gradeColor = pct >= 70 ? colors.success : pct >= 50 ? colors.warning : colors.destructive;

  const categoryBreakdown: Record<string, { correct: number; total: number }> = {};
  for (const a of result.answers) {
    if (!categoryBreakdown[a.category]) categoryBreakdown[a.category] = { correct: 0, total: 0 };
    categoryBreakdown[a.category].total += 1;
    if (a.correct) categoryBreakdown[a.category].correct += 1;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: topInset + 20,
            paddingBottom: Platform.OS === "web" ? 100 : insets.bottom + 40,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Score Hero */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={["#7C3AED33", "#0D0D1A"]}
            style={styles.heroGradient}
          >
            <View style={[styles.gradeCircle, { borderColor: gradeColor }]}>
              <Text style={[styles.gradeText, { color: gradeColor }]}>{grade}</Text>
            </View>
            <Text style={[styles.pctText, { color: colors.foreground }]}>{pct}%</Text>
            <Text style={[styles.messageText, { color: colors.mutedForeground }]}>{message}</Text>
            <View style={styles.scoreRow}>
              <View style={[styles.scorePill, { backgroundColor: colors.success + "22" }]}>
                <Feather name="check" size={16} color={colors.success} />
                <Text style={[styles.scorePillText, { color: colors.success }]}>
                  {result.score} correct
                </Text>
              </View>
              <View style={[styles.scorePill, { backgroundColor: colors.destructive + "22" }]}>
                <Feather name="x" size={16} color={colors.destructive} />
                <Text style={[styles.scorePillText, { color: colors.destructive }]}>
                  {result.total - result.score} wrong
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Category Breakdown */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>By Category</Text>
        {Object.entries(categoryBreakdown).map(([cat, data]) => {
          const catPct = Math.round((data.correct / data.total) * 100);
          const barColor = catPct >= 70 ? colors.success : catPct >= 40 ? colors.warning : colors.destructive;
          return (
            <View
              key={cat}
              style={[styles.catCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={styles.catHeader}>
                <Text style={[styles.catName, { color: colors.foreground }]}>{cat}</Text>
                <Text style={[styles.catScore, { color: barColor }]}>
                  {data.correct}/{data.total}
                </Text>
              </View>
              <View style={[styles.barBg, { backgroundColor: colors.secondary }]}>
                <View style={[styles.barFill, { backgroundColor: barColor, width: `${catPct}%` as any }]} />
              </View>
            </View>
          );
        })}

        {/* Q by Q summary */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Question Summary</Text>
        <View style={[styles.summaryGrid, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {result.answers.map((a, i) => (
            <View
              key={i}
              style={[
                styles.summaryDot,
                {
                  backgroundColor: a.correct ? colors.success : a.selectedIndex === -1 ? colors.border : colors.destructive,
                },
              ]}
            >
              <Text style={styles.summaryDotText}>{i + 1}</Text>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Pressable
            onPress={() =>
              router.push({ pathname: "/review", params: { resultsJson } })
            }
            style={({ pressed }) => [
              styles.secondaryBtn,
              { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Feather name="eye" size={18} color={colors.primary} />
            <Text style={[styles.secondaryBtnText, { color: colors.primary }]}>Review Answers</Text>
          </Pressable>

          <Pressable
            onPress={() => router.replace("/quiz")}
            style={({ pressed }) => [
              styles.primaryBtnWrap,
              { opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <LinearGradient
              colors={["#7C3AED", "#A855F7"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryBtn}
            >
              <Feather name="refresh-cw" size={18} color="#FFFFFF" />
              <Text style={styles.primaryBtnText}>Try Again</Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            onPress={() => router.replace("/(tabs)")}
            style={({ pressed }) => [
              styles.homeBtn,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Text style={[styles.homeBtnText, { color: colors.mutedForeground }]}>Back to Home</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  scroll: { paddingHorizontal: 20 },
  heroSection: {
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 24,
  },
  heroGradient: {
    padding: 32,
    alignItems: "center",
    gap: 8,
  },
  gradeCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  gradeText: {
    fontFamily: "Inter_700Bold",
    fontSize: 36,
  },
  pctText: {
    fontFamily: "Inter_700Bold",
    fontSize: 48,
    lineHeight: 52,
  },
  messageText: {
    fontFamily: "Inter_500Medium",
    fontSize: 16,
    marginBottom: 12,
  },
  scoreRow: {
    flexDirection: "row",
    gap: 12,
  },
  scorePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  scorePillText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
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
  catHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  catName: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
  },
  catScore: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
  barBg: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  barFill: {
    height: 6,
    borderRadius: 3,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    padding: 16,
    borderRadius: 14,
    marginBottom: 24,
    borderWidth: 1,
  },
  summaryDot: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryDotText: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    color: "#FFFFFF",
  },
  actions: { gap: 12, marginBottom: 16 },
  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
  },
  secondaryBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
  },
  primaryBtnWrap: {
    borderRadius: 14,
    overflow: "hidden",
  },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 18,
  },
  primaryBtnText: {
    fontFamily: "Inter_700Bold",
    fontSize: 17,
    color: "#FFFFFF",
  },
  homeBtn: { alignItems: "center", padding: 8 },
  homeBtnText: {
    fontFamily: "Inter_500Medium",
    fontSize: 15,
  },
});
