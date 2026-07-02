import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import React, { useCallback, useMemo, useRef, useState } from "react";
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
import { Feather } from "@expo/vector-icons";

import { useColors } from "@/hooks/useColors";
import { ALL_SLIDES, SLIDE_CATEGORIES, slideImageMap, type Slide } from "@/constants/slides";

type SessionState = "idle" | "spotting" | "done";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const CATEGORY_COLORS: Record<string, string> = {
  Muscle: "#EF4444",
  Vascular: "#F59E0B",
  "Connective Tissue": "#8B5CF6",
  Nervous: "#06B6D4",
  Integumentary: "#EC4899",
  Lymphoid: "#10B981",
  GIT: "#F97316",
  Reproductive: "#E879F9",
  Urinary: "#3B82F6",
  Respiratory: "#14B8A6",
  Endocrine: "#A78BFA",
  "Special Senses": "#FBBF24",
};

export default function SpotterScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topInset = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sessionState, setSessionState] = useState<SessionState>("idle");
  const [deck, setDeck] = useState<Slide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [missed, setMissed] = useState(0);
  const [missedSlides, setMissedSlides] = useState<Slide[]>([]);

  const revealAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;

  const filteredSlides = useMemo(() =>
    selectedCategory === "All"
      ? ALL_SLIDES
      : ALL_SLIDES.filter((s) => s.category === selectedCategory),
    [selectedCategory]
  );

  const startSession = useCallback(() => {
    const shuffled = shuffle(filteredSlides);
    setDeck(shuffled);
    setCurrentIndex(0);
    setRevealed(false);
    setCorrect(0);
    setMissed(0);
    setMissedSlides([]);
    revealAnim.setValue(0);
    cardAnim.setValue(0);
    setSessionState("spotting");
  }, [filteredSlides]);

  const revealAnswer = useCallback(() => {
    setRevealed(true);
    Animated.spring(revealAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 60,
      friction: 8,
    }).start();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [revealAnim]);

  const advance = useCallback((gotIt: boolean) => {
    const slide = deck[currentIndex];
    if (gotIt) {
      setCorrect((c) => c + 1);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      setMissed((m) => m + 1);
      setMissedSlides((prev) => [...prev, slide]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    const next = currentIndex + 1;
    if (next >= deck.length) {
      setSessionState("done");
      return;
    }

    Animated.timing(cardAnim, {
      toValue: gotIt ? 1 : -1,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      cardAnim.setValue(0);
      revealAnim.setValue(0);
      setRevealed(false);
      setCurrentIndex(next);
    });
  }, [currentIndex, deck, cardAnim, revealAnim]);

  const restartMissed = useCallback(() => {
    if (missedSlides.length === 0) {
      setSessionState("idle");
      return;
    }
    setDeck(shuffle(missedSlides));
    setCurrentIndex(0);
    setRevealed(false);
    setCorrect(0);
    setMissed(0);
    setMissedSlides([]);
    revealAnim.setValue(0);
    cardAnim.setValue(0);
    setSessionState("spotting");
  }, [missedSlides]);

  const currentSlide = deck[currentIndex];
  const total = deck.length;
  const progress = total > 0 ? currentIndex / total : 0;

  const cardTranslateX = cardAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-400, 0, 400],
  });
  const cardOpacity = cardAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 1, 0],
  });

  const revealTranslateY = revealAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  if (sessionState === "done") {
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.doneWrap, { paddingTop: topInset + 24, paddingBottom: insets.bottom + 24 }]}>
          <LinearGradient
            colors={["#7C3AED22", "#0D0D1A"]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.doneScore}>
            <Text style={[styles.donePct, { color: pct >= 70 ? colors.success : colors.destructive }]}>
              {pct}%
            </Text>
            <Text style={[styles.doneLabel, { color: colors.foreground }]}>
              {correct} / {total} identified
            </Text>
          </View>

          <View style={styles.doneStats}>
            <View style={[styles.doneStatBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Feather name="check-circle" size={22} color={colors.success} />
              <Text style={[styles.doneStatNum, { color: colors.success }]}>{correct}</Text>
              <Text style={[styles.doneStatTxt, { color: colors.mutedForeground }]}>Got it</Text>
            </View>
            <View style={[styles.doneStatBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Feather name="x-circle" size={22} color={colors.destructive} />
              <Text style={[styles.doneStatNum, { color: colors.destructive }]}>{missed}</Text>
              <Text style={[styles.doneStatTxt, { color: colors.mutedForeground }]}>Missed</Text>
            </View>
          </View>

          {missedSlides.length > 0 && (
            <View style={[styles.missedList, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.missedTitle, { color: colors.mutedForeground }]}>MISSED SLIDES</Text>
              {missedSlides.map((s) => (
                <View key={s.key} style={styles.missedRow}>
                  <View style={[styles.catDot, { backgroundColor: CATEGORY_COLORS[s.category] ?? colors.primary }]} />
                  <Text style={[styles.missedName, { color: colors.foreground }]}>{s.name}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.doneActions}>
            {missedSlides.length > 0 && (
              <Pressable
                style={[styles.btn, { backgroundColor: colors.secondary, borderColor: colors.border }]}
                onPress={restartMissed}
              >
                <Feather name="refresh-cw" size={16} color={colors.foreground} style={{ marginRight: 8 }} />
                <Text style={[styles.btnTxt, { color: colors.foreground }]}>Practise Missed ({missed})</Text>
              </Pressable>
            )}
            <Pressable
              style={[styles.btn, { backgroundColor: colors.primary }]}
              onPress={() => setSessionState("idle")}
            >
              <Feather name="home" size={16} color="#fff" style={{ marginRight: 8 }} />
              <Text style={[styles.btnTxt, { color: "#fff" }]}>Back to Spotter</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  if (sessionState === "spotting" && currentSlide) {
    const catColor = CATEGORY_COLORS[currentSlide.category] ?? colors.primary;
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Top bar */}
        <View style={[styles.spotTopBar, { paddingTop: topInset + 8 }]}>
          <Pressable onPress={() => setSessionState("idle")} style={styles.spotBack}>
            <Feather name="x" size={20} color={colors.mutedForeground} />
          </Pressable>
          <View style={styles.spotProgressWrap}>
            <View style={[styles.spotProgressTrack, { backgroundColor: colors.secondary }]}>
              <View style={[styles.spotProgressFill, { backgroundColor: colors.primary, width: `${progress * 100}%` }]} />
            </View>
            <Text style={[styles.spotCount, { color: colors.mutedForeground }]}>
              {currentIndex + 1} / {total}
            </Text>
          </View>
          <View style={styles.spotScoreChip}>
            <Text style={[styles.spotScoreCorrect, { color: colors.success }]}>{correct}</Text>
            <Text style={[styles.spotScoreSep, { color: colors.mutedForeground }]}>/</Text>
            <Text style={[styles.spotScoreMissed, { color: colors.destructive }]}>{missed}</Text>
          </View>
        </View>

        {/* Card */}
        <Animated.View
          style={[
            styles.spotCard,
            { opacity: cardOpacity, transform: [{ translateX: cardTranslateX }] },
          ]}
        >
          <Image
            source={slideImageMap[currentSlide.key]}
            style={styles.spotImage}
            contentFit="contain"
          />
        </Animated.View>

        {/* Bottom area */}
        <View style={[styles.spotBottom, { paddingBottom: insets.bottom + 16 }]}>
          {!revealed ? (
            <Pressable
              style={[styles.revealBtn, { backgroundColor: colors.primary }]}
              onPress={revealAnswer}
            >
              <Feather name="eye" size={18} color="#fff" style={{ marginRight: 10 }} />
              <Text style={styles.revealTxt}>Reveal Answer</Text>
            </Pressable>
          ) : (
            <Animated.View
              style={[
                styles.answerBox,
                { backgroundColor: colors.card, borderColor: colors.border,
                  opacity: revealAnim,
                  transform: [{ translateY: revealTranslateY }] },
              ]}
            >
              <View style={[styles.catBadge, { backgroundColor: catColor + "22" }]}>
                <View style={[styles.catDot, { backgroundColor: catColor }]} />
                <Text style={[styles.catTxt, { color: catColor }]}>{currentSlide.category}</Text>
              </View>
              <Text style={[styles.answerName, { color: colors.foreground }]}>{currentSlide.name}</Text>
              <View style={styles.answerActions}>
                <Pressable
                  style={[styles.missedBtn, { backgroundColor: "#EF444422", borderColor: "#EF4444" }]}
                  onPress={() => advance(false)}
                >
                  <Feather name="x" size={20} color="#EF4444" />
                  <Text style={[styles.actionTxt, { color: "#EF4444" }]}>Missed</Text>
                </Pressable>
                <Pressable
                  style={[styles.gotItBtn, { backgroundColor: "#10B98122", borderColor: "#10B981" }]}
                  onPress={() => advance(true)}
                >
                  <Feather name="check" size={20} color="#10B981" />
                  <Text style={[styles.actionTxt, { color: "#10B981" }]}>Got it!</Text>
                </Pressable>
              </View>
            </Animated.View>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[styles.idleScroll, { paddingTop: topInset + 16, paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground }]}>
            Spot<Text style={{ color: colors.primary }}>ter</Text>
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Identify the histology slide
          </Text>
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="info" size={15} color={colors.mutedForeground} style={{ marginRight: 8 }} />
          <Text style={[styles.infoTxt, { color: colors.mutedForeground }]}>
            A slide is shown — try to name it, then reveal the answer and mark yourself.
          </Text>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>FILTER BY CATEGORY</Text>
        <View style={styles.catGrid}>
          {SLIDE_CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            const accent = cat === "All" ? colors.primary : (CATEGORY_COLORS[cat] ?? colors.primary);
            return (
              <Pressable
                key={cat}
                onPress={() => {
                  setSelectedCategory(cat);
                  Haptics.selectionAsync();
                }}
                style={[
                  styles.catChip,
                  {
                    backgroundColor: active ? accent + "22" : colors.secondary,
                    borderColor: active ? accent : colors.border,
                  },
                ]}
              >
                <Text style={[styles.catChipTxt, { color: active ? accent : colors.mutedForeground }]}>
                  {cat}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={[styles.startCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.startCardCount, { color: colors.foreground }]}>
            {filteredSlides.length} slides
          </Text>
          <Text style={[styles.startCardSub, { color: colors.mutedForeground }]}>
            {selectedCategory === "All" ? "All categories" : selectedCategory}
          </Text>
          <Pressable
            style={[styles.startBtn, { backgroundColor: colors.primary }]}
            onPress={startSession}
          >
            <LinearGradient
              colors={[colors.accent, colors.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.startBtnGrad}
            >
              <Feather name="play" size={18} color="#fff" style={{ marginRight: 10 }} />
              <Text style={styles.startBtnTxt}>Start Spotter</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  idleScroll: { paddingHorizontal: 20 },
  header: { marginBottom: 20 },
  title: { fontSize: 34, fontFamily: "Inter_700Bold", letterSpacing: -1 },
  subtitle: { fontSize: 14, fontFamily: "Inter_400Regular", marginTop: 4 },
  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 24,
  },
  infoTxt: { fontSize: 13, fontFamily: "Inter_400Regular", flex: 1, lineHeight: 20 },
  sectionLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 1, marginBottom: 12 },
  catGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 28 },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  catChipTxt: { fontSize: 13, fontFamily: "Inter_500Medium" },
  startCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    alignItems: "center",
    gap: 4,
  },
  startCardCount: { fontSize: 40, fontFamily: "Inter_700Bold" },
  startCardSub: { fontSize: 14, fontFamily: "Inter_400Regular", marginBottom: 16 },
  startBtn: { width: "100%", borderRadius: 14, overflow: "hidden" },
  startBtnGrad: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 16 },
  startBtnTxt: { color: "#fff", fontSize: 16, fontFamily: "Inter_600SemiBold" },

  spotTopBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },
  spotBack: { padding: 4 },
  spotProgressWrap: { flex: 1, gap: 4 },
  spotProgressTrack: { height: 4, borderRadius: 2, overflow: "hidden" },
  spotProgressFill: { height: 4, borderRadius: 2 },
  spotCount: { fontSize: 11, fontFamily: "Inter_500Medium" },
  spotScoreChip: { flexDirection: "row", alignItems: "center", gap: 2 },
  spotScoreCorrect: { fontSize: 15, fontFamily: "Inter_700Bold" },
  spotScoreSep: { fontSize: 13, fontFamily: "Inter_400Regular" },
  spotScoreMissed: { fontSize: 15, fontFamily: "Inter_700Bold" },

  spotCard: {
    flex: 1,
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  spotImage: { width: "100%", height: "100%" },

  spotBottom: { paddingHorizontal: 16, paddingTop: 16 },
  revealBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 14,
  },
  revealTxt: { color: "#fff", fontSize: 16, fontFamily: "Inter_600SemiBold" },

  answerBox: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  catBadge: { flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  catDot: { width: 7, height: 7, borderRadius: 4 },
  catTxt: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  answerName: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  answerActions: { flexDirection: "row", gap: 10, marginTop: 4 },
  missedBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  gotItBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  actionTxt: { fontSize: 15, fontFamily: "Inter_600SemiBold" },

  doneWrap: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 20,
    overflow: "hidden",
  },
  doneScore: { alignItems: "center", gap: 6 },
  donePct: { fontSize: 72, fontFamily: "Inter_700Bold", letterSpacing: -2 },
  doneLabel: { fontSize: 18, fontFamily: "Inter_500Medium" },
  doneStats: { flexDirection: "row", gap: 12 },
  doneStatBox: {
    flex: 1,
    alignItems: "center",
    gap: 6,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  doneStatNum: { fontSize: 28, fontFamily: "Inter_700Bold" },
  doneStatTxt: { fontSize: 13, fontFamily: "Inter_400Regular" },
  missedList: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 10,
    maxHeight: 220,
  },
  missedTitle: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 1 },
  missedRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  missedName: { fontSize: 14, fontFamily: "Inter_500Medium" },
  doneActions: { gap: 10 },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  btnTxt: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
});
