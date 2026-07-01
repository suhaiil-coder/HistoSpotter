import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { CATEGORIES } from "@/constants/questions";

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: string;
  color: string;
}) {
  const colors = useColors();
  return (
    <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.iconWrap, { backgroundColor: color + "22" }]}>
        <Feather name={icon as any} size={20} color={color} />
      </View>
      <Text style={[styles.statValue, { color: colors.foreground }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

export default function StatsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { stats, quizHistory } = useApp();
  const topInset = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  const accuracy =
    stats.totalQuestions > 0
      ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100)
      : 0;

  const hasData = stats.totalQuizzes > 0;

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
        <Text style={[styles.title, { color: colors.foreground }]}>Statistics</Text>

        {!hasData ? (
          <View style={styles.emptyWrap}>
            <Feather name="bar-chart-2" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No Data Yet</Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Complete a quiz to see your stats here.
            </Text>
          </View>
        ) : (
          <>
            {/* Overview Cards */}
            <View style={styles.grid}>
              <StatCard
                icon="zap"
                label="Quizzes"
                value={stats.totalQuizzes.toString()}
                color={colors.primary}
              />
              <StatCard
                icon="check-circle"
                label="Accuracy"
                value={`${accuracy}%`}
                color={colors.success}
              />
              <StatCard
                icon="award"
                label="Best Score"
                value={`${stats.bestScore}%`}
                color={colors.warning}
              />
              <StatCard
                icon="hash"
                label="Questions"
                value={stats.totalQuestions.toString()}
                color={colors.accent}
              />
            </View>

            {/* Category Breakdown */}
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Category Breakdown
            </Text>
            {CATEGORIES.map((cat) => {
              const catStat = stats.categoryStats[cat];
              const pct = catStat && catStat.total > 0 ? catStat.correct / catStat.total : 0;
              const pctDisplay = catStat ? Math.round(pct * 100) : 0;
              const barColor = pct >= 0.7 ? colors.success : pct >= 0.4 ? colors.warning : colors.destructive;
              return (
                <View
                  key={cat}
                  style={[styles.catRow, { backgroundColor: colors.card, borderColor: colors.border }]}
                >
                  <View style={styles.catInfo}>
                    <Text style={[styles.catName, { color: colors.foreground }]}>{cat}</Text>
                    <Text style={[styles.catDetail, { color: colors.mutedForeground }]}>
                      {catStat ? `${catStat.correct}/${catStat.total} correct` : "No data"}
                    </Text>
                  </View>
                  <View style={styles.barSection}>
                    <View style={[styles.barBg, { backgroundColor: colors.secondary }]}>
                      <View
                        style={[
                          styles.barFill,
                          { backgroundColor: barColor, width: `${pct * 100}%` as any },
                        ]}
                      />
                    </View>
                    <Text style={[styles.pctLabel, { color: catStat ? barColor : colors.mutedForeground }]}>
                      {catStat ? `${pctDisplay}%` : "—"}
                    </Text>
                  </View>
                </View>
              );
            })}

            {/* Recent History */}
            {quizHistory.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                  Recent Quizzes
                </Text>
                {quizHistory.slice(0, 5).map((result, i) => {
                  const pct = Math.round((result.score / result.total) * 100);
                  const date = new Date(result.date);
                  const dateStr = date.toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  });
                  const barColor = pct >= 70 ? colors.success : pct >= 40 ? colors.warning : colors.destructive;
                  return (
                    <View
                      key={result.id}
                      style={[styles.historyRow, { backgroundColor: colors.card, borderColor: colors.border }]}
                    >
                      <View style={[styles.historyIndex, { backgroundColor: colors.secondary }]}>
                        <Text style={[styles.historyIndexText, { color: colors.mutedForeground }]}>
                          {i + 1}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <View style={styles.historyMeta}>
                          <Text style={[styles.historyScore, { color: colors.foreground }]}>
                            {result.score}/{result.total}
                          </Text>
                          <Text style={[styles.historyDate, { color: colors.mutedForeground }]}>
                            {dateStr}
                          </Text>
                        </View>
                        <View style={[styles.barBg, { backgroundColor: colors.secondary, marginTop: 6 }]}>
                          <View
                            style={[styles.barFill, { backgroundColor: barColor, width: `${pct}%` as any }]}
                          />
                        </View>
                      </View>
                      <Text style={[styles.historyPct, { color: barColor }]}>{pct}%</Text>
                    </View>
                  );
                })}
              </>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20 },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 28,
    marginBottom: 20,
  },
  emptyWrap: {
    alignItems: "center",
    marginTop: 60,
    gap: 12,
  },
  emptyTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 20,
  },
  emptyText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    width: "47%",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    gap: 6,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  statValue: {
    fontFamily: "Inter_700Bold",
    fontSize: 24,
  },
  statLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
  },
  sectionTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    marginBottom: 12,
  },
  catRow: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
  },
  catInfo: { marginBottom: 8 },
  catName: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
  },
  catDetail: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    marginTop: 2,
  },
  barSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  barBg: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  barFill: {
    height: 6,
    borderRadius: 3,
  },
  pctLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    width: 36,
    textAlign: "right",
  },
  historyRow: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  historyIndex: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  historyIndexText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
  },
  historyMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  historyScore: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
  historyDate: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
  },
  historyPct: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    width: 44,
    textAlign: "right",
  },
});
