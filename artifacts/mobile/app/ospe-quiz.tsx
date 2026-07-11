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
import { Feather } from "@expo/vector-icons";

import { useColors } from "@/hooks/useColors";
import { OSPE_STATIONS, type OSPEStation, type OSPESubQuestion } from "@/constants/ospeQuestions";

const { width: SCREEN_W } = Dimensions.get("window");

// ─── Image map ────────────────────────────────────────────────────────────────

const OSPE_IMAGES: Record<string, any> = {
  p001_venipuncture:   require("@/assets/images/ospe/p001_venipuncture.png"),
  p002_hernia:         require("@/assets/images/ospe/p002_hernia.png"),
  p003_ape_hand:       require("@/assets/images/ospe/p003_ape_hand.png"),
  p004_trendelenburg:  require("@/assets/images/ospe/p004_trendelenburg.png"),
  p005_varicose:       require("@/assets/images/ospe/p005_varicose.png"),
  p006_lumbar_puncture:require("@/assets/images/ospe/p006_lumbar_puncture.png"),
  p007_raccoon_eyes:   require("@/assets/images/ospe/p007_raccoon_eyes.png"),
  p008_birth_injuries: require("@/assets/images/ospe/p008_birth_injuries.png"),
  p009_claw_hand:      require("@/assets/images/ospe/p009_claw_hand.png"),
  p010_caput_medusae:  require("@/assets/images/ospe/p010_caput_medusae.png"),
  p011_internal_squint:require("@/assets/images/ospe/p011_internal_squint.png"),
  p012_foot_drop:      require("@/assets/images/ospe/p012_foot_drop.png"),
  p013_amniocentesis:  require("@/assets/images/ospe/p013_amniocentesis.png"),
  p014_external_squint:require("@/assets/images/ospe/p014_external_squint.png"),
  p015_gluteal_injection:require("@/assets/images/ospe/p015_gluteal_injection.png"),
  p016_cdh:            require("@/assets/images/ospe/p016_cdh.png"),
  p017_urethra:        require("@/assets/images/ospe/p017_urethra.png"),
  p018_wrist_drop:     require("@/assets/images/ospe/p018_wrist_drop.png"),
  p019_waldeyers_ring: require("@/assets/images/ospe/p019_waldeyers_ring.png"),
};

const REGION_COLORS: Record<string, string> = {
  "Upper Limb":    "#10B981",
  "Lower Limb":    "#F59E0B",
  "Head & Neck":   "#0EA5E9",
  "Abdomen":       "#EF4444",
  "Thorax":        "#F97316",
  "Neuroanatomy":  "#8B5CF6",
  "Embryology":    "#EC4899",
};

function regionColor(r: string) {
  return REGION_COLORS[r] ?? "#6366F1";
}

// ─── Station list card ────────────────────────────────────────────────────────

function StationCard({
  station,
  onPress,
}: {
  station: OSPEStation;
  onPress: () => void;
}) {
  const colors = useColors();
  const accent = regionColor(station.region);
  const img = OSPE_IMAGES[station.thumbnail];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.stationCard,
        { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.8 : 1 },
      ]}
    >
      {/* Image thumbnail */}
      <View style={styles.stationCardImg}>
        {img && (
          <Image source={img} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
        )}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          start={{ x: 0, y: 0.4 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={[styles.stationNo, { backgroundColor: accent }]}>
          <Text style={styles.stationNoTxt}>{station.stationNo}</Text>
        </View>
        <View style={styles.marksChip}>
          <Text style={styles.marksChipTxt}>{station.totalMarks}M</Text>
        </View>
      </View>

      {/* Text */}
      <View style={styles.stationCardBody}>
        <View style={[styles.regionPill, { backgroundColor: accent + "22" }]}>
          <Text style={[styles.regionTxt, { color: accent }]}>{station.region}</Text>
        </View>
        <Text style={[styles.stationTopic, { color: colors.foreground }]} numberOfLines={2}>
          {station.topic}
        </Text>
        <Text style={[styles.stationQCount, { color: colors.mutedForeground }]}>
          {station.questions.length} questions
        </Text>
      </View>
    </Pressable>
  );
}

// ─── Question row in detail view ──────────────────────────────────────────────

function QuestionRow({
  q,
  index,
  accent,
}: {
  q: OSPESubQuestion;
  index: number;
  accent: string;
}) {
  const colors = useColors();
  const [revealed, setRevealed] = useState(false);

  return (
    <View
      style={[
        styles.qRow,
        { backgroundColor: colors.card, borderColor: revealed ? accent + "55" : colors.border },
      ]}
    >
      {/* Question header */}
      <View style={styles.qHeader}>
        <View style={[styles.qNumBadge, { backgroundColor: accent + "22" }]}>
          <Text style={[styles.qNum, { color: accent }]}>{index + 1}</Text>
        </View>
        <Text style={[styles.qText, { color: colors.foreground }]}>{q.q}</Text>
        <View style={[styles.marksBadge, { backgroundColor: colors.secondary }]}>
          <Text style={[styles.marksTxt, { color: colors.mutedForeground }]}>{q.marks}M</Text>
        </View>
      </View>

      {/* Reveal / Answer */}
      {revealed ? (
        <View style={[styles.answerBox, { backgroundColor: accent + "11", borderColor: accent + "33" }]}>
          <View style={styles.answerHeader}>
            <Feather name="check-circle" size={14} color={accent} />
            <Text style={[styles.answerLabel, { color: accent }]}>MODEL ANSWER</Text>
          </View>
          <Text style={[styles.answerText, { color: colors.foreground }]}>{q.answer}</Text>
        </View>
      ) : (
        <Pressable
          onPress={() => setRevealed(true)}
          style={({ pressed }) => [
            styles.revealBtn,
            { borderColor: accent + "55", opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Feather name="eye" size={14} color={accent} />
          <Text style={[styles.revealTxt, { color: accent }]}>Reveal Answer</Text>
        </Pressable>
      )}
    </View>
  );
}

// ─── Station detail view ──────────────────────────────────────────────────────

function StationDetail({
  station,
  onBack,
}: {
  station: OSPEStation;
  onBack: () => void;
}) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const accent = regionColor(station.region);
  const img = OSPE_IMAGES[station.thumbnail];
  const [allRevealed, setAllRevealed] = useState(false);
  const [revealKey, setRevealKey] = useState(0);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 80 : insets.bottom + 80 }}
      >
        {/* Hero image */}
        <View style={styles.detailHero}>
          {img && (
            <Image source={img} style={StyleSheet.absoluteFill} contentFit="cover" transition={300} />
          )}
          <LinearGradient
            colors={[accent + "44", "rgba(0,0,0,0.85)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />

          {/* Back button */}
          <View style={[styles.detailTopBar, { paddingTop: Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top + 8 }]}>
            <Pressable
              onPress={onBack}
              style={[styles.backBtn, { backgroundColor: "rgba(0,0,0,0.5)" }]}
            >
              <Feather name="arrow-left" size={18} color="#fff" />
            </Pressable>
            <View style={[styles.stationNoBig, { backgroundColor: accent }]}>
              <Text style={styles.stationNoBigTxt}>{station.stationNo}</Text>
            </View>
          </View>

          {/* Station meta */}
          <View style={styles.detailHeroContent}>
            <View style={[styles.regionPill, { backgroundColor: accent + "33" }]}>
              <Text style={[styles.regionTxt, { color: accent }]}>{station.region}</Text>
            </View>
            <Text style={styles.detailTitle}>{station.topic}</Text>
            <Text style={styles.detailMarks}>{station.totalMarks} total marks · {station.questions.length} questions</Text>
          </View>
        </View>

        {/* Scenario */}
        <View style={[styles.scenarioBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.scenarioHeader}>
            <Feather name="image" size={14} color={accent} />
            <Text style={[styles.scenarioLabel, { color: accent }]}>CLINICAL SCENARIO</Text>
          </View>
          <Text style={[styles.scenarioText, { color: colors.foreground }]}>{station.scenario}</Text>
        </View>

        {/* Reveal all */}
        <View style={styles.revealAllRow}>
          <Text style={[styles.questionsHeading, { color: colors.foreground }]}>Questions</Text>
          <Pressable
            key={revealKey}
            onPress={() => { setAllRevealed(true); setRevealKey((k) => k + 1); }}
            style={[styles.revealAllBtn, { backgroundColor: accent + "22", borderColor: accent + "44" }]}
          >
            <Feather name="eye" size={13} color={accent} />
            <Text style={[styles.revealAllTxt, { color: accent }]}>Reveal All</Text>
          </Pressable>
        </View>

        {/* Questions */}
        <View style={styles.questionsList}>
          {station.questions.map((q, i) => (
            <QuestionRow key={`${revealKey}-${i}`} q={q} index={i} accent={accent} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Filter chips ─────────────────────────────────────────────────────────────

const FILTERS = ["All", "Upper Limb", "Lower Limb", "Head & Neck", "Abdomen", "Thorax", "Embryology", "Neuroanatomy"];

// ─── Main OSPE screen ─────────────────────────────────────────────────────────

export default function OSPEQuizScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topInset = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  const [activeStation, setActiveStation] = useState<OSPEStation | null>(null);
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All"
    ? OSPE_STATIONS
    : OSPE_STATIONS.filter((s) => s.region === filter);

  if (activeStation) {
    return (
      <StationDetail
        station={activeStation}
        onBack={() => setActiveStation(null)}
      />
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: topInset + 8, backgroundColor: colors.background, borderBottomColor: colors.border },
        ]}
      >
        <Pressable
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.card }]}
          hitSlop={8}
        >
          <Feather name="arrow-left" size={18} color={colors.foreground} />
        </Pressable>
        <View style={styles.headerText}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>OSPE Exam Mode</Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            {OSPE_STATIONS.length} stations · Gross Anatomy 2021
          </Text>
        </View>
        <View style={[styles.examBadge, { backgroundColor: "#7C3AED22" }]}>
          <Text style={[styles.examBadgeTxt, { color: "#A78BFA" }]}>EXAM</Text>
        </View>
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}
        style={{ flexGrow: 0 }}
      >
        {FILTERS.map((f) => {
          const active = filter === f;
          const accent = f === "All" ? "#7C3AED" : regionColor(f);
          return (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: active ? accent : colors.card,
                  borderColor: active ? accent : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterChipTxt,
                  { color: active ? "#fff" : colors.mutedForeground },
                ]}
              >
                {f}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Station grid */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.grid,
          { paddingBottom: Platform.OS === "web" ? 80 : insets.bottom + 80 },
        ]}
      >
        {filtered.map((station) => (
          <StationCard
            key={station.id}
            station={station}
            onPress={() => setActiveStation(station)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const CARD_W = (SCREEN_W - 48) / 2;

const styles = StyleSheet.create({
  screen: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 12,
    borderBottomWidth: 1,
  },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  headerSub: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 1 },
  examBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  examBadgeTxt: { fontSize: 10, fontFamily: "Inter_700Bold", letterSpacing: 1 },

  filtersRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipTxt: { fontSize: 12, fontFamily: "Inter_500Medium" },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 12,
    paddingTop: 4,
  },

  // Station card
  stationCard: {
    width: CARD_W,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  stationCardImg: {
    height: 110,
    overflow: "hidden",
    position: "relative",
  },
  stationNo: {
    position: "absolute",
    top: 10,
    left: 10,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  stationNoTxt: { fontSize: 9, fontFamily: "Inter_700Bold", color: "#fff", letterSpacing: 0.5 },
  marksChip: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  marksChipTxt: { fontSize: 9, fontFamily: "Inter_700Bold", color: "#fff" },
  stationCardBody: { padding: 12, gap: 5 },
  regionPill: {
    alignSelf: "flex-start",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  regionTxt: { fontSize: 9, fontFamily: "Inter_600SemiBold", letterSpacing: 0.5 },
  stationTopic: { fontSize: 12, fontFamily: "Inter_600SemiBold", lineHeight: 17 },
  stationQCount: { fontSize: 10, fontFamily: "Inter_400Regular" },

  // Detail view
  detailHero: { height: 280, justifyContent: "flex-end" },
  detailTopBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  detailHeroContent: { padding: 20, gap: 6 },
  detailTitle: { fontSize: 22, fontFamily: "Inter_700Bold", color: "#fff" },
  detailMarks: { fontSize: 12, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.65)" },

  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  stationNoBig: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
  },
  stationNoBigTxt: { fontSize: 12, fontFamily: "Inter_700Bold", color: "#fff" },

  scenarioBox: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 8,
  },
  scenarioHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  scenarioLabel: { fontSize: 10, fontFamily: "Inter_700Bold", letterSpacing: 1 },
  scenarioText: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },

  revealAllRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 22,
    marginBottom: 10,
  },
  questionsHeading: { fontSize: 16, fontFamily: "Inter_700Bold" },
  revealAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  revealAllTxt: { fontSize: 12, fontFamily: "Inter_600SemiBold" },

  questionsList: { paddingHorizontal: 16, gap: 12 },

  qRow: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  qHeader: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  qNumBadge: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 1,
  },
  qNum: { fontSize: 12, fontFamily: "Inter_700Bold" },
  qText: { flex: 1, fontSize: 13, fontFamily: "Inter_500Medium", lineHeight: 19 },
  marksBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    flexShrink: 0,
    marginTop: 2,
  },
  marksTxt: { fontSize: 10, fontFamily: "Inter_600SemiBold" },

  answerBox: { borderRadius: 10, borderWidth: 1, padding: 12, gap: 8 },
  answerHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  answerLabel: { fontSize: 9, fontFamily: "Inter_700Bold", letterSpacing: 1 },
  answerText: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },

  revealBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  revealTxt: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
});
