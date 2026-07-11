import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { UPPER_LIMB_QUESTIONS } from "@/constants/upperLimbQuiz";

const TOTAL = UPPER_LIMB_QUESTIONS.length;

const STRUCTURE_ICONS: Record<string, keyof typeof Feather.glyphMap> = {
  muscle: "activity",
  artery: "heart",
  nerve: "zap",
  vein: "droplet",
  space: "maximize",
  retinaculum: "grid",
};

function getIcon(structureName: string): keyof typeof Feather.glyphMap {
  const lower = structureName.toLowerCase();
  if (lower.includes("artery") || lower.includes("arch") || lower.includes("vascular")) return "heart";
  if (lower.includes("nerve")) return "zap";
  if (lower.includes("space")) return "maximize";
  if (lower.includes("retinaculum")) return "grid";
  return "activity";
}

const ACCENT_COLORS = [
  "#7C65FA", "#EF4444", "#F59E0B", "#06B6D4",
  "#10B981", "#F97316", "#E879F9", "#3B82F6",
];

function getAccent(id: number) {
  return ACCENT_COLORS[id % ACCENT_COLORS.length];
}

function AnswerSection({
  label,
  content,
  colors,
}: {
  label: string;
  content: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={answerStyles.block}>
      <View style={[answerStyles.labelRow, { backgroundColor: colors.primary + "1A" }]}>
        <View style={[answerStyles.labelDot, { backgroundColor: colors.primary }]} />
        <Text style={[answerStyles.label, { color: colors.primary }]}>{label}</Text>
      </View>
      <Text style={[answerStyles.body, { color: colors.foreground }]}>{content}</Text>
    </View>
  );
}

const answerStyles = StyleSheet.create({
  block: { marginBottom: 12 },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 8,
  },
  labelDot: { width: 6, height: 6, borderRadius: 3 },
  label: { fontSize: 12, fontFamily: "Inter_700Bold", letterSpacing: 0.5 },
  body: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22, paddingHorizontal: 4 },
});

export default function UpperLimbQuizScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topInset = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(12)).current;

  const question = UPPER_LIMB_QUESTIONS[index];
  const accent = getAccent(question.id);
  const icon = getIcon(question.structureName);

  const revealAnswer = () => {
    setRevealed(true);
    fadeAnim.setValue(0);
    slideAnim.setValue(12);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 320,
        useNativeDriver: Platform.OS !== "web",
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        damping: 18,
        stiffness: 160,
        useNativeDriver: Platform.OS !== "web",
      }),
    ]).start();
  };

  const navigate = (dir: 1 | -1) => {
    const next = index + dir;
    if (next < 0 || next >= TOTAL) return;
    setIndex(next);
    setRevealed(false);
    fadeAnim.setValue(0);
    slideAnim.setValue(0);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* ── Header ── */}
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
        <Pressable
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.secondary }]}
          hitSlop={8}
        >
          <Feather name="arrow-left" size={18} color={colors.foreground} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>
            Upper Limb
          </Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            Gross Anatomy · Spotters
          </Text>
        </View>
        <View style={[styles.progressBadge, { backgroundColor: colors.primary + "22" }]}>
          <Text style={[styles.progressTxt, { color: colors.primary }]}>
            {index + 1} / {TOTAL}
          </Text>
        </View>
      </View>

      {/* ── Progress bar ── */}
      <View style={[styles.progressBarBg, { backgroundColor: colors.secondary }]}>
        <View
          style={[
            styles.progressBarFill,
            {
              backgroundColor: colors.primary,
              width: `${((index + 1) / TOTAL) * 100}%` as any,
            },
          ]}
        />
      </View>

      {/* ── Scrollable content ── */}
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Specimen placeholder card */}
        <View
          style={[
            styles.specimenCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          {/* Top accent line */}
          <View style={[styles.specimenAccentLine, { backgroundColor: accent }]} />

          <View style={styles.specimenBody}>
            {/* Icon circle */}
            <View style={[styles.specimenIconCircle, { backgroundColor: accent + "20" }]}>
              <Feather name={icon} size={40} color={accent} />
            </View>

            {/* Spotter badge + name */}
            <View style={styles.specimenInfo}>
              <View style={[styles.spotterBadge, { backgroundColor: accent + "20" }]}>
                <Text style={[styles.spotterBadgeTxt, { color: accent }]}>
                  SPOTTER {question.spotter}
                </Text>
              </View>
              {revealed && (
                <View style={[styles.structureRevealRow]}>
                  <Feather name="check-circle" size={14} color={accent} />
                  <Text style={[styles.structureRevealTxt, { color: accent }]}>
                    {question.structureName}
                  </Text>
                </View>
              )}
              <Text style={[styles.specimenHint, { color: colors.mutedForeground }]}>
                {revealed ? "Structure identified" : "Gross anatomy specimen"}
              </Text>
            </View>
          </View>

          {/* Grid decoration */}
          <View style={styles.gridDeco} pointerEvents="none">
            {Array.from({ length: 24 }).map((_, i) => (
              <View
                key={i}
                style={[styles.gridDot, { backgroundColor: accent + "18" }]}
              />
            ))}
          </View>
        </View>

        {/* Question card */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardTitleRow}>
            <Feather name="help-circle" size={16} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>Question</Text>
          </View>

          <View style={styles.questionItem}>
            <Text style={[styles.questionLabel, { color: colors.primary }]}>A)</Text>
            <Text style={[styles.questionTxt, { color: colors.foreground }]}>
              {question.questionA}
            </Text>
          </View>
          <View style={styles.questionItem}>
            <Text style={[styles.questionLabel, { color: colors.primary }]}>B)</Text>
            <Text style={[styles.questionTxt, { color: colors.foreground }]}>
              {question.questionB}
            </Text>
          </View>
        </View>

        {/* Show Answer button / Answer card */}
        {!revealed ? (
          <Pressable
            onPress={revealAnswer}
            style={({ pressed }) => [
              styles.showBtn,
              { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Feather name="eye" size={18} color="#fff" />
            <Text style={styles.showBtnTxt}>Show Answer</Text>
          </Pressable>
        ) : (
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <View
              style={[
                styles.card,
                styles.answerCard,
                { backgroundColor: colors.card, borderColor: colors.primary + "55" },
              ]}
            >
              <View style={styles.cardTitleRow}>
                <Feather name="check-circle" size={16} color={colors.primary} />
                <Text style={[styles.cardTitle, { color: colors.foreground }]}>Answer</Text>
              </View>

              <AnswerSection
                label="A) Structure"
                content={question.answerA}
                colors={colors}
              />
              <AnswerSection
                label="B) Details"
                content={question.answerB}
                colors={colors}
              />

              <Pressable
                onPress={() => setRevealed(false)}
                style={[styles.hideBtn, { borderColor: colors.border }]}
              >
                <Feather name="eye-off" size={14} color={colors.mutedForeground} />
                <Text style={[styles.hideBtnTxt, { color: colors.mutedForeground }]}>
                  Hide answer
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        )}
      </ScrollView>

      {/* ── Navigation footer ── */}
      <View
        style={[
          styles.footer,
          {
            paddingBottom: Platform.OS === "web" ? 100 : insets.bottom + 16,
            borderTopColor: colors.border,
            backgroundColor: colors.card,
          },
        ]}
      >
        <Pressable
          onPress={() => navigate(-1)}
          disabled={index === 0}
          style={({ pressed }) => [
            styles.navBtn,
            { backgroundColor: colors.secondary, opacity: index === 0 ? 0.35 : pressed ? 0.7 : 1 },
          ]}
        >
          <Feather name="arrow-left" size={18} color={colors.foreground} />
          <Text style={[styles.navBtnTxt, { color: colors.foreground }]}>Previous</Text>
        </Pressable>

        <View style={styles.dotRow}>
          {Array.from({ length: Math.min(TOTAL, 30) }).map((_, i) => (
            <Pressable key={i} onPress={() => { setIndex(i); setRevealed(false); }}>
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor: i === index ? colors.primary : colors.border,
                    width: i === index ? 16 : 6,
                  },
                ]}
              />
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={() => navigate(1)}
          disabled={index === TOTAL - 1}
          style={({ pressed }) => [
            styles.navBtn,
            styles.navBtnRight,
            {
              backgroundColor: index === TOTAL - 1 ? colors.secondary : colors.primary,
              opacity: index === TOTAL - 1 ? 0.35 : pressed ? 0.85 : 1,
            },
          ]}
        >
          <Text style={[styles.navBtnTxt, { color: index === TOTAL - 1 ? colors.foreground : "#fff" }]}>
            Next
          </Text>
          <Feather name="arrow-right" size={18} color={index === TOTAL - 1 ? colors.foreground : "#fff"} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  headerSub: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 1 },
  progressBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  progressTxt: { fontSize: 12, fontFamily: "Inter_700Bold" },

  progressBarBg: { height: 3 },
  progressBarFill: { height: 3 },

  scroll: { paddingHorizontal: 16, paddingTop: 16, gap: 14 },

  // Specimen card
  specimenCard: {
    borderRadius: 20,
    borderWidth: 1,
    height: 200,
    overflow: "hidden",
    position: "relative",
  },
  specimenAccentLine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  specimenBody: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    gap: 20,
    paddingTop: 4,
  },
  specimenIconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  specimenInfo: { flex: 1, gap: 8 },
  spotterBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  spotterBadgeTxt: {
    fontFamily: "Inter_700Bold",
    fontSize: 11,
    letterSpacing: 1.2,
  },
  structureRevealRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  structureRevealTxt: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
  },
  specimenHint: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
  },
  gridDeco: {
    position: "absolute",
    bottom: 12,
    right: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    width: 72,
    gap: 4,
  },
  gridDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },

  // Cards
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  answerCard: { borderWidth: 1.5 },
  cardTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  cardTitle: { fontSize: 15, fontFamily: "Inter_700Bold" },

  questionItem: { flexDirection: "row", gap: 8, alignItems: "flex-start" },
  questionLabel: { fontSize: 14, fontFamily: "Inter_700Bold", minWidth: 20, paddingTop: 1 },
  questionTxt: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },

  showBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 16,
  },
  showBtnTxt: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#fff" },
  hideBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 4,
  },
  hideBtnTxt: { fontSize: 13, fontFamily: "Inter_400Regular" },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    gap: 8,
  },
  navBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  navBtnRight: { flexDirection: "row-reverse" },
  navBtnTxt: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  dotRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    flexWrap: "wrap",
  },
  dot: { height: 6, borderRadius: 3 },
});
