import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import SkeletonViewer, {
  type BoneInfo,
  type SkeletonViewerRef,
} from "../components/SkeletonViewer";
import { BONES } from "../constants/osteologyData";

const { width: SW } = Dimensions.get("window");

// ─── Body systems ────────────────────────────────────────────────────────────
const SYSTEMS = [
  { key: "skeletal",      label: "Skeletal",      icon: "body-outline"       as const },
  { key: "muscular",      label: "Muscular",       icon: "fitness-outline"    as const },
  { key: "cardiovascular",label: "Vascular",       icon: "heart-outline"      as const },
  { key: "neural",        label: "Neural",         icon: "git-network-outline"as const },
  { key: "lymphatic",     label: "Lymphatic",      icon: "water-outline"      as const },
];

// ─── Tabs ─────────────────────────────────────────────────────────────────────
type TabKey = "overview" | "bonymarkings" | "quiz1" | "quiz2";
const TABS: { key: TabKey; label: string }[] = [
  { key: "overview",     label: "Overview" },
  { key: "bonymarkings", label: "Markings" },
  { key: "quiz1",        label: "Quiz" },
];

function getBoneData(info: BoneInfo) {
  return BONES.find(b => b.id === info.boneId) ?? null;
}

// ─── Overview ─────────────────────────────────────────────────────────────────
function OverviewPanel({ info }: { info: BoneInfo }) {
  const bone = getBoneData(info);
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.panelScroll}>
      {bone && (
        <>
          <Text style={styles.sectionLabel}>ARTICULATIONS</Text>
          {bone.articulations.slice(0, 5).map((a, i) => (
            <View key={i} style={styles.artRow}>
              <View style={styles.artDot} />
              <Text style={styles.artTxt}>{a}</Text>
            </View>
          ))}
          {bone.clinical ? (
            <>
              <Text style={[styles.sectionLabel, { color: "#F6AD55", marginTop: 16 }]}>CLINICAL NOTE</Text>
              <Text style={styles.clinicalTxt}>{bone.clinical}</Text>
            </>
          ) : null}
        </>
      )}
    </ScrollView>
  );
}

// ─── Bony markings ────────────────────────────────────────────────────────────
function BonyMarkingsPanel({ info }: { info: BoneInfo }) {
  const bone = getBoneData(info);
  if (!bone) return null;
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.panelScroll}>
      {bone.features.slice(0, 8).map((f, i) => (
        <View key={f.id} style={styles.markRow}>
          <View style={styles.markIdx}>
            <Text style={styles.markIdxTxt}>{i + 1}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.markName}>{f.name}</Text>
            <Text style={styles.markDesc} numberOfLines={2}>{f.desc}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

// ─── Quiz ─────────────────────────────────────────────────────────────────────
function QuizPanel({ info }: { info: BoneInfo }) {
  const bone = getBoneData(info);
  const [answered, setAnswered] = useState<string | null>(null);
  if (!bone || bone.features.length < 4) return (
    <View style={styles.panelScroll}>
      <Text style={styles.artTxt}>Not enough data for this bone.</Text>
    </View>
  );
  const correct = bone.features[0]!.name;
  const opts = React.useMemo(() => {
    const wrong = bone.features.slice(1).sort(() => Math.random() - 0.5).slice(0, 3).map(f => f.name);
    return [correct, ...wrong].sort(() => Math.random() - 0.5);
  }, [bone.id]);

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.panelScroll}>
      <Text style={styles.sectionLabel}>IDENTIFY THE LANDMARK</Text>
      <Text style={styles.artTxt}>What is landmark #1 on this bone?</Text>
      <View style={{ marginTop: 12, gap: 8 }}>
        {opts.map(opt => {
          const isC = opt === correct, chosen = answered === opt, rev = !!answered;
          return (
            <TouchableOpacity
              key={opt}
              onPress={() => !answered && setAnswered(opt)}
              style={[styles.quizOpt,
                rev && isC   && styles.quizOptOk,
                rev && chosen && !isC && styles.quizOptBad,
              ]}
            >
              <Text style={[styles.quizOptTxt, rev && isC && { color: "#fff" }]}>{opt}</Text>
              {rev && isC   && <Ionicons name="checkmark-circle" size={16} color="#68D391" />}
              {rev && chosen && !isC && <Ionicons name="close-circle" size={16} color="#FC8181" />}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function OsteologyScreen() {
  const insets = useSafeAreaInsets();
  const viewerRef = useRef<SkeletonViewerRef>(null);
  const [selectedBone, setSelectedBone]   = useState<BoneInfo | null>(null);
  const [activeTab, setActiveTab]         = useState<TabKey>("overview");
  const [activeSystem, setActiveSystem]   = useState("skeletal");
  const panelAnim = useRef(new Animated.Value(0)).current;

  function handleBoneSelect(bone: BoneInfo | null) {
    setSelectedBone(bone);
    setActiveTab("overview");
    Animated.spring(panelAnim, {
      toValue: bone ? 1 : 0,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  }

  const panelY = panelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [340, 0],
  });

  return (
    <View style={styles.root}>

      {/* ── Full-screen skeleton canvas ── */}
      <SkeletonViewer ref={viewerRef} onBoneSelect={handleBoneSelect} />

      {/* ── Top header ── */}
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => { viewerRef.current?.resetView(); }}>
          <Ionicons name="chevron-back" size={20} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          {selectedBone ? (
            <>
              <Text style={styles.headerTitle}>{selectedBone.name}</Text>
              <Text style={styles.headerSub}>{selectedBone.latinName}</Text>
            </>
          ) : (
            <Text style={styles.headerTitle}>Human Skeleton</Text>
          )}
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="search-outline" size={18} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="ellipsis-horizontal" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── System selector ── */}
      <View style={[styles.systemRow, { top: insets.top + 64 }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.systemScroll}>
          {SYSTEMS.map(s => {
            const active = activeSystem === s.key;
            return (
              <TouchableOpacity
                key={s.key}
                style={[styles.systemPill, active && styles.systemPillActive]}
                onPress={() => setActiveSystem(s.key)}
              >
                <Ionicons name={s.icon} size={13} color={active ? "#fff" : "#6B7280"} />
                <Text style={[styles.systemLabel, active && styles.systemLabelActive]}>{s.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Floating right controls ── */}
      <View style={[styles.floatRight, { top: insets.top + 120 }]}>
        <TouchableOpacity style={styles.floatBtn} onPress={() => viewerRef.current?.resetView()}>
          <Ionicons name="refresh-outline" size={18} color="#D1D5DB" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.floatBtn}>
          <Ionicons name="add-outline" size={20} color="#D1D5DB" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.floatBtn}>
          <Ionicons name="remove-outline" size={20} color="#D1D5DB" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.floatBtn}>
          <Ionicons name="layers-outline" size={17} color="#D1D5DB" />
        </TouchableOpacity>
      </View>

      {/* ── "Tap a bone" hint (when nothing selected) ── */}
      {!selectedBone && (
        <View style={styles.hintWrap} pointerEvents="none">
          <View style={styles.hintPill}>
            <Ionicons name="hand-left-outline" size={13} color="#9CA3AF" />
            <Text style={styles.hintTxt}>Tap a bone to explore</Text>
          </View>
        </View>
      )}

      {/* ── Bone detail panel ── */}
      {selectedBone && (
        <Animated.View
          style={[styles.panel, { transform: [{ translateY: panelY }], paddingBottom: insets.bottom + 8 }]}
        >
          {/* Handle */}
          <TouchableOpacity
            style={styles.handleWrap}
            onPress={() => handleBoneSelect(null)}
            activeOpacity={0.7}
          >
            <View style={styles.handle} />
          </TouchableOpacity>

          {/* Bone header */}
          <View style={styles.panelHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.panelBoneName}>{selectedBone.name}</Text>
              <Text style={styles.panelBoneLatin}>{selectedBone.latinName}</Text>
            </View>
            <View style={[styles.regionBadge]}>
              <Text style={styles.regionBadgeTxt}>{selectedBone.region.replace("-", " ")}</Text>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabRow}>
            {TABS.map(t => (
              <TouchableOpacity
                key={t.key}
                style={[styles.tab, activeTab === t.key && styles.tabActive]}
                onPress={() => setActiveTab(t.key as TabKey)}
              >
                <Text style={[styles.tabTxt, activeTab === t.key && styles.tabTxtActive]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Content */}
          <View style={styles.panelBody}>
            {activeTab === "overview"     && <OverviewPanel     info={selectedBone} />}
            {activeTab === "bonymarkings" && <BonyMarkingsPanel info={selectedBone} />}
            {activeTab === "quiz1"        && <QuizPanel         info={selectedBone} />}
          </View>
        </Animated.View>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000" },

  // Header
  header: {
    position: "absolute", top: 0, left: 0, right: 0,
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 8, paddingBottom: 8,
    gap: 4,
  },
  headerBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center", justifyContent: "center",
  },
  headerCenter: { flex: 1, alignItems: "center" },
  headerTitle:  { fontSize: 15, fontWeight: "700", color: "#FFFFFF", letterSpacing: 0.2 },
  headerSub:    { fontSize: 11, color: "#6B7280", marginTop: 1 },
  headerRight:  { flexDirection: "row", gap: 4 },

  // System selector
  systemRow: {
    position: "absolute", left: 0, right: 0,
  },
  systemScroll: { paddingHorizontal: 12, gap: 6 },
  systemPill: {
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingHorizontal: 11, paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.08)",
  },
  systemPillActive: {
    backgroundColor: "#1D4ED8",
    borderColor: "#3B82F6",
  },
  systemLabel:       { fontSize: 12, color: "#6B7280", fontWeight: "500" },
  systemLabelActive: { color: "#fff", fontWeight: "600" },

  // Floating right controls
  floatRight: {
    position: "absolute", right: 12,
    gap: 8, alignItems: "center",
  },
  floatBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.1)",
    alignItems: "center", justifyContent: "center",
  },

  // Hint
  hintWrap: {
    position: "absolute", bottom: 40, left: 0, right: 0,
    alignItems: "center",
  },
  hintPill: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
  },
  hintTxt: { fontSize: 13, color: "#6B7280" },

  // Detail panel
  panel: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    height: 320,
    backgroundColor: "#111111",
    borderTopLeftRadius: 22, borderTopRightRadius: 22,
    borderTopWidth: 1, borderColor: "rgba(255,255,255,0.08)",
    shadowColor: "#000", shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.5, shadowRadius: 16, elevation: 24,
  },
  handleWrap: { alignItems: "center", paddingVertical: 10 },
  handle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.15)",
  },

  panelHeader: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 18, paddingBottom: 10,
  },
  panelBoneName:  { fontSize: 20, fontWeight: "700", color: "#FFFFFF" },
  panelBoneLatin: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  regionBadge: {
    backgroundColor: "rgba(59,130,246,0.15)",
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: "rgba(59,130,246,0.3)",
  },
  regionBadgeTxt: {
    fontSize: 10, fontWeight: "600", color: "#60A5FA",
    textTransform: "capitalize",
  },

  // Tabs
  tabRow: {
    flexDirection: "row",
    borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.07)",
    marginHorizontal: 18, marginBottom: 0,
  },
  tab: {
    paddingVertical: 8, paddingHorizontal: 14,
    borderBottomWidth: 2, borderBottomColor: "transparent",
    marginBottom: -1,
  },
  tabActive: { borderBottomColor: "#3B82F6" },
  tabTxt:   { fontSize: 13, color: "#6B7280", fontWeight: "500" },
  tabTxtActive: { color: "#60A5FA", fontWeight: "600" },

  panelBody: { flex: 1 },
  panelScroll: { paddingHorizontal: 18, paddingTop: 12, paddingBottom: 16 },

  sectionLabel: {
    fontSize: 10, fontWeight: "700", color: "#4B5563",
    letterSpacing: 1.2, marginBottom: 10,
  },

  artRow: { flexDirection: "row", alignItems: "flex-start", gap: 8, marginBottom: 8 },
  artDot: {
    width: 5, height: 5, borderRadius: 3,
    backgroundColor: "#3B82F6", marginTop: 5, flexShrink: 0,
  },
  artTxt:     { fontSize: 13, color: "#D1D5DB", lineHeight: 20, flex: 1 },
  clinicalTxt:{ fontSize: 13, color: "#D1D5DB", lineHeight: 20 },

  // Bony markings
  markRow:    { flexDirection: "row", gap: 10, marginBottom: 10, alignItems: "flex-start" },
  markIdx:    {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: "rgba(59,130,246,0.2)",
    alignItems: "center", justifyContent: "center",
    flexShrink: 0, marginTop: 1,
  },
  markIdxTxt: { fontSize: 10, fontWeight: "700", color: "#60A5FA" },
  markName:   { fontSize: 13, fontWeight: "600", color: "#E5E7EB" },
  markDesc:   { fontSize: 11, color: "#6B7280", lineHeight: 16, marginTop: 2 },

  // Quiz
  quizOpt: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 10, padding: 12,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.08)",
  },
  quizOptOk:  { backgroundColor: "rgba(34,197,94,0.12)", borderColor: "#22C55E" },
  quizOptBad: { backgroundColor: "rgba(239,68,68,0.12)",  borderColor: "#EF4444" },
  quizOptTxt: { fontSize: 13, color: "#D1D5DB", flex: 1 },
});
