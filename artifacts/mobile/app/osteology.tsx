import React, { useCallback, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { BONES, REGIONS, type Bone, type Region } from "../constants/osteologyData";
import BoneViewer3D, { type BoneViewer3DRef } from "../components/BoneViewer3D";

type Screen = "home" | "boneList" | "boneDetail";
type TabKey = "overview" | "mainparts" | "bonymarkings" | "quiz1" | "quiz2" | "quiz3";

const TABS: { key: TabKey; label: string }[] = [
  { key: "overview",     label: "Overview" },
  { key: "mainparts",    label: "Main parts" },
  { key: "bonymarkings", label: "Bony markings" },
  { key: "quiz1",        label: "Quiz #1" },
  { key: "quiz2",        label: "Quiz #2" },
  { key: "quiz3",        label: "Quiz #3" },
];

const SECTIONS = [
  { id: "bones",   title: "Bones",   subtitle: "Skeletal system" },
  { id: "joints",  title: "Joints",  subtitle: "Articular system" },
  { id: "muscles", title: "Muscles", subtitle: null },
];

const { width: SW, height: SH } = Dimensions.get("window");
const CARD_W = (SW - 48) / 2;
const CARD_H = CARD_W * 1.1;

const GRAD: Record<string, [string, string]> = {
  "upper-limb":       ["#064e3b", "#0d9488"],
  "lower-limb":       ["#78350f", "#d97706"],
  "skull":            ["#0c4a6e", "#0ea5e9"],
  "vertebral-column": ["#7f1d1d", "#ef4444"],
  "thorax":           ["#4c1d95", "#7c3aed"],
};

function typeColor(type: string): string {
  switch (type) {
    case "process":      return "#f59e0b";
    case "fossa":        return "#3b82f6";
    case "groove":       return "#8b5cf6";
    case "foramen":      return "#ef4444";
    case "surface":      return "#10b981";
    case "border":       return "#06b6d4";
    case "articulation": return "#6366f1";
    case "marking":      return "#ec4899";
    default:             return "#94a3b8";
  }
}

// ─── Bone silhouette icons ───────────────────────────────────────────────────
function BoneIcon({ regionId, size = 72 }: { regionId: string; size?: number }) {
  const s = size;
  if (regionId === "skull") {
    return (
      <View style={{ width: s, height: s, alignItems: "center", justifyContent: "center" }}>
        <View style={{ width: s * 0.7, height: s * 0.62, borderRadius: s * 0.35,
          backgroundColor: "rgba(255,255,255,0.15)", borderWidth: 2, borderColor: "rgba(255,255,255,0.32)" }} />
        <View style={{ flexDirection: "row", gap: 3, marginTop: -4 }}>
          <View style={{ width: s*0.18, height: s*0.12, backgroundColor: "rgba(0,0,0,0.5)", borderRadius: 3 }} />
          <View style={{ width: s*0.08, height: s*0.08, backgroundColor: "rgba(0,0,0,0.4)", borderRadius: 2 }} />
          <View style={{ width: s*0.18, height: s*0.12, backgroundColor: "rgba(0,0,0,0.5)", borderRadius: 3 }} />
        </View>
        <View style={{ width: s*0.5, height: s*0.16, borderRadius: 4,
          backgroundColor: "rgba(255,255,255,0.1)", marginTop: 2, borderWidth: 1, borderColor: "rgba(255,255,255,0.2)" }} />
      </View>
    );
  }
  if (regionId === "thorax") {
    return (
      <View style={{ width: s, height: s, alignItems: "center", justifyContent: "center", gap: 2 }}>
        <View style={{ width: s*0.12, height: s*0.6, borderRadius: 4,
          backgroundColor: "rgba(255,255,255,0.2)", position: "absolute" }} />
        {[0.62, 0.74, 0.82, 0.78, 0.7, 0.6].map((r, i) => (
          <View key={i} style={{ width: s * r, height: 3.5, borderRadius: 2,
            backgroundColor: "rgba(255,255,255,0.18)", borderWidth: 0.5, borderColor: "rgba(255,255,255,0.3)" }} />
        ))}
      </View>
    );
  }
  if (regionId === "vertebral-column") {
    return (
      <View style={{ width: s, height: s, alignItems: "center", justifyContent: "center", gap: 3 }}>
        {[0.48, 0.44, 0.42, 0.4, 0.38, 0.36, 0.32].map((r, i) => (
          <View key={i} style={{ width: s * r, height: s * 0.08, borderRadius: 3,
            backgroundColor: "rgba(255,255,255,0.18)", borderWidth: 0.5, borderColor: "rgba(255,255,255,0.28)" }} />
        ))}
      </View>
    );
  }
  if (regionId === "upper-limb") {
    return (
      <View style={{ width: s, height: s, alignItems: "center", justifyContent: "center" }}>
        <View style={{ width: s*0.18, height: s*0.48, borderRadius: s*0.09,
          backgroundColor: "rgba(255,255,255,0.18)", borderWidth: 2, borderColor: "rgba(255,255,255,0.32)", marginBottom: 3 }} />
        <View style={{ flexDirection: "row", gap: 2 }}>
          {[0.1, 0.14, 0.14, 0.12, 0.09].map((w, i) => (
            <View key={i} style={{ width: w*s, height: s*0.25, borderRadius: s*0.05,
              backgroundColor: "rgba(255,255,255,0.15)", borderWidth: 1, borderColor: "rgba(255,255,255,0.22)" }} />
          ))}
        </View>
      </View>
    );
  }
  return (
    <View style={{ width: s, height: s, alignItems: "center", justifyContent: "center" }}>
      <View style={{ width: s*0.2, height: s*0.5, borderRadius: s*0.1,
        backgroundColor: "rgba(255,255,255,0.18)", borderWidth: 2, borderColor: "rgba(255,255,255,0.32)", marginBottom: 3 }} />
      <View style={{ flexDirection: "row", gap: 2 }}>
        {[0.11, 0.15, 0.15, 0.13, 0.1].map((w, i) => (
          <View key={i} style={{ width: w*s, height: s*0.22, borderRadius: s*0.04,
            backgroundColor: "rgba(255,255,255,0.15)", borderWidth: 1, borderColor: "rgba(255,255,255,0.22)" }} />
        ))}
      </View>
    </View>
  );
}

// ─── Region card ─────────────────────────────────────────────────────────────
function RegionCard({ region, onPress }: { region: Region; onPress: () => void }) {
  const grad = GRAD[region.id] ?? ["#1e293b", "#334155"];
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.82} style={[styles.card, { width: CARD_W, height: CARD_H }]}>
      <LinearGradient colors={grad} style={styles.cardGrad} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <BoneIcon regionId={region.id} size={72} />
        </View>
        <View>
          <Text style={styles.cardName}>{region.name}</Text>
          <Text style={styles.cardSub}>{region.boneIds.length} bones</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

// ─── Section header ──────────────────────────────────────────────────────────
function SectionHeader({
  title, subtitle, collapsed, onToggle,
}: { title: string; subtitle: string | null; collapsed: boolean; onToggle: () => void }) {
  return (
    <TouchableOpacity onPress={onToggle} activeOpacity={0.7} style={styles.secHeader}>
      <View>
        <Text style={styles.secTitle}>{title}</Text>
        {subtitle && <Text style={styles.secSub}>{subtitle}</Text>}
      </View>
      <Ionicons name={collapsed ? "chevron-down" : "chevron-up"} size={20} color="#64748b" />
    </TouchableOpacity>
  );
}

// ─── Quiz screens ─────────────────────────────────────────────────────────────
function QuizOne({ bone }: { bone: Bone }) {
  const pool = bone.features.filter(f => f.name.length < 40);
  const qi   = useRef(Math.floor(Math.random() * Math.min(pool.length, 8))).current;
  const [answered, setAnswered] = useState<string | null>(null);
  if (pool.length < 4) return <Text style={styles.contentText}>Not enough markers for this quiz.</Text>;

  const correct = pool[qi]!.name;
  const opts = [
    correct,
    ...pool.filter((_, i) => i !== qi).sort(() => Math.random() - 0.5).slice(0, 3).map(f => f.name),
  ].sort(() => Math.random() - 0.5);

  return (
    <View style={styles.quizWrap}>
      <View style={styles.quizPromptRow}>
        <View style={styles.markerBadge}><Text style={styles.markerNum}>{qi + 1}</Text></View>
        <Text style={styles.quizQ}>What structure is labeled #{qi + 1}?</Text>
      </View>
      <Text style={styles.quizHint}>Enable Markers → rotate to find #{qi + 1}</Text>
      {opts.map(opt => {
        const isC = opt === correct, chosen = answered === opt, rev = !!answered;
        return (
          <TouchableOpacity key={opt} onPress={() => !answered && setAnswered(opt)}
            style={[styles.quizOpt, rev && isC && styles.quizOptOk, rev && chosen && !isC && styles.quizOptBad]}>
            <Text style={[styles.quizOptTxt, rev && isC && { color: "#fff" }]}>{opt}</Text>
            {rev && isC && <Ionicons name="checkmark-circle" size={18} color="#fff" />}
            {rev && chosen && !isC && <Ionicons name="close-circle" size={18} color="#fff" />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function QuizTwo({ bone }: { bone: Bone }) {
  const feat = useRef(bone.features[Math.floor(Math.random() * bone.features.length)]!).current;
  const [rev, setRev] = useState(false);
  return (
    <View style={styles.quizWrap}>
      <Text style={styles.quizQ}>Identify the structure from its description:</Text>
      <View style={styles.quizDescBox}><Text style={styles.quizDesc}>{feat.desc}</Text></View>
      {!rev
        ? <TouchableOpacity style={styles.revealBtn} onPress={() => setRev(true)}>
            <Text style={styles.revealBtnTxt}>Reveal Answer</Text>
          </TouchableOpacity>
        : <View style={styles.answerBox}>
            <Text style={styles.answerLabel}>ANSWER</Text>
            <Text style={styles.answerTxt}>{feat.name}</Text>
          </View>
      }
    </View>
  );
}

function QuizThree({ bone }: { bone: Bone }) {
  const [rev, setRev] = useState(false);
  const note = bone.muscleNote ?? "Muscle attachment data coming soon.";
  return (
    <View style={styles.quizWrap}>
      <Text style={styles.quizQ}>Name the muscles attaching to the {bone.name}:</Text>
      <View style={styles.quizDescBox}>
        <Text style={styles.quizDesc}>Think about origin and insertion sites, then reveal.</Text>
      </View>
      {!rev
        ? <TouchableOpacity style={styles.revealBtn} onPress={() => setRev(true)}>
            <Text style={styles.revealBtnTxt}>Reveal Answer</Text>
          </TouchableOpacity>
        : <View style={styles.answerBox}>
            <Text style={styles.answerTxt}>{note}</Text>
          </View>
      }
    </View>
  );
}

// ─── Tab content ──────────────────────────────────────────────────────────────
function TabContent({ tab, bone }: { tab: TabKey; bone: Bone }) {
  if (tab === "quiz1") return <QuizOne bone={bone} />;
  if (tab === "quiz2") return <QuizTwo bone={bone} />;
  if (tab === "quiz3") return <QuizThree bone={bone} />;

  if (tab === "overview") return (
    <ScrollView contentContainerStyle={styles.contentPad} showsVerticalScrollIndicator={false}>
      <Text style={styles.secLabel}>Description</Text>
      <Text style={styles.contentText}>
        The <Text style={{ color: "#e2e8f0", fontWeight: "600" }}>{bone.name}</Text> is a {bone.side === "paired" ? "paired" : "single"} bone of the {bone.regionId.replace(/-/g, " ")} region, with {bone.features.length} named bony landmarks.
      </Text>
      <Text style={styles.contentText}>{bone.features[0]?.desc ?? ""}</Text>
      {bone.clinical && (
        <>
          <Text style={[styles.secLabel, { marginTop: 12 }]}>Clinical note</Text>
          <View style={styles.clinicalBox}>
            <Ionicons name="medkit-outline" size={15} color="#fb923c" style={{ marginTop: 1 }} />
            <Text style={styles.clinicalTxt}>{bone.clinical}</Text>
          </View>
        </>
      )}
      <Text style={[styles.secLabel, { marginTop: 12 }]}>Articulations</Text>
      {bone.articulations.map((a, i) => (
        <View key={i} style={styles.artRow}>
          <View style={styles.artDot} />
          <Text style={styles.artTxt}>{a}</Text>
        </View>
      ))}
    </ScrollView>
  );

  if (tab === "mainparts") return (
    <ScrollView contentContainerStyle={styles.contentPad} showsVerticalScrollIndicator={false}>
      <Text style={styles.secLabel}>Views & surfaces</Text>
      {bone.views.map((v, i) => (
        <View key={i} style={styles.viewCard}>
          <Text style={styles.viewLabel}>{v.label}</Text>
          <Text style={styles.viewSub}>{v.sublabel}</Text>
        </View>
      ))}
      <Text style={[styles.secLabel, { marginTop: 12 }]}>Key features ({bone.features.length})</Text>
      {bone.features.slice(0, 7).map(f => (
        <View key={f.id} style={styles.featureRow}>
          <View style={[styles.featureDot, { backgroundColor: typeColor(f.type) }]} />
          <Text style={styles.featureName}>{f.name}</Text>
          <Text style={[styles.featureType, { color: typeColor(f.type) }]}>{f.type}</Text>
        </View>
      ))}
      {bone.features.length > 7 && (
        <Text style={styles.moreHint}>+{bone.features.length - 7} more in Bony Markings tab</Text>
      )}
    </ScrollView>
  );

  if (tab === "bonymarkings") return (
    <ScrollView contentContainerStyle={styles.contentPad} showsVerticalScrollIndicator={false}>
      <Text style={styles.secLabel}>All landmarks ({bone.features.length})</Text>
      {bone.features.map((f, i) => (
        <View key={f.id} style={styles.markCard}>
          <View style={styles.markHeader}>
            <View style={[styles.markNum, { backgroundColor: typeColor(f.type) + "30" }]}>
              <Text style={[styles.markNumTxt, { color: typeColor(f.type) }]}>{i + 1}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.markName}>{f.name}</Text>
              <Text style={[styles.markType, { color: typeColor(f.type) }]}>{f.type}</Text>
            </View>
          </View>
          <Text style={styles.markDesc}>{f.desc}</Text>
        </View>
      ))}
    </ScrollView>
  );

  return null;
}

// ─── Bone detail (full-screen 3D + panel) ────────────────────────────────────
function BoneDetailView({ bone, onBack }: { bone: Bone; onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [showMarkers, setShowMarkers] = useState(false);
  const viewerRef = useRef<BoneViewer3DRef>(null);

  const ST = StatusBar.currentHeight ?? 44;
  const VIEWER_H = SH * 0.44;

  const toggleMarkers = () => {
    const next = !showMarkers;
    setShowMarkers(next);
    viewerRef.current?.setMarkers(next);
    if (next) setActiveTab("bonymarkings");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#111827" }}>
      {/* ── 3D Viewer ────────────────────────────────────────── */}
      <View style={{ height: VIEWER_H }}>
        <BoneViewer3D ref={viewerRef} boneId={bone.id} showMarkers={showMarkers} />

        {/* Top bar overlay */}
        <View style={[styles.topBar, { paddingTop: ST + 4 }]} pointerEvents="box-none">
          <TouchableOpacity onPress={onBack} style={styles.tbBtn}>
            <Ionicons name="arrow-back" size={22} color="#e2e8f0" />
          </TouchableOpacity>
          <Text style={styles.tbTitle} numberOfLines={1}>{bone.name}</Text>
          <TouchableOpacity style={styles.tbBtn} onPress={() => viewerRef.current?.resetView()}>
            <Ionicons name="refresh-outline" size={20} color="#94a3b8" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.tbBtn}>
            <Ionicons name="camera-outline" size={20} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        {/* Rotation hint */}
        <View style={styles.rotHint} pointerEvents="none">
          <Ionicons name="swap-horizontal-outline" size={13} color="rgba(255,255,255,0.3)" />
          <Text style={styles.rotHintTxt}>Drag to rotate · Pinch to zoom</Text>
        </View>
      </View>

      {/* ── Bottom toolbar (icon row) ─────────────────────────── */}
      <View style={styles.iconRow}>
        {([
          { icon: "location-outline", label: "Markers", active: showMarkers, onPress: toggleMarkers },
          { icon: "list-outline",     label: "Labels",  active: activeTab === "bonymarkings", onPress: () => setActiveTab("bonymarkings") },
          { icon: "school-outline",   label: "Quiz",    active: activeTab === "quiz1", onPress: () => setActiveTab("quiz1") },
          { icon: "compass-outline",  label: "Reset",   active: false, onPress: () => viewerRef.current?.resetView() },
        ] as { icon: any; label: string; active: boolean; onPress: () => void }[]).map(btn => (
          <TouchableOpacity key={btn.label} style={[styles.iconBtn, btn.active && styles.iconBtnOn]} onPress={btn.onPress}>
            <Ionicons name={btn.icon} size={19} color={btn.active ? "#a5b4fc" : "#64748b"} />
            <Text style={[styles.iconLabel, btn.active && { color: "#a5b4fc" }]}>{btn.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Bottom panel ──────────────────────────────────────── */}
      <View style={styles.panel}>
        {/* Bone name */}
        <View style={styles.panelNameRow}>
          <View style={[styles.panelDot, { backgroundColor: bone.color }]} />
          <View style={{ flex: 1 }}>
            <Text style={styles.panelName}>{bone.name}</Text>
            <Text style={styles.panelMeta}>{bone.side === "paired" ? "Paired" : "Single"} · {bone.features.length} landmarks · {bone.articulations.length} joints</Text>
          </View>
        </View>

        {/* Tab strip */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabStrip}>
          {TABS.map(t => (
            <TouchableOpacity key={t.key} style={[styles.tab, activeTab === t.key && styles.tabOn]} onPress={() => setActiveTab(t.key)}>
              <Text style={[styles.tabTxt, activeTab === t.key && styles.tabTxtOn]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Content */}
        <View style={{ flex: 1 }}>
          <TabContent tab={activeTab} bone={bone} />
        </View>
      </View>
    </View>
  );
}

// ─── Bone list ────────────────────────────────────────────────────────────────
function BoneListView({ region, onBack, onSelect }: {
  region: Region; onBack: () => void; onSelect: (b: Bone) => void;
}) {
  const bones = BONES.filter(b => region.boneIds.includes(b.id));
  const grad  = GRAD[region.id] ?? ["#1e293b", "#334155"];

  return (
    <View style={{ flex: 1, backgroundColor: "#0f172a" }}>
      <LinearGradient colors={grad} style={styles.listHdr} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }}>
        <SafeAreaView edges={["top"]}>
          <View style={styles.listHdrRow}>
            <TouchableOpacity onPress={onBack} style={styles.listBackBtn}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>
            <View>
              <Text style={styles.listHdrTitle}>{region.name}</Text>
              <Text style={styles.listHdrSub}>{region.subtitle}</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <FlatList
        data={bones}
        keyExtractor={b => b.id}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        renderItem={({ item: b }) => (
          <TouchableOpacity style={styles.boneItem} onPress={() => onSelect(b)} activeOpacity={0.8}>
            <View style={[styles.boneIcon, { backgroundColor: b.color + "22" }]}>
              <Ionicons name="cube-outline" size={22} color={b.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.boneName2}>{b.name}</Text>
              <Text style={styles.boneSub}>{b.features.length} landmarks · {b.articulations.length} joints</Text>
            </View>
            <View style={styles.boneMeta}>
              <View style={[styles.boneBadge, { backgroundColor: b.side === "paired" ? "#1e3a5f" : "#1a2e1a" }]}>
                <Text style={[styles.boneBadgeTxt, { color: b.side === "paired" ? "#60a5fa" : "#4ade80" }]}>
                  {b.side}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#475569" />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

// ─── Home ─────────────────────────────────────────────────────────────────────
function HomeView({ onSelectRegion }: { onSelectRegion: (r: Region) => void }) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const toggle = (id: string) => setCollapsed(p => ({ ...p, [id]: !p[id] }));

  return (
    <View style={{ flex: 1, backgroundColor: "#0f172a" }}>
      <SafeAreaView edges={["top"]} style={{ backgroundColor: "#0f172a" }}>
        <View style={{ paddingHorizontal: 20, paddingTop: 4, paddingBottom: 6 }}>
          <Text style={styles.homeTitle}>Osteology</Text>
          <Text style={styles.homeSub}>Human skeletal system</Text>
        </View>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={16} color="#475569" />
          <Text style={styles.searchPh}>Search bones, landmarks…</Text>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 36 }}>
        {SECTIONS.map(sec => (
          <View key={sec.id}>
            <SectionHeader
              title={sec.title}
              subtitle={sec.subtitle}
              collapsed={!!collapsed[sec.id]}
              onToggle={() => toggle(sec.id)}
            />
            {!collapsed[sec.id] && (
              <View style={styles.grid}>
                {REGIONS.map(r => (
                  <RegionCard key={r.id} region={r} onPress={() => onSelectRegion(r)} />
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function OsteologyScreen() {
  const [screen, setScreen]           = useState<Screen>("home");
  const [selectedRegion, setRegion]   = useState<Region | null>(null);
  const [selectedBone, setBone]       = useState<Bone | null>(null);

  const goHome = useCallback(() => { setScreen("home"); setRegion(null); setBone(null); }, []);
  const goList = useCallback(() => { setScreen("boneList"); setBone(null); }, []);

  if (screen === "boneDetail" && selectedBone)
    return <BoneDetailView bone={selectedBone} onBack={goList} />;

  if (screen === "boneList" && selectedRegion)
    return (
      <BoneListView
        region={selectedRegion}
        onBack={goHome}
        onSelect={b => { setBone(b); setScreen("boneDetail"); }}
      />
    );

  return (
    <HomeView
      onSelectRegion={r => { setRegion(r); setScreen("boneList"); }}
    />
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // Home
  homeTitle:  { fontSize: 26, fontWeight: "700", color: "#f1f5f9", letterSpacing: -0.3 },
  homeSub:    { fontSize: 13, color: "#64748b", marginTop: 2 },
  searchBar:  { flexDirection: "row", alignItems: "center", gap: 8, marginHorizontal: 16, marginBottom: 10, marginTop: 2,
                backgroundColor: "#1e293b", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10,
                borderWidth: 1, borderColor: "#334155" },
  searchPh:   { fontSize: 14, color: "#475569" },

  // Section
  secHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between",
               paddingHorizontal: 20, paddingVertical: 13, borderTopWidth: 1, borderTopColor: "#1e293b", marginTop: 2 },
  secTitle:  { fontSize: 16, fontWeight: "700", color: "#e2e8f0" },
  secSub:    { fontSize: 11, color: "#64748b", marginTop: 1 },

  // Grid
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, paddingHorizontal: 16, paddingBottom: 4 },
  card:     { borderRadius: 16, overflow: "hidden" },
  cardGrad: { flex: 1, padding: 14, justifyContent: "space-between" },
  cardName: { fontSize: 13, fontWeight: "700", color: "#fff" },
  cardSub:  { fontSize: 11, color: "rgba(255,255,255,0.55)", marginTop: 2 },

  // Bone list
  listHdr:      { paddingHorizontal: 20, paddingBottom: 18 },
  listHdrRow:   { flexDirection: "row", alignItems: "center", gap: 14, paddingTop: 8 },
  listBackBtn:  { width: 38, height: 38, borderRadius: 19, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" },
  listHdrTitle: { fontSize: 20, fontWeight: "700", color: "#fff" },
  listHdrSub:   { fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 2 },
  boneItem:  { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "#1e293b",
               borderRadius: 14, padding: 14, borderWidth: 1, borderColor: "#334155" },
  boneIcon:  { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  boneName2: { fontSize: 15, fontWeight: "600", color: "#e2e8f0" },
  boneSub:   { fontSize: 12, color: "#64748b", marginTop: 2 },
  boneMeta:  { flexDirection: "row", alignItems: "center", gap: 8 },
  boneBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  boneBadgeTxt: { fontSize: 10, fontWeight: "600" },

  // Bone detail — top bar
  topBar: { position: "absolute", top: 0, left: 0, right: 0, flexDirection: "row", alignItems: "center",
            paddingHorizontal: 6, paddingBottom: 8, backgroundColor: "rgba(17,24,39,0.6)" },
  tbBtn:   { width: 38, height: 38, alignItems: "center", justifyContent: "center", borderRadius: 19 },
  tbTitle: { flex: 1, fontSize: 16, fontWeight: "700", color: "#f1f5f9", marginHorizontal: 4 },
  rotHint: { position: "absolute", bottom: 8, left: 0, right: 0,
             flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5 },
  rotHintTxt: { fontSize: 11, color: "rgba(255,255,255,0.3)" },

  // Icon row
  iconRow:   { flexDirection: "row", backgroundColor: "#0d1321", borderTopWidth: 1, borderTopColor: "#1e293b", paddingVertical: 5 },
  iconBtn:   { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 5, gap: 3, borderRadius: 8 },
  iconBtnOn: { backgroundColor: "#1e2a4a" },
  iconLabel: { fontSize: 9, color: "#64748b", fontWeight: "500" },

  // Panel
  panel:        { flex: 1, backgroundColor: "#0f172a", borderTopWidth: 1, borderTopColor: "#1e293b" },
  panelNameRow: { flexDirection: "row", alignItems: "center", gap: 10, padding: 12, paddingBottom: 8 },
  panelDot:     { width: 10, height: 10, borderRadius: 5, flexShrink: 0 },
  panelName:    { fontSize: 18, fontWeight: "700", color: "#f1f5f9" },
  panelMeta:    { fontSize: 11, color: "#64748b", marginTop: 1 },

  // Tabs
  tabStrip: { paddingHorizontal: 12, gap: 6, paddingBottom: 8 },
  tab:      { paddingHorizontal: 13, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: "#1e293b", backgroundColor: "#1e293b" },
  tabOn:    { backgroundColor: "#312e81", borderColor: "#6366f1" },
  tabTxt:   { fontSize: 13, color: "#64748b", fontWeight: "500" },
  tabTxtOn: { color: "#c7d2fe", fontWeight: "600" },

  // Content
  secLabel:    { fontSize: 10, fontWeight: "700", color: "#6366f1", textTransform: "uppercase", letterSpacing: 0.9, marginBottom: 8 },
  contentPad:  { padding: 14 },
  contentText: { fontSize: 14, color: "#94a3b8", lineHeight: 20, marginBottom: 8 },
  clinicalBox: { flexDirection: "row", gap: 8, backgroundColor: "#431407", padding: 12,
                 borderRadius: 10, borderLeftWidth: 3, borderLeftColor: "#fb923c" },
  clinicalTxt: { flex: 1, fontSize: 13, color: "#fdba74", lineHeight: 19 },
  artRow:  { flexDirection: "row", alignItems: "flex-start", gap: 8, marginBottom: 6 },
  artDot:  { width: 6, height: 6, borderRadius: 3, backgroundColor: "#6366f1", marginTop: 7, flexShrink: 0 },
  artTxt:  { flex: 1, fontSize: 13, color: "#94a3b8", lineHeight: 19 },
  viewCard:  { backgroundColor: "#1e293b", borderRadius: 10, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: "#334155" },
  viewLabel: { fontSize: 14, fontWeight: "600", color: "#e2e8f0" },
  viewSub:   { fontSize: 12, color: "#64748b", marginTop: 2 },
  featureRow:  { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
  featureDot:  { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  featureName: { flex: 1, fontSize: 13, color: "#cbd5e1" },
  featureType: { fontSize: 10, fontWeight: "600", textTransform: "uppercase" },
  moreHint:    { fontSize: 12, color: "#475569", fontStyle: "italic", marginTop: 4 },
  markCard:    { backgroundColor: "#1e293b", borderRadius: 12, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: "#334155" },
  markHeader:  { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 6 },
  markNum:     { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  markNumTxt:  { fontSize: 12, fontWeight: "700" },
  markName:    { fontSize: 13, fontWeight: "600", color: "#e2e8f0" },
  markType:    { fontSize: 10, fontWeight: "600", textTransform: "uppercase", marginTop: 1 },
  markDesc:    { fontSize: 12, color: "#94a3b8", lineHeight: 18 },

  // Quiz
  quizWrap:     { padding: 14 },
  quizPromptRow:{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 6 },
  markerBadge:  { width: 28, height: 28, borderRadius: 14, backgroundColor: "#6366f1", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  markerNum:    { fontSize: 12, fontWeight: "700", color: "#fff" },
  quizQ:        { flex: 1, fontSize: 14, fontWeight: "600", color: "#e2e8f0" },
  quizHint:     { fontSize: 12, color: "#475569", marginBottom: 12 },
  quizOpt:      { flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                  backgroundColor: "#1e293b", borderRadius: 12, padding: 13, marginBottom: 8,
                  borderWidth: 1, borderColor: "#334155" },
  quizOptOk:    { backgroundColor: "#14532d", borderColor: "#22c55e" },
  quizOptBad:   { backgroundColor: "#450a0a", borderColor: "#ef4444" },
  quizOptTxt:   { fontSize: 14, color: "#cbd5e1", flex: 1 },
  quizDescBox:  { backgroundColor: "#1e293b", borderRadius: 12, padding: 13, marginVertical: 10, borderWidth: 1, borderColor: "#334155" },
  quizDesc:     { fontSize: 13, color: "#94a3b8", lineHeight: 19 },
  revealBtn:    { backgroundColor: "#312e81", borderRadius: 12, padding: 14, alignItems: "center" },
  revealBtnTxt: { color: "#c7d2fe", fontWeight: "600", fontSize: 15 },
  answerBox:    { backgroundColor: "#14532d", borderRadius: 12, padding: 13, borderWidth: 1, borderColor: "#22c55e" },
  answerLabel:  { fontSize: 10, fontWeight: "700", color: "#4ade80", marginBottom: 4 },
  answerTxt:    { fontSize: 14, color: "#bbf7d0", lineHeight: 20 },
});
