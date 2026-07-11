import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
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
import { NEURO_QUESTIONS } from "@/constants/neuroQuestions";
import { NEURO_IMAGES } from "@/constants/neuroImages";

const TOTAL = NEURO_QUESTIONS.length;
const LABELS = ["A", "B", "C", "D", "E", "F"];

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

export default function NeuroQuizScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topInset = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(12)).current;

  const question = NEURO_QUESTIONS[index];

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
            Neuroanatomy
          </Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            Spotters · Identify & Describe
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
        {/* Specimen image */}
        <View
          style={[
            styles.imageWrap,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Image
            source={NEURO_IMAGES[question.id]}
            style={styles.specimenImage}
            contentFit="cover"
            transition={200}
          />

          {/* Spotter badge */}
          <View style={[styles.specimenBadge, { backgroundColor: "rgba(0,0,0,0.55)" }]}>
            <Text style={styles.specimenLabel}>SPOTTER</Text>
            <Text style={styles.specimenNum}>{question.spotter}</Text>
          </View>

          {/* Structure name tag — shown after reveal */}
          {revealed && (
            <View style={[styles.structureTag, { backgroundColor: colors.primary }]}>
              <Feather name="check-circle" size={13} color="#fff" />
              <Text style={styles.structureTagTxt}>{question.structureName}</Text>
            </View>
          )}
        </View>

        {/* Question card */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardTitleRow}>
            <Feather name="help-circle" size={16} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>
              Question{question.questions.length > 1 ? "s" : ""}
            </Text>
          </View>

          {question.questions.map((q, i) => (
            <View key={i} style={styles.questionItem}>
              <Text style={[styles.questionLabel, { color: colors.primary }]}>
                {LABELS[i]})
              </Text>
              <Text style={[styles.questionTxt, { color: colors.foreground }]}>{q}</Text>
            </View>
          ))}
        </View>

        {/* Show Answer / Answer card */}
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

              {question.answers.map((ans, i) => (
                <AnswerSection
                  key={i}
                  label={`${LABELS[i]}) ${question.questions[i]}`}
                  content={ans}
                  colors={colors}
                />
              ))}

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
          {Array.from({ length: TOTAL }).map((_, i) => (
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
          <Text
            style={[
              styles.navBtnTxt,
              { color: index === TOTAL - 1 ? colors.foreground : "#fff" },
            ]}
          >
            Next
          </Text>
          <Feather
            name="arrow-right"
            size={18}
            color={index === TOTAL - 1 ? colors.foreground : "#fff"}
          />
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

  imageWrap: {
    borderRadius: 20,
    borderWidth: 1,
    height: 260,
    overflow: "hidden",
    position: "relative",
  },
  specimenImage: {
    width: "100%",
    height: "100%",
  },
  specimenBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  specimenLabel: { fontSize: 9, fontFamily: "Inter_700Bold", letterSpacing: 1.2, color: "#fff" },
  specimenNum: { fontSize: 13, fontFamily: "Inter_700Bold", color: "#fff" },
  structureTag: {
    position: "absolute",
    bottom: 12,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  structureTagTxt: { fontSize: 13, fontFamily: "Inter_700Bold", color: "#fff" },

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
  questionLabel: { fontSize: 14, fontFamily: "Inter_700Bold", minWidth: 22, paddingTop: 1 },
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
