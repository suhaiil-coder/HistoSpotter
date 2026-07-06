import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { useColors } from "@/hooks/useColors";
import { ALL_SLIDES, SLIDE_CATEGORIES, slideFeaturesMap, slideImageMap, type Slide } from "@/constants/slides";
import { playCorrect, playTick, playTimeout, playWarning, playWrong } from "@/lib/sound";

type SessionState = "idle" | "spotting" | "done";
type TimerDuration = 0 | 30 | 60;

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

const TIMER_OPTIONS: { label: string; value: TimerDuration }[] = [
  { label: "Off", value: 0 },
  { label: "30s", value: 30 },
  { label: "1 min", value: 60 },
];

// Gradient line countdown timer — same style as quiz timer
function TimerBar({
  timeLeft,
  total,
  colors: c,
}: {
  timeLeft: number;
  total: number;
  colors: ReturnType<typeof import("@/hooks/useColors").useColors>;
}) {
  const fraction = total > 0 ? timeLeft / total : 0;
  const urgent = timeLeft <= 5;

  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (urgent && timeLeft > 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 0.5, duration: 400, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  }, [urgent, timeLeft]);

  return (
    <View style={[styles.timerTrack, { backgroundColor: c.border }]}>
      <Animated.View
        style={[
          styles.timerBarContainer,
          { width: `${fraction * 100}%`, opacity: pulseAnim },
        ]}
      >
        <LinearGradient
          colors={["#22C55E", "#FBBF24", "#F97316", "#EF4444"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
      {total > 0 && (
        <Text style={[styles.barTimerLabel, { color: c.mutedForeground }]}>
          {timeLeft}s
        </Text>
      )}
    </View>
  );
}

export default function SpotterScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const topInset = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const bottomInset = insets.bottom || 16;

  // ── Idle settings ──────────────────────────────────────────────────────
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [timerDuration, setTimerDuration] = useState<TimerDuration>(0);

  // ── Session state ──────────────────────────────────────────────────────
  const [sessionState, setSessionState] = useState<SessionState>("idle");
  const [deck, setDeck] = useState<Slide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [missed, setMissed] = useState(0);
  const [missedSlides, setMissedSlides] = useState<Slide[]>([]);

  // ── Timer ──────────────────────────────────────────────────────────────
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeTimerDuration = useRef<TimerDuration>(0);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // ── Animations ─────────────────────────────────────────────────────────
  const revealAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;

  // ── Derived ───────────────────────────────────────────────────────────
  const filteredSlides = useMemo(
    () =>
      selectedCategory === "All"
        ? ALL_SLIDES
        : ALL_SLIDES.filter((s) => s.category === selectedCategory),
    [selectedCategory]
  );

  // ── Reveal helper (stable ref so timer callback can call it) ──────────
  const doReveal = useCallback(() => {
    clearTimer();
    setRevealed(true);
    setShowFeatures(false);
    Animated.spring(revealAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 60,
      friction: 8,
    }).start();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [clearTimer, revealAnim]);

  const doRevealRef = useRef(doReveal);
  useEffect(() => { doRevealRef.current = doReveal; }, [doReveal]);

  // ── Start timer for current slide ─────────────────────────────────────
  const startTimer = useCallback((duration: TimerDuration) => {
    clearTimer();
    if (duration === 0) return;
    setTimeLeft(duration);
    let remaining = duration;
    intervalRef.current = setInterval(() => {
      remaining -= 1;
      if (remaining <= 5 && remaining > 0) {
        playWarning();
      } else if (remaining > 0) {
        playTick();
      }
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          playTimeout();
          // Auto-reveal when time runs out
          doRevealRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [clearTimer]);

  // ── Session control ───────────────────────────────────────────────────
  const startSession = useCallback(() => {
    clearTimer();
    activeTimerDuration.current = timerDuration;
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
  }, [filteredSlides, timerDuration, clearTimer]);

  // Start timer whenever a new slide index appears during spotting
  useEffect(() => {
    if (sessionState === "spotting") {
      startTimer(activeTimerDuration.current);
    }
    return clearTimer;
  }, [currentIndex, sessionState]);

  const advance = useCallback(
    (gotIt: boolean) => {
      clearTimer();
      const slide = deck[currentIndex];
      if (gotIt) {
        setCorrect((c) => c + 1);
        playCorrect();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        setMissed((m) => m + 1);
        setMissedSlides((prev) => [...prev, slide]);
        playWrong();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }

      const next = currentIndex + 1;
      if (next >= deck.length) {
        setSessionState("done");
        return;
      }

      Animated.timing(cardAnim, {
        toValue: gotIt ? 1 : -1,
        duration: 180,
        useNativeDriver: true,
      }).start(() => {
        cardAnim.setValue(0);
        revealAnim.setValue(0);
        setRevealed(false);
        setShowFeatures(false);
        setCurrentIndex(next);
      });
    },
    [currentIndex, deck, cardAnim, revealAnim, clearTimer]
  );

  const restartMissed = useCallback(() => {
    clearTimer();
    if (missedSlides.length === 0) {
      setSessionState("idle");
      return;
    }
    activeTimerDuration.current = timerDuration;
    setDeck(shuffle(missedSlides));
    setCurrentIndex(0);
    setRevealed(false);
    setCorrect(0);
    setMissed(0);
    setMissedSlides([]);
    revealAnim.setValue(0);
    cardAnim.setValue(0);
    setSessionState("spotting");
  }, [missedSlides, timerDuration, clearTimer]);

  // Clean up on unmount
  useEffect(() => () => clearTimer(), []);

  const currentSlide = deck[currentIndex];
  const total = deck.length;
  const progressFlex = total > 0 ? currentIndex / total : 0;

  const cardTranslateX = cardAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-400, 0, 400],
  });
  const cardOpacity = cardAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 1, 0],
  });
  const revealOpacity = revealAnim;
  const revealTranslateY = revealAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 0],
  });

  // ── DONE SCREEN ────────────────────────────────────────────────────────
  if (sessionState === "done") {
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{
          paddingTop: topInset + 24,
          paddingBottom: bottomInset + 32,
          paddingHorizontal: 20,
          gap: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ alignItems: "center", gap: 6 }}>
          <Text style={[styles.donePct, { color: pct >= 70 ? colors.success : colors.destructive }]}>
            {pct}%
          </Text>
          <Text style={[styles.doneLabel, { color: colors.foreground }]}>
            {correct} / {total} identified
          </Text>
        </View>

        <View style={{ flexDirection: "row", gap: 12 }}>
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

        {missedSlides.length > 0 && (
          <Pressable
            style={[styles.actionBtn, { backgroundColor: colors.secondary, borderColor: colors.border }]}
            onPress={restartMissed}
          >
            <Feather name="refresh-cw" size={16} color={colors.foreground} style={{ marginRight: 8 }} />
            <Text style={[styles.actionBtnTxt, { color: colors.foreground }]}>
              Practise Missed ({missed})
            </Text>
          </Pressable>
        )}

        <Pressable
          style={[styles.actionBtn, { backgroundColor: colors.primary, borderColor: colors.primary }]}
          onPress={() => setSessionState("idle")}
        >
          <Feather name="home" size={16} color="#fff" style={{ marginRight: 8 }} />
          <Text style={[styles.actionBtnTxt, { color: "#fff" }]}>Back to Spotter</Text>
        </Pressable>
      </ScrollView>
    );
  }

  // ── SPOTTING SCREEN ────────────────────────────────────────────────────
  if (sessionState === "spotting" && currentSlide) {
    const catColor = CATEGORY_COLORS[currentSlide.category] ?? colors.primary;
    // Image fills most of the viewport but leaves enough room so the
    // ScrollView content is always taller than its container.
    const cardHeight = Math.min(
      screenWidth * 0.9,
      screenHeight - topInset - bottomInset - 260,
    );

    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Top bar — always fixed */}
        <View style={[styles.spotTopBar, { paddingTop: topInset + 8 }]}>
          <Pressable onPress={() => { clearTimer(); setSessionState("idle"); }} style={styles.spotBack}>
            <Feather name="x" size={20} color={colors.mutedForeground} />
          </Pressable>

          <View style={{ flex: 1, gap: 4 }}>
            <View style={[styles.spotTrack, { backgroundColor: colors.secondary }]}>
              <View style={[styles.spotFill, { backgroundColor: colors.primary, flex: progressFlex }]} />
              <View style={{ flex: 1 - progressFlex }} />
            </View>
            <Text style={[styles.spotCount, { color: colors.mutedForeground }]}>
              {currentIndex + 1} / {total}
            </Text>
          </View>

          {/* Score */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
            <Text style={[styles.scoreNum, { color: colors.success }]}>{correct}</Text>
            <Text style={[styles.scoreSep, { color: colors.mutedForeground }]}>/</Text>
            <Text style={[styles.scoreNum, { color: colors.destructive }]}>{missed}</Text>
          </View>

          {/* Timer — only shown when timer is active and not revealed */}
          {activeTimerDuration.current > 0 && !revealed && (
            <View style={{ minWidth: 48, alignItems: "center" }}>
              <Text style={[styles.timerCount, { color: timeLeft <= 5 ? "#EF4444" : timeLeft <= 10 ? "#F97316" : colors.primary }]}>
                {timeLeft}s
              </Text>
            </View>
          )}
        </View>

        {/* Everything below top bar is scrollable */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: bottomInset + 40, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Timer bar */}
          {activeTimerDuration.current > 0 && !revealed && (
            <TimerBar
              timeLeft={timeLeft}
              total={activeTimerDuration.current}
              colors={colors}
            />
          )}

          {/* Slide image */}
          <Animated.View
            style={[
              styles.spotCard,
              { height: cardHeight, opacity: cardOpacity, transform: [{ translateX: cardTranslateX }] },
            ]}
          >
            <Image
              source={slideImageMap[currentSlide.key]}
              style={StyleSheet.absoluteFill}
              contentFit="contain"
            />
          </Animated.View>

          {/* Bottom content */}
          <View style={[styles.spotBottom]}>
          {!revealed ? (
            <Pressable style={[styles.revealBtn, { backgroundColor: colors.primary }]} onPress={doReveal}>
              <Feather name="eye" size={18} color="#fff" style={{ marginRight: 10 }} />
              <Text style={styles.revealTxt}>Reveal Answer</Text>
            </Pressable>
          ) : (
            <Animated.View
              style={[
                styles.answerBox,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  opacity: revealOpacity,
                  transform: [{ translateY: revealTranslateY }],
                },
              ]}
            >
              <View style={[styles.catBadge, { backgroundColor: catColor + "22" }]}>
                <View style={[styles.catDot, { backgroundColor: catColor }]} />
                <Text style={[styles.catTxt, { color: catColor }]}>{currentSlide.category}</Text>
              </View>
              <Text style={[styles.answerName, { color: colors.foreground }]}>{currentSlide.name}</Text>

              {/* Identifying Features toggle */}
              {slideFeaturesMap[currentSlide.key] && (
                <Pressable
                  onPress={() => setShowFeatures((s) => !s)}
                  style={[
                    styles.featuresToggle,
                    { borderColor: colors.border, backgroundColor: colors.secondary },
                  ]}
                >
                  <Feather
                    name={showFeatures ? "chevron-up" : "chevron-down"}
                    size={14}
                    color={colors.primary}
                  />
                  <Text style={[styles.featuresToggleTxt, { color: colors.primary }]}>
                    {showFeatures ? "Hide Identifying Features" : "Show Identifying Features"}
                  </Text>
                </Pressable>
              )}

              {/* Features list */}
              {showFeatures && slideFeaturesMap[currentSlide.key] && (
                <View style={[styles.featuresBox, { borderColor: colors.border }]}>
                  {slideFeaturesMap[currentSlide.key].map((feat, i) => (
                    <View key={i} style={styles.featureRow}>
                      <View style={[styles.featureDot, { backgroundColor: colors.primary }]} />
                      <Text style={[styles.featureTxt, { color: colors.foreground }]}>{feat}</Text>
                    </View>
                  ))}
                </View>
              )}

              <View style={{ flexDirection: "row", gap: 10, marginTop: 8 }}>
                <Pressable
                  style={[styles.voteBtn, { backgroundColor: "#EF444420", borderColor: "#EF4444" }]}
                  onPress={() => advance(false)}
                >
                  <Feather name="x" size={20} color="#EF4444" />
                  <Text style={[styles.voteTxt, { color: "#EF4444" }]}>Missed</Text>
                </Pressable>
                <Pressable
                  style={[styles.voteBtn, { backgroundColor: "#10B98120", borderColor: "#10B981" }]}
                  onPress={() => advance(true)}
                >
                  <Feather name="check" size={20} color="#10B981" />
                  <Text style={[styles.voteTxt, { color: "#10B981" }]}>Got it!</Text>
                </Pressable>
              </View>
            </Animated.View>
          )}
          </View>
        </ScrollView>
      </View>
    );
  }

  // ── IDLE / HOME SCREEN ─────────────────────────────────────────────────
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.idleContent,
          { paddingTop: topInset + 16, paddingBottom: bottomInset + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginBottom: 20 }}>
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
            A slide image is shown — name it mentally, then reveal the answer and mark yourself.
          </Text>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
          FILTER BY CATEGORY
        </Text>
        <View style={styles.catGrid}>
          {SLIDE_CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            const accent = cat === "All" ? colors.primary : CATEGORY_COLORS[cat] ?? colors.primary;
            return (
              <Pressable
                key={cat}
                onPress={() => { setSelectedCategory(cat); Haptics.selectionAsync(); }}
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
          <Text style={[styles.startCount, { color: colors.foreground }]}>
            {filteredSlides.length}
          </Text>
          <Text style={[styles.startSub, { color: colors.mutedForeground }]}>
            {selectedCategory === "All" ? "All categories" : selectedCategory}
          </Text>

          {/* Timer selector */}
          <View style={styles.timerRow}>
            <Feather name="clock" size={14} color={colors.mutedForeground} style={{ marginRight: 8 }} />
            <Text style={[styles.timerLabel, { color: colors.mutedForeground }]}>Timer</Text>
            <View style={[styles.timerSegment, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
              {TIMER_OPTIONS.map((opt) => {
                const active = timerDuration === opt.value;
                return (
                  <Pressable
                    key={opt.value}
                    onPress={() => { setTimerDuration(opt.value); Haptics.selectionAsync(); }}
                    style={[
                      styles.timerOption,
                      active && { backgroundColor: colors.primary },
                    ]}
                  >
                    <Text
                      style={[
                        styles.timerOptionTxt,
                        { color: active ? "#fff" : colors.mutedForeground },
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <Pressable style={[styles.startBtn, { overflow: "hidden", marginTop: 12 }]} onPress={startSession}>
            <LinearGradient
              colors={[colors.accent, colors.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.startGrad}
            >
              <Feather name="play" size={18} color="#fff" style={{ marginRight: 10 }} />
              <Text style={styles.startTxt}>Start Spotter</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Idle
  idleContent: { paddingHorizontal: 20 },
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
  catChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  catChipTxt: { fontSize: 13, fontFamily: "Inter_500Medium" },
  startCard: { borderRadius: 16, borderWidth: 1, padding: 20, alignItems: "center", gap: 4 },
  startCount: { fontSize: 44, fontFamily: "Inter_700Bold" },
  startSub: { fontSize: 14, fontFamily: "Inter_400Regular", marginBottom: 8 },

  // Timer selector
  timerRow: { flexDirection: "row", alignItems: "center", width: "100%", marginTop: 8 },
  timerLabel: { fontSize: 13, fontFamily: "Inter_500Medium", marginRight: 10 },
  timerSegment: {
    flex: 1,
    flexDirection: "row",
    borderRadius: 10,
    borderWidth: 1,
    overflow: "hidden",
  },
  timerOption: { flex: 1, paddingVertical: 8, alignItems: "center", borderRadius: 9 },
  timerOptionTxt: { fontSize: 13, fontFamily: "Inter_600SemiBold" },

  startBtn: { width: "100%", borderRadius: 14 },
  startGrad: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 14,
  },
  startTxt: { color: "#fff", fontSize: 16, fontFamily: "Inter_600SemiBold" },

  // Spotting top bar
  spotTopBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },
  spotBack: { padding: 4 },
  spotTrack: { height: 4, borderRadius: 2, flexDirection: "row", overflow: "hidden" },
  spotFill: { height: 4, borderRadius: 2 },
  spotCount: { fontSize: 11, fontFamily: "Inter_500Medium" },
  scoreNum: { fontSize: 15, fontFamily: "Inter_700Bold" },
  scoreSep: { fontSize: 13, fontFamily: "Inter_400Regular" },

  // Timer ring
  timerCount: { fontSize: 13, fontFamily: "Inter_700Bold" },
  timerTrack: {
    height: 4,
    marginHorizontal: 20,
    marginTop: 4,
    borderRadius: 2,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    position: "relative",
  },
  timerBarContainer: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
  },
  barTimerLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    marginLeft: 8,
  },

  // Spotting card
  spotCard: { marginHorizontal: 16, borderRadius: 20, overflow: "hidden", backgroundColor: "#111" },

  // Bottom
  spotBottom: { paddingHorizontal: 16, paddingTop: 12 },
  revealBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 14,
  },
  revealTxt: { color: "#fff", fontSize: 16, fontFamily: "Inter_600SemiBold" },
  answerBox: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 8 },
  catBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  catDot: { width: 7, height: 7, borderRadius: 4 },
  catTxt: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  answerName: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  voteBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  voteTxt: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  featuresToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 2,
    alignSelf: "center",
  },
  featuresToggleTxt: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  featuresBox: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    gap: 8,
    marginTop: 2,
  },
  featureRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  featureDot: { width: 5, height: 5, borderRadius: 2.5, marginTop: 7 },
  featureTxt: { fontSize: 12, fontFamily: "Inter_400Regular", flex: 1, lineHeight: 18 },

  // Done
  donePct: { fontSize: 72, fontFamily: "Inter_700Bold", letterSpacing: -2 },
  doneLabel: { fontSize: 18, fontFamily: "Inter_500Medium" },
  doneStatBox: { flex: 1, alignItems: "center", gap: 6, padding: 16, borderRadius: 14, borderWidth: 1 },
  doneStatNum: { fontSize: 28, fontFamily: "Inter_700Bold" },
  doneStatTxt: { fontSize: 13, fontFamily: "Inter_400Regular" },
  missedList: { borderRadius: 14, borderWidth: 1, padding: 16, gap: 10 },
  missedTitle: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 1 },
  missedRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  missedName: { fontSize: 14, fontFamily: "Inter_500Medium" },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  actionBtnTxt: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
});
