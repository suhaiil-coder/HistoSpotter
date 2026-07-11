import React, { useRef, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import SkeletonViewer, {
  type BoneInfo,
  type SkeletonViewerRef,
} from "../components/SkeletonViewer";
import { BONES } from "../constants/osteologyData";

const { width: SW } = Dimensions.get("window");

// ─── Bottom tab thumbnails ────────────────────────────────────────────────────
type TabKey = "overview" | "bonymarkings" | "quiz1" | "quiz2";

const TABS: { key: TabKey; label: string; icon: any; color: string }[] = [
  { key: "overview",     label: "Overview",       icon: "eye-outline",      color: "#e8d5a3" },
  { key: "bonymarkings", label: "Bony markings",  icon: "location-outline", color: "#c8e0f0" },
  { key: "quiz1",        label: "Quiz #1",         icon: "help-circle-outline", color: "#f0d0c0" },
  { key: "quiz2",        label: "Quiz #2",         icon: "school-outline",   color: "#d0f0d0" },
];

// Lookup full bone data for selected bone
function getBoneData(info: BoneInfo) {
  return BONES.find(b => b.id === info.boneId) ?? null;
}

// ─── Tab card thumbnail ───────────────────────────────────────────────────────
function TabCard({
  tab, active, bone, onPress,
}: { tab: typeof TABS[0]; active: boolean; bone: BoneInfo; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.tabCard, active && styles.tabCardActive]}>
      {/* Small bone silhouette area */}
      <View style={[styles.tabThumb, { backgroundColor: tab.color + "22" }]}>
        <Ionicons name={tab.icon} size={22} color={active ? "#ff8800" : tab.color} />
      </View>
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{tab.label}</Text>
    </TouchableOpacity>
  );
}

// ─── Tab content panels ───────────────────────────────────────────────────────
function OverviewPanel({ info }: { info: BoneInfo }) {
  const bone = getBoneData(info);
  return (
    <View style={styles.panelContent}>
      <Text style={styles.panelTitle}>{info.name}</Text>
      <Text style={styles.panelSub}>{info.latinName}</Text>
      {bone && (
        <>
          <Text style={styles.panelBodyLabel}>Articulations</Text>
          {bone.articulations.slice(0, 4).map((a, i) => (
            <Text key={i} style={styles.panelBodyTxt}>• {a}</Text>
          ))}
          {bone.clinical ? (
            <>
              <Text style={[styles.panelBodyLabel, { color: "#fb923c" }]}>Clinical note</Text>
              <Text style={styles.panelBodyTxt}>{bone.clinical}</Text>
            </>
          ) : null}
        </>
      )}
    </View>
  );
}

function BonyMarkingsPanel({ info }: { info: BoneInfo }) {
  const bone = getBoneData(info);
  if (!bone) return null;
  return (
    <ScrollView contentContainerStyle={styles.panelContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.panelTitle}>Bony Markings</Text>
      <Text style={styles.panelSub}>{bone.features.length} landmarks</Text>
      {bone.features.slice(0, 8).map((f, i) => (
        <View key={f.id} style={styles.markRow}>
          <View style={styles.markNum}><Text style={styles.markNumTxt}>{i + 1}</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.markName}>{f.name}</Text>
            <Text style={styles.markDesc} numberOfLines={2}>{f.desc}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

function QuizPanel({ info, num }: { info: BoneInfo; num: 1 | 2 }) {
  const bone = getBoneData(info);
  const [answered, setAnswered] = useState<string | null>(null);
  if (!bone || bone.features.length < 4) return (
    <View style={styles.panelContent}>
      <Text style={styles.panelTitle}>Quiz #{num}</Text>
      <Text style={styles.panelBodyTxt}>Not enough data for this bone.</Text>
    </View>
  );

  const qi = num === 1 ? 0 : Math.floor(bone.features.length / 2);
  const correct = bone.features[qi]!.name;
  const opts = React.useMemo(() => {
    const wrong = bone.features.filter((_, i) => i !== qi).sort(() => Math.random() - 0.5).slice(0, 3).map(f => f.name);
    return [correct, ...wrong].sort(() => Math.random() - 0.5);
  }, [bone.id, num]);

  return (
    <View style={styles.panelContent}>
      <Text style={styles.panelTitle}>Quiz #{num}</Text>
      <Text style={styles.panelBodyLabel}>What structure is labeled #{qi + 1}?</Text>
      {opts.map(opt => {
        const isC = opt === correct, chosen = answered === opt, rev = !!answered;
        return (
          <TouchableOpacity
            key={opt}
            onPress={() => !answered && setAnswered(opt)}
            style={[styles.quizOpt, rev && isC && styles.quizOptOk, rev && chosen && !isC && styles.quizOptBad]}
          >
            <Text style={[styles.quizOptTxt, rev && isC && { color: "#fff" }]}>{opt}</Text>
            {rev && isC  && <Ionicons name="checkmark-circle" size={16} color="#4ade80" />}
            {rev && chosen && !isC && <Ionicons name="close-circle" size={16} color="#f87171" />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function OsteologyScreen() {
  const viewerRef = useRef<SkeletonViewerRef>(null);
  const [selectedBone, setSelectedBone] = useState<BoneInfo | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [xray, setXray] = useState(false);
  const [markers, setMarkers] = useState(false);
  const [insertions, setInsertions] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  function handleBoneSelect(bone: BoneInfo | null) {
    setSelectedBone(bone);
    setActiveTab("overview");
    setShowPanel(!!bone);
  }

  const ST = StatusBar.currentHeight ?? 0;

  return (
    <View style={styles.root}>
      {/* ── Full-screen 3D Skeleton ── */}
      <SkeletonViewer ref={viewerRef} onBoneSelect={handleBoneSelect} />

      {/* ── Left sidebar ── */}
      <View style={[styles.leftBar, { top: ST + 8 }]}>
        <TouchableOpacity style={styles.leftBtn}>
          <Ionicons name="book-outline" size={20} color="#e2e8f0" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.leftBtn}>
          <Ionicons name="document-text-outline" size={20} color="#e2e8f0" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.leftBtn}>
          <Ionicons name="star" size={20} color="#facc15" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.leftBtn}>
          <Ionicons name="ellipsis-vertical" size={20} color="#e2e8f0" />
        </TouchableOpacity>
      </View>

      {/* ── Top toolbar ── */}
      <View style={[styles.topBar, { top: ST + 8 }]}>
        <View style={styles.topLeft}>
          <TouchableOpacity style={styles.topBtn} onPress={() => viewerRef.current?.resetView()}>
            <Ionicons name="arrow-back" size={18} color="#e2e8f0" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.topBtn}>
            <Ionicons name="arrow-forward" size={18} color="#e2e8f0" />
          </TouchableOpacity>
        </View>
        <View style={styles.topRight}>
          <TouchableOpacity style={styles.topBtn}>
            <Ionicons name="pencil-outline" size={18} color="#e2e8f0" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.topBtn}>
            <Ionicons name="camera-outline" size={18} color="#e2e8f0" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.topBtn}>
            <Ionicons name="add-circle-outline" size={18} color="#e2e8f0" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.topBtn}>
            <Ionicons name="remove-circle-outline" size={18} color="#e2e8f0" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.topBtn}>
            <Ionicons name="settings-outline" size={18} color="#e2e8f0" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Bone name label (when selected) ── */}
      {selectedBone && (
        <View style={styles.boneLabel} pointerEvents="none">
          <Text style={styles.boneLabelName}>{selectedBone.name}</Text>
          <Text style={styles.boneLabelLatin}>{selectedBone.latinName}</Text>
        </View>
      )}

      {/* ── Bottom action bar ── */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomBtn} onPress={() => { setSelectedBone(null); setShowPanel(false); }}>
          <Ionicons name="trash-outline" size={20} color="#94a3b8" />
          <Text style={styles.bottomBtnTxt}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.bottomBtn, xray && styles.bottomBtnOn]} onPress={() => setXray(v => !v)}>
          <Ionicons name="eye-outline" size={20} color={xray ? "#a5b4fc" : "#94a3b8"} />
          <Text style={[styles.bottomBtnTxt, xray && { color: "#a5b4fc" }]}>X-Ray</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.bottomBtn, markers && styles.bottomBtnOn]} onPress={() => setMarkers(v => !v)}>
          <Ionicons name="location-outline" size={20} color={markers ? "#a5b4fc" : "#94a3b8"} />
          <Text style={[styles.bottomBtnTxt, markers && { color: "#a5b4fc" }]}>Markers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.bottomBtn, insertions && styles.bottomBtnOn]} onPress={() => setInsertions(v => !v)}>
          <Ionicons name="color-palette-outline" size={20} color={insertions ? "#a5b4fc" : "#94a3b8"} />
          <Text style={[styles.bottomBtnTxt, insertions && { color: "#a5b4fc" }]}>Insertions</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBtn}>
          <Ionicons name="book-outline" size={20} color="#94a3b8" />
          <Text style={styles.bottomBtnTxt}>More</Text>
        </TouchableOpacity>
      </View>

      {/* ── Bone detail panel (slides up when bone selected) ── */}
      {selectedBone && showPanel && (
        <View style={styles.detailPanel}>
          {/* Dismiss handle */}
          <TouchableOpacity style={styles.panelHandle} onPress={() => setShowPanel(false)}>
            <View style={styles.handleBar} />
          </TouchableOpacity>

          {/* Tab strip */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabStrip}
          >
            {TABS.map(t => (
              <TabCard
                key={t.key}
                tab={t}
                active={activeTab === t.key}
                bone={selectedBone}
                onPress={() => setActiveTab(t.key)}
              />
            ))}
          </ScrollView>

          {/* Content */}
          <View style={{ flex: 1 }}>
            {activeTab === "overview"     && <OverviewPanel     info={selectedBone} />}
            {activeTab === "bonymarkings" && <BonyMarkingsPanel info={selectedBone} />}
            {activeTab === "quiz1"        && <QuizPanel         info={selectedBone} num={1} />}
            {activeTab === "quiz2"        && <QuizPanel         info={selectedBone} num={2} />}
          </View>
        </View>
      )}

      {/* ── Tap-to-open indicator (when bone selected but panel closed) ── */}
      {selectedBone && !showPanel && (
        <TouchableOpacity style={styles.openPanelBtn} onPress={() => setShowPanel(true)}>
          <Ionicons name="chevron-up" size={16} color="#fff" />
          <Text style={styles.openPanelTxt}>View details</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#1e1e2e" },

  // Left sidebar
  leftBar: {
    position: "absolute", left: 10,
    gap: 6,
  },
  leftBtn: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.1)",
  },

  // Top bar
  topBar: {
    position: "absolute", left: 60, right: 10,
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
  },
  topLeft:  { flexDirection: "row", gap: 4 },
  topRight: { flexDirection: "row", gap: 4 },
  topBtn: {
    width: 36, height: 36, borderRadius: 9,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.1)",
  },

  // Bone name label
  boneLabel: {
    position: "absolute", bottom: 160, left: 0, right: 0,
    alignItems: "center",
  },
  boneLabelName:  { fontSize: 22, fontWeight: "700", color: "#ffffff" },
  boneLabelLatin: { fontSize: 13, color: "#94a3b8", marginTop: 2 },

  // Bottom action bar
  bottomBar: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    flexDirection: "row",
    backgroundColor: "rgba(15,15,30,0.92)",
    paddingVertical: 10, paddingBottom: 22,
    borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.08)",
  },
  bottomBtn:    { flex: 1, alignItems: "center", gap: 4 },
  bottomBtnOn:  { },
  bottomBtnTxt: { fontSize: 10, color: "#64748b", fontWeight: "500" },

  // Detail panel
  detailPanel: {
    position: "absolute", bottom: 70, left: 0, right: 0,
    height: 300,
    backgroundColor: "rgba(15,15,30,0.96)",
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.1)",
  },
  panelHandle: { alignItems: "center", paddingVertical: 8 },
  handleBar:   { width: 36, height: 4, borderRadius: 2, backgroundColor: "#334155" },

  // Tab strip
  tabStrip: { paddingHorizontal: 14, gap: 10, paddingBottom: 8 },
  tabCard:   {
    width: 80, alignItems: "center", gap: 6,
    opacity: 0.65,
  },
  tabCardActive: { opacity: 1 },
  tabThumb:  {
    width: 72, height: 56, borderRadius: 10,
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.1)",
  },
  tabLabel:       { fontSize: 10, color: "#94a3b8", textAlign: "center" },
  tabLabelActive: { color: "#ff8800", fontWeight: "600" },

  // Panel content
  panelContent: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 12 },
  panelTitle:   { fontSize: 17, fontWeight: "700", color: "#f1f5f9", marginBottom: 2 },
  panelSub:     { fontSize: 12, color: "#64748b", marginBottom: 10 },
  panelBodyLabel: { fontSize: 11, fontWeight: "700", color: "#6366f1", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6, marginTop: 8 },
  panelBodyTxt:   { fontSize: 13, color: "#94a3b8", lineHeight: 19, marginBottom: 4 },

  // Bony markings
  markRow:    { flexDirection: "row", gap: 10, marginBottom: 8, alignItems: "flex-start" },
  markNum:    { width: 22, height: 22, borderRadius: 11, backgroundColor: "#312e81", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 },
  markNumTxt: { fontSize: 10, fontWeight: "700", color: "#a5b4fc" },
  markName:   { fontSize: 13, fontWeight: "600", color: "#e2e8f0" },
  markDesc:   { fontSize: 11, color: "#64748b", lineHeight: 16, marginTop: 1 },

  // Quiz
  quizOpt:    {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: "#1e293b", borderRadius: 10, padding: 12, marginBottom: 7,
    borderWidth: 1, borderColor: "#334155",
  },
  quizOptOk:  { backgroundColor: "#14532d", borderColor: "#22c55e" },
  quizOptBad: { backgroundColor: "#450a0a", borderColor: "#ef4444" },
  quizOptTxt: { fontSize: 13, color: "#cbd5e1", flex: 1 },

  // Open panel button
  openPanelBtn: {
    position: "absolute", bottom: 80,
    alignSelf: "center",
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: "rgba(99,102,241,0.85)",
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
  },
  openPanelTxt: { color: "#fff", fontSize: 13, fontWeight: "600" },
});
