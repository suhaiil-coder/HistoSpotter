import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { QuizResult } from "@/context/AppContext";
import { ALL_QUESTIONS, imageMap } from "@/constants/questions";

export default function ReviewScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { resultsJson } = useLocalSearchParams<{ resultsJson: string }>();
  const { toggleBookmark, isBookmarked, settings } = useApp();
  const [filter, setFilter] = useState<"all" | "wrong" | "correct">("all");
  const topInset = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  const result: QuizResult | null = useMemo(() => {
    try {
      return resultsJson ? JSON.parse(resultsJson) : null;
    } catch {
      return null;
    }
  }, [resultsJson]);

  const reviewItems = useMemo(() => {
    if (!result) return [];
    return result.answers
      .map((a) => {
        const q = ALL_QUESTIONS.find((q) => q.id === a.questionId);
        return q ? { answer: a, question: q } : null;
      })
      .filter(Boolean)
      .filter((item) => {
        if (!item) return false;
        if (filter === "correct") return item.answer.correct;
        if (filter === "wrong") return !item.answer.correct;
        return true;
      }) as Array<{ answer: (typeof result.answers)[number]; question: (typeof ALL_QUESTIONS)[number] }>;
  }, [result, filter]);

  const handleBookmark = (id: string) => {
    if (settings.hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    toggleBookmark(id);
  };

  if (!result) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.foreground }}>No review data.</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={{ color: colors.primary, marginTop: 12 }}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: topInset + 16,
            paddingBottom: Platform.OS === "web" ? 100 : insets.bottom + 40,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Feather name="arrow-left" size={22} color={colors.foreground} />
          </Pressable>
          <Text style={[styles.title, { color: colors.foreground }]}>Review</Text>
          <View style={{ width: 22 }} />
        </View>

        {/* Score Summary */}
        <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryNum, { color: colors.success }]}>{result.score}</Text>
            <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Correct</Text>
          </View>
          <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryNum, { color: colors.destructive }]}>
              {result.total - result.score}
            </Text>
            <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Wrong</Text>
          </View>
          <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryNum, { color: colors.primary }]}>
              {Math.round((result.score / result.total) * 100)}%
            </Text>
            <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Score</Text>
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={[styles.filterRow, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          {(["all", "correct", "wrong"] as const).map((f) => (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              style={[
                styles.filterTab,
                filter === f && { backgroundColor: colors.primary },
              ]}
            >
              <Text
                style={[
                  styles.filterTabText,
                  { color: filter === f ? "#FFFFFF" : colors.mutedForeground },
                ]}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Questions */}
        {reviewItems.map(({ answer, question }, i) => {
          const bookmarked = isBookmarked(question.id);
          const timeout = answer.selectedIndex === -1;
          return (
            <View
              key={question.id}
              style={[
                styles.questionCard,
                {
                  backgroundColor: colors.card,
                  borderColor: answer.correct ? colors.success + "66" : colors.destructive + "66",
                },
              ]}
            >
              {/* Card Header */}
              <View style={styles.cardHeader}>
                <View
                  style={[
                    styles.resultBadge,
                    {
                      backgroundColor: answer.correct
                        ? colors.success + "22"
                        : colors.destructive + "22",
                    },
                  ]}
                >
                  <Feather
                    name={answer.correct ? "check" : "x"}
                    size={14}
                    color={answer.correct ? colors.success : colors.destructive}
                  />
                  <Text
                    style={[
                      styles.resultBadgeText,
                      { color: answer.correct ? colors.success : colors.destructive },
                    ]}
                  >
                    {answer.correct ? "Correct" : timeout ? "Timed Out" : "Wrong"}
                  </Text>
                </View>
                <Pressable onPress={() => handleBookmark(question.id)} hitSlop={8}>
                  <Feather
                    name="bookmark"
                    size={20}
                    color={bookmarked ? colors.primary : colors.mutedForeground}
                  />
                </Pressable>
              </View>

              {/* Image */}
              <Image
                source={imageMap[question.imageKey]}
                style={styles.questionImage}
                contentFit="cover"
              />

              {/* Question Text */}
              <Text style={[styles.questionText, { color: colors.foreground }]}>
                {question.question}
              </Text>

              {/* Options */}
              {question.options.map((opt, optIndex) => {
                const isCorrect = optIndex === question.correctIndex;
                const isSelected = optIndex === answer.selectedIndex;
                let bgColor = "transparent";
                let borderColor = colors.border;
                let textColor = colors.mutedForeground;

                if (isCorrect) {
                  bgColor = colors.success + "22";
                  borderColor = colors.success;
                  textColor = colors.success;
                } else if (isSelected && !isCorrect) {
                  bgColor = colors.destructive + "22";
                  borderColor = colors.destructive;
                  textColor = colors.destructive;
                }

                return (
                  <View
                    key={optIndex}
                    style={[
                      styles.option,
                      { backgroundColor: bgColor, borderColor },
                    ]}
                  >
                    <View style={[styles.optionLetterWrap, { backgroundColor: colors.secondary }]}>
                      <Text style={[styles.optionLetter, { color: colors.mutedForeground }]}>
                        {String.fromCharCode(65 + optIndex)}
                      </Text>
                    </View>
                    <Text style={[styles.optionText, { color: textColor }]}>{opt}</Text>
                    {isCorrect && (
                      <Feather name="check-circle" size={16} color={colors.success} />
                    )}
                    {isSelected && !isCorrect && (
                      <Feather name="x-circle" size={16} color={colors.destructive} />
                    )}
                  </View>
                );
              })}

              {/* Explanation */}
              <View style={[styles.explanation, { backgroundColor: colors.muted }]}>
                <Text style={[styles.explanationLabel, { color: colors.primary }]}>
                  Explanation
                </Text>
                <Text style={[styles.explanationText, { color: colors.mutedForeground }]}>
                  {question.explanation}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  scroll: { paddingHorizontal: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
  },
  summaryCard: {
    flexDirection: "row",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryNum: {
    fontFamily: "Inter_700Bold",
    fontSize: 24,
  },
  summaryLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    height: "100%",
  },
  filterRow: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 3,
    marginBottom: 16,
    borderWidth: 1,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 9,
    alignItems: "center",
  },
  filterTabText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
  },
  questionCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    gap: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resultBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  resultBadgeText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
  },
  questionImage: {
    width: "100%",
    height: 160,
    borderRadius: 12,
  },
  questionText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    lineHeight: 22,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
  },
  optionLetterWrap: {
    width: 26,
    height: 26,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  optionLetter: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
  },
  optionText: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 18,
  },
  explanation: {
    borderRadius: 10,
    padding: 12,
    gap: 4,
  },
  explanationLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    letterSpacing: 0.5,
  },
  explanationText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 19,
  },
});
