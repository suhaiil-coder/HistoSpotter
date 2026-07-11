import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import DrawerMenu from "@/components/DrawerMenu";

const { width: SCREEN_W } = Dimensions.get("window");

// ─── Thumbnails ───────────────────────────────────────────────────────────────

const THUMBNAILS: Record<string, any> = {
  histology:     require("@/assets/images/thumbnails/histology.png"),
  "head-neck":   require("@/assets/images/thumbnails/head_neck.png"),
  "upper-limb":  require("@/assets/images/thumbnails/upper_limb.png"),
  thorax:        require("@/assets/images/thumbnails/thorax.png"),
  abdomen:       require("@/assets/images/thumbnails/abdomen.png"),
  neuroanatomy:  require("@/assets/images/thumbnails/neuroanatomy.png"),
  embryology:    require("@/assets/images/thumbnails/embryology.png"),
  osteology:     require("@/assets/images/thumbnails/osteology.png"),
};

// ─── Subject catalogue ────────────────────────────────────────────────────────

interface Subject {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  accent: string;
  questionCount: number;
  route?: string;
  isNew?: boolean;
  badge?: string;
}

const SUBJECTS: Subject[] = [
  {
    id: "histology",
    title: "Histology",
    subtitle: "Spot-diagnosis quiz",
    color: "#7C3AED",
    accent: "#A855F7",
    questionCount: 60,
    route: "/quiz",
    badge: "Popular",
  },
  {
    id: "head-neck",
    title: "Head & Neck",
    subtitle: "Gross anatomy · Spotters",
    color: "#0EA5E9",
    accent: "#38BDF8",
    questionCount: 30,
    route: "/head-neck-quiz",
  },
  {
    id: "upper-limb",
    title: "Upper Limb",
    subtitle: "Gross anatomy · Spotters",
    color: "#10B981",
    accent: "#34D399",
    questionCount: 31,
    route: "/upper-limb-quiz",
  },
  {
    id: "thorax",
    title: "Thorax",
    subtitle: "Gross anatomy · Spotters",
    color: "#F59E0B",
    accent: "#FCD34D",
    questionCount: 29,
    route: "/thorax-quiz",
  },
  {
    id: "abdomen",
    title: "Abdomen & Pelvis",
    subtitle: "Gross anatomy · Spotters",
    color: "#EF4444",
    accent: "#F87171",
    questionCount: 60,
    route: "/abdomen-quiz",
    isNew: true,
  },
  {
    id: "neuroanatomy",
    title: "Neuroanatomy",
    subtitle: "Neuroanatomy · Spotters",
    color: "#8B5CF6",
    accent: "#A78BFA",
    questionCount: 26,
    route: "/neuro-quiz",
    isNew: true,
  },
  {
    id: "embryology",
    title: "Embryology",
    subtitle: "Coming soon",
    color: "#EC4899",
    accent: "#F472B6",
    questionCount: 0,
  },
  {
    id: "osteology",
    title: "Osteology",
    subtitle: "Coming soon",
    color: "#6366F1",
    accent: "#818CF8",
    questionCount: 0,
  },
];

const FEATURED = SUBJECTS[4];
const RECENTLY_ADDED = SUBJECTS.filter(
  (s) => s.isNew || s.id === "thorax" || s.id === "upper-limb"
);

// ─── Hero Card ────────────────────────────────────────────────────────────────

function HeroCard({ subject, onPress }: { subject: Subject; onPress: () => void }) {
  const colors = useColors();
  const thumb = THUMBNAILS[subject.id];

  return (
    <Pressable onPress={onPress} style={styles.hero}>
      {/* Background image */}
      {thumb && (
        <Image
          source={thumb}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={300}
        />
      )}
      {/* Dark gradient overlay for readability */}
      <LinearGradient
        colors={["rgba(0,0,0,0.15)", "rgba(0,0,0,0.55)", "rgba(0,0,0,0.88)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[StyleSheet.absoluteFill]}
      />
      {/* Accent tint strip at top */}
      <LinearGradient
        colors={[subject.color + "55", "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[StyleSheet.absoluteFill]}
      />

      <View style={styles.heroContent}>
        {subject.isNew && (
          <View style={[styles.heroBadge, { backgroundColor: subject.accent }]}>
            <Text style={styles.heroBadgeTxt}>NEW</Text>
          </View>
        )}
        {subject.badge && !subject.isNew && (
          <View style={[styles.heroBadge, { backgroundColor: subject.color }]}>
            <Text style={styles.heroBadgeTxt}>{subject.badge}</Text>
          </View>
        )}
        <Text style={styles.heroTitle}>{subject.title}</Text>
        <Text style={styles.heroSub}>{subject.subtitle}</Text>
        <Text style={styles.heroCount}>{subject.questionCount} spotters</Text>

        <Pressable
          onPress={onPress}
          style={[styles.heroBtn, { backgroundColor: "#fff" }]}
        >
          <Feather name="play" size={14} color={subject.color} />
          <Text style={[styles.heroBtnTxt, { color: subject.color }]}>Start Now</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

// ─── Horizontal subject card ──────────────────────────────────────────────────

function SubjectCard({
  subject,
  onPress,
  size = "md",
}: {
  subject: Subject;
  onPress: () => void;
  size?: "sm" | "md";
}) {
  const w = size === "sm" ? 130 : 160;
  const h = size === "sm" ? 90 : 110;
  const disabled = !subject.route;
  const thumb = THUMBNAILS[subject.id];

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.subjectCard,
        { width: w, opacity: disabled ? 0.45 : pressed ? 0.75 : 1 },
      ]}
    >
      {/* Image / gradient tile */}
      <View style={[styles.subjectCardImg, { height: h, borderRadius: 12, overflow: "hidden" }]}>
        {thumb ? (
          <>
            <Image
              source={thumb}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              transition={200}
            />
            <LinearGradient
              colors={["transparent", subject.color + "CC"]}
              start={{ x: 0, y: 0.4 }}
              end={{ x: 0, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </>
        ) : (
          <LinearGradient
            colors={[subject.color, subject.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        )}

        {subject.badge && (
          <View style={[styles.subjectBadge, { backgroundColor: subject.color }]}>
            <Text style={styles.subjectBadgeTxt}>{subject.badge}</Text>
          </View>
        )}
        {subject.isNew && (
          <View style={[styles.subjectBadge, { backgroundColor: "#EF4444" }]}>
            <Text style={styles.subjectBadgeTxt}>NEW</Text>
          </View>
        )}
      </View>

      {/* Text below */}
      <Text style={styles.subjectCardTitle} numberOfLines={1}>
        {subject.title}
      </Text>
      <Text style={styles.subjectCardSub} numberOfLines={1}>
        {subject.questionCount > 0 ? `${subject.questionCount} spotters` : "Coming soon"}
      </Text>
    </Pressable>
  );
}

// ─── Large grid card ──────────────────────────────────────────────────────────

function LargeCard({ subject, onPress }: { subject: Subject; onPress: () => void }) {
  const colors = useColors();
  const disabled = !subject.route;
  const cardW = (SCREEN_W - 48) / 2;
  const thumb = THUMBNAILS[subject.id];

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.largeCard,
        {
          width: cardW,
          opacity: disabled ? 0.4 : pressed ? 0.75 : 1,
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      {/* Top image area */}
      <View style={[styles.largeCardTop, { overflow: "hidden" }]}>
        {thumb ? (
          <>
            <Image
              source={thumb}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              transition={200}
            />
            {/* Tinted gradient overlay */}
            <LinearGradient
              colors={[subject.color + "44", subject.accent + "88"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </>
        ) : (
          <LinearGradient
            colors={[subject.color + "EE", subject.accent + "AA"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        )}

        {(subject.isNew || subject.badge) && (
          <View
            style={[
              styles.largeCardBadge,
              { backgroundColor: subject.isNew ? "#EF4444" : subject.color },
            ]}
          >
            <Text style={styles.largeCardBadgeTxt}>
              {subject.isNew ? "NEW" : subject.badge}
            </Text>
          </View>
        )}
      </View>

      {/* Content below */}
      <View style={styles.largeCardBody}>
        <Text
          style={[styles.largeCardTitle, { color: colors.foreground }]}
          numberOfLines={2}
        >
          {subject.title}
        </Text>
        <Text
          style={[styles.largeCardSub, { color: colors.mutedForeground }]}
          numberOfLines={1}
        >
          {subject.subtitle}
        </Text>
        {subject.questionCount > 0 && (
          <View style={[styles.largeCardCount, { backgroundColor: subject.color + "22" }]}>
            <Text style={[styles.largeCardCountTxt, { color: subject.color }]}>
              {subject.questionCount} Q
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

// ─── Histology Spotter Banner ─────────────────────────────────────────────────

function SpotterBanner({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.spotterBanner, { opacity: pressed ? 0.88 : 1 }]}
    >
      {/* Background: histology slide thumbnail */}
      <Image
        source={THUMBNAILS["histology"]}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={300}
      />

      {/* Deep purple-to-black gradient overlay */}
      <LinearGradient
        colors={["rgba(124,58,237,0.55)", "rgba(10,4,26,0.92)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Glowing top-left accent orb */}
      <View style={styles.spotterOrb} />

      <View style={styles.spotterContent}>
        {/* Left column: copy */}
        <View style={styles.spotterLeft}>
          <View style={styles.spotterBadgeRow}>
            <View style={styles.spotterLiveDot} />
            <Text style={styles.spotterLiveTxt}>FEATURED</Text>
          </View>

          <Text style={styles.spotterTitle}>Histology{"\n"}Spotter</Text>
          <Text style={styles.spotterSub}>
            Identify H&amp;E slides under the clock
          </Text>

          {/* Feature pills */}
          <View style={styles.spotterPills}>
            {["60+ Slides", "Timed Mode", "Categories"].map((tag) => (
              <View key={tag} style={styles.spotterPill}>
                <Text style={styles.spotterPillTxt}>{tag}</Text>
              </View>
            ))}
          </View>

          {/* CTA */}
          <Pressable onPress={onPress} style={styles.spotterBtn}>
            <MaterialCommunityIcons name="microscope" size={16} color="#1a0a2e" />
            <Text style={styles.spotterBtnTxt}>Start Spotting</Text>
            <Feather name="arrow-right" size={14} color="#1a0a2e" />
          </Pressable>
        </View>

        {/* Right column: stacked slide peek */}
        <View style={styles.spotterRight}>
          <View style={styles.spotterSlideBack} />
          <View style={styles.spotterSlideMid} />
          <View style={styles.spotterSlideFront}>
            <Image
              source={THUMBNAILS["histology"]}
              style={{ width: "100%", height: "100%", borderRadius: 12 }}
              contentFit="cover"
            />
            <LinearGradient
              colors={["transparent", "rgba(124,58,237,0.6)"]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 0, y: 1 }}
              style={[StyleSheet.absoluteFill, { borderRadius: 12 }]}
            />
            <View style={styles.spotterSlideLabel}>
              <Text style={styles.spotterSlideLabelTxt}>H&amp;E ×40</Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

// ─── Row header ───────────────────────────────────────────────────────────────

function RowHeader({ title, accent }: { title: string; accent?: boolean }) {
  const colors = useColors();
  return (
    <View style={styles.rowHeader}>
      {accent && (
        <View style={[styles.rowAccentBar, { backgroundColor: colors.primary }]} />
      )}
      <Text style={[styles.rowTitle, { color: colors.foreground }]}>{title}</Text>
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { stats, quizHistory } = useApp();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const topInset = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  const accuracy =
    stats.totalQuestions > 0
      ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100)
      : null;

  const continueLearning = SUBJECTS.filter(
    (s) => s.route && s.id !== "histology"
  ).slice(0, 5);

  function navigate(subject: Subject) {
    if (!subject.route) return;
    router.push(subject.route as any);
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* ── Floating header ── */}
      <View style={[styles.floatingHeader, { paddingTop: topInset }]}>
        <Pressable
          onPress={() => setDrawerOpen(true)}
          style={({ pressed }) => [
            styles.menuBtn,
            { backgroundColor: "rgba(0,0,0,0.5)", opacity: pressed ? 0.7 : 1 },
          ]}
          hitSlop={8}
        >
          <Feather name="menu" size={20} color="#fff" />
        </Pressable>

        <Text style={styles.floatingTitle}>
          Med<Text style={{ color: colors.primary }}>Spotter</Text>
        </Text>

        <View style={styles.headerRight}>
          {accuracy !== null && (
            <View style={[styles.accuracyPill, { backgroundColor: colors.primary + "33" }]}>
              <Text style={[styles.accuracyTxt, { color: colors.primary }]}>
                {accuracy}%
              </Text>
            </View>
          )}
          <Pressable
            onPress={() => router.push("/quiz")}
            style={[styles.playBtn, { backgroundColor: colors.primary }]}
          >
            <Feather name="play" size={16} color="#fff" />
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Platform.OS === "web" ? 100 : insets.bottom + 100,
        }}
      >
        {/* ── Hero ── */}
        <HeroCard subject={FEATURED} onPress={() => navigate(FEATURED)} />

        {/* ── Stats strip ── */}
        {stats.totalQuizzes > 0 && (
          <View
            style={[
              styles.statsStrip,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.statItem}>
              <Text style={[styles.statNum, { color: colors.primary }]}>
                {stats.totalQuizzes}
              </Text>
              <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>
                Quizzes
              </Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statNum, { color: colors.primary }]}>{accuracy}%</Text>
              <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>
                Accuracy
              </Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statNum, { color: colors.primary }]}>
                {stats.bestScore}%
              </Text>
              <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>Best</Text>
            </View>
          </View>
        )}

        {/* ── Histology Spotter Banner ── */}
        <SpotterBanner onPress={() => router.push("/(tabs)/spotter")} />

        {/* ── Continue Learning ── */}
        <View style={styles.section}>
          <RowHeader title="Continue Learning" accent />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hScroll}
          >
            {continueLearning.map((s) => (
              <SubjectCard key={s.id} subject={s} onPress={() => navigate(s)} />
            ))}
          </ScrollView>
        </View>

        {/* ── Recently Added ── */}
        <View style={styles.section}>
          <RowHeader title="Recently Added" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hScroll}
          >
            {RECENTLY_ADDED.map((s) => (
              <SubjectCard
                key={s.id}
                subject={s}
                size="sm"
                onPress={() => navigate(s)}
              />
            ))}
          </ScrollView>
        </View>

        {/* ── All Subjects Grid ── */}
        <View style={styles.section}>
          <RowHeader title="All Subjects" accent />
          <View style={styles.largeGrid}>
            {SUBJECTS.map((s) => (
              <LargeCard key={s.id} subject={s} onPress={() => navigate(s)} />
            ))}
          </View>
        </View>

        {/* ── Last quiz recap ── */}
        {quizHistory[0] && (
          <View
            style={[
              styles.recapCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.recapLeft}>
              <Text style={[styles.recapLabel, { color: colors.mutedForeground }]}>
                LAST QUIZ
              </Text>
              <Text style={[styles.recapScore, { color: colors.foreground }]}>
                {quizHistory[0].score}/{quizHistory[0].total}
              </Text>
              <Text style={[styles.recapPct, { color: colors.primary }]}>
                {Math.round((quizHistory[0].score / quizHistory[0].total) * 100)}% correct
              </Text>
            </View>
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/review",
                  params: { resultsJson: JSON.stringify(quizHistory[0]) },
                })
              }
              style={[styles.recapBtn, { backgroundColor: colors.primary }]}
            >
              <Feather name="rotate-ccw" size={14} color="#fff" />
              <Text style={styles.recapBtnTxt}>Review</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      {/* Drawer */}
      <DrawerMenu
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSelect={(id) => {
          if (id === "head-neck" || id === "charts-quiz") {
            router.push("/head-neck-quiz");
          } else if (id === "upper-limb") {
            router.push("/upper-limb-quiz");
          } else if (id === "thorax") {
            router.push("/thorax-quiz");
          } else if (id === "abdomen") {
            router.push("/abdomen-quiz");
          } else if (id === "ospe") {
            router.push("/ospe-quiz");
          } else if (id === "neuroanatomy") {
            router.push("/neuro-quiz");
          }
        }}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1 },

  floatingHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 10,
  },
  menuBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  floatingTitle: {
    flex: 1,
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    color: "#fff",
    letterSpacing: -0.3,
  },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  accuracyPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  accuracyTxt: { fontSize: 12, fontFamily: "Inter_700Bold" },
  playBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  // Hero
  hero: { height: 340, justifyContent: "flex-end" },
  heroContent: { padding: 24, gap: 4 },
  heroBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 10,
  },
  heroBadgeTxt: {
    fontSize: 9,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    marginBottom: 4,
  },
  heroSub: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.75)",
  },
  heroCount: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    color: "rgba(255,255,255,0.5)",
    marginBottom: 16,
  },
  heroBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 24,
  },
  heroBtnTxt: { fontSize: 14, fontFamily: "Inter_700Bold" },

  // Stats strip
  statsStrip: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 14,
  },
  statItem: { flex: 1, alignItems: "center" },
  statNum: { fontSize: 20, fontFamily: "Inter_700Bold" },
  statLbl: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  statDivider: { width: 1, marginVertical: 4 },

  // Sections
  section: { marginTop: 28 },
  rowHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  rowAccentBar: { width: 4, height: 18, borderRadius: 2 },
  rowTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  hScroll: { paddingHorizontal: 16, gap: 12 },

  // Horizontal subject card
  subjectCard: { gap: 8 },
  subjectCardImg: { alignItems: "center", justifyContent: "center" },
  subjectBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  subjectBadgeTxt: {
    fontSize: 8,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    letterSpacing: 0.8,
  },
  subjectCardTitle: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: "#E5E7EB",
  },
  subjectCardSub: { fontSize: 11, fontFamily: "Inter_400Regular", color: "#6B7280" },

  // Large grid
  largeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 12,
  },
  largeCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  largeCardTop: { height: 120 },
  largeCardBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  largeCardBadgeTxt: {
    fontSize: 8,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    letterSpacing: 0.8,
  },
  largeCardBody: { padding: 12, gap: 4 },
  largeCardTitle: { fontSize: 13, fontFamily: "Inter_700Bold", lineHeight: 18 },
  largeCardSub: { fontSize: 11, fontFamily: "Inter_400Regular" },
  largeCardCount: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 4,
  },
  largeCardCountTxt: { fontSize: 10, fontFamily: "Inter_700Bold" },

  // Spotter Banner
  spotterBanner: {
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 20,
    overflow: "hidden",
    height: 200,
  },
  spotterOrb: {
    position: "absolute",
    top: -40,
    left: -40,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(167,139,250,0.25)",
  },
  spotterContent: {
    flex: 1,
    flexDirection: "row",
    padding: 20,
    gap: 12,
  },
  spotterLeft: {
    flex: 1,
    justifyContent: "space-between",
  },
  spotterBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  spotterLiveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#A78BFA",
  },
  spotterLiveTxt: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    color: "#A78BFA",
    letterSpacing: 1.2,
  },
  spotterTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    lineHeight: 26,
    marginTop: 4,
  },
  spotterSub: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.65)",
    marginTop: 2,
  },
  spotterPills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    marginTop: 8,
  },
  spotterPill: {
    backgroundColor: "rgba(167,139,250,0.2)",
    borderWidth: 1,
    borderColor: "rgba(167,139,250,0.4)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  spotterPillTxt: {
    fontSize: 9,
    fontFamily: "Inter_600SemiBold",
    color: "#C4B5FD",
  },
  spotterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    backgroundColor: "#A78BFA",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 22,
    marginTop: 10,
  },
  spotterBtnTxt: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    color: "#1a0a2e",
  },
  spotterRight: {
    width: 110,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  spotterSlideBack: {
    position: "absolute",
    width: 88,
    height: 108,
    borderRadius: 12,
    backgroundColor: "rgba(167,139,250,0.15)",
    top: 14,
    right: -6,
    transform: [{ rotate: "8deg" }],
  },
  spotterSlideMid: {
    position: "absolute",
    width: 90,
    height: 110,
    borderRadius: 12,
    backgroundColor: "rgba(167,139,250,0.22)",
    top: 8,
    right: -1,
    transform: [{ rotate: "4deg" }],
  },
  spotterSlideFront: {
    width: 92,
    height: 112,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  spotterSlideLabel: {
    position: "absolute",
    bottom: 8,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  spotterSlideLabelTxt: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    color: "#E9D5FF",
    letterSpacing: 0.5,
  },

  // Last quiz recap
  recapCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 28,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  recapLeft: { gap: 2 },
  recapLabel: {
    fontSize: 9,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  recapScore: { fontSize: 26, fontFamily: "Inter_700Bold" },
  recapPct: { fontSize: 13, fontFamily: "Inter_500Medium" },
  recapBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  recapBtnTxt: { fontSize: 14, fontFamily: "Inter_700Bold", color: "#fff" },
});
