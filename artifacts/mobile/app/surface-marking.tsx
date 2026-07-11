import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  type ImageSourcePropType,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const { width: SW, height: SH } = Dimensions.get("window");

// ── Images pre-required at module level ──────────────────────────────────────
const IMGS: Record<string, ImageSourcePropType> = {
  ul_arteries:    require("../assets/surface-marking/ul_arteries.jpg"),
  ul_nerves:      require("../assets/surface-marking/ul_nerves.jpg"),
  ul_hand:        require("../assets/surface-marking/ul_hand.jpg"),
  ll_arteries:    require("../assets/surface-marking/ll_arteries.jpg"),
  ll_nerves:      require("../assets/surface-marking/ll_nerves.jpg"),
  thorax_lungs:   require("../assets/surface-marking/thorax_lungs.jpg"),
  thorax_pleura:  require("../assets/surface-marking/thorax_pleura.jpg"),
  thorax_other:   require("../assets/surface-marking/thorax_other.jpg"),
  abd_planes:     require("../assets/surface-marking/abd_planes.jpg"),
  abd_organs1:    require("../assets/surface-marking/abd_organs1.jpg"),
  abd_organs2:    require("../assets/surface-marking/abd_organs2.jpg"),
  abd_kidney:     require("../assets/surface-marking/abd_kidney.jpg"),
  hn_arteries:    require("../assets/surface-marking/hn_arteries.jpg"),
  hn_veins:       require("../assets/surface-marking/hn_veins.jpg"),
};

// ── Types ─────────────────────────────────────────────────────────────────────
type Topic = {
  id: string;
  name: string;
  sub: string;
  img: ImageSourcePropType;
  accent: string;
};

type Region = {
  id: string;
  label: string;
  color: string;
  topics: Topic[];
};

// ── Data ─────────────────────────────────────────────────────────────────────
const REGIONS: Region[] = [
  {
    id: "upper",
    label: "Upper Limb",
    color: "#10B981",
    topics: [
      {
        id: "ul1",
        name: "Arteries",
        sub: "Axillary · Brachial · Radial · Ulnar",
        img: IMGS.ul_arteries,
        accent: "#10B981",
      },
      {
        id: "ul2",
        name: "Nerves",
        sub: "Median · Musculocutaneous · Radial · Ulnar",
        img: IMGS.ul_nerves,
        accent: "#34D399",
      },
      {
        id: "ul3",
        name: "Wrist & Hand",
        sub: "Retinacula · Superficial & Deep Palmar Arch",
        img: IMGS.ul_hand,
        accent: "#6EE7B7",
      },
    ],
  },
  {
    id: "lower",
    label: "Lower Limb",
    color: "#F59E0B",
    topics: [
      {
        id: "ll1",
        name: "Arteries",
        sub: "Femoral · Popliteal · Tibial · Dorsalis Pedis",
        img: IMGS.ll_arteries,
        accent: "#F59E0B",
      },
      {
        id: "ll2",
        name: "Nerves & Misc",
        sub: "Sciatic Nerve · Extensor & Flexor Retinacula",
        img: IMGS.ll_nerves,
        accent: "#FCD34D",
      },
    ],
  },
  {
    id: "abdomen",
    label: "Abdomen",
    color: "#EF4444",
    topics: [
      {
        id: "ab1",
        name: "Planes",
        sub: "Median Vertical Plane",
        img: IMGS.abd_planes,
        accent: "#EF4444",
      },
      {
        id: "ab2",
        name: "Organs I",
        sub: "Inguinal Canal · Stomach · Liver",
        img: IMGS.abd_organs1,
        accent: "#F87171",
      },
      {
        id: "ab3",
        name: "Organs II",
        sub: "Gallbladder · Abdominal Aorta · Spleen",
        img: IMGS.abd_organs2,
        accent: "#FCA5A5",
      },
      {
        id: "ab4",
        name: "Kidney & Ureter",
        sub: "Posterior surface landmarks",
        img: IMGS.abd_kidney,
        accent: "#F87171",
      },
    ],
  },
  {
    id: "thorax",
    label: "Thorax",
    color: "#3B82F6",
    topics: [
      {
        id: "th1",
        name: "Lungs & Aorta",
        sub: "Anterior border · Arch of Aorta",
        img: IMGS.thorax_lungs,
        accent: "#3B82F6",
      },
      {
        id: "th2",
        name: "Pleura",
        sub: "Pleural Reflection",
        img: IMGS.thorax_pleura,
        accent: "#60A5FA",
      },
      {
        id: "th3",
        name: "Other Structures",
        sub: "Esophagus · Thoracic Duct",
        img: IMGS.thorax_other,
        accent: "#93C5FD",
      },
    ],
  },
  {
    id: "head",
    label: "Head & Neck",
    color: "#8B5CF6",
    topics: [
      {
        id: "hn1",
        name: "Arteries",
        sub: "Common & External Carotid · Facial Artery",
        img: IMGS.hn_arteries,
        accent: "#8B5CF6",
      },
      {
        id: "hn2",
        name: "Veins & Nerves",
        sub: "External Jugular · Facial Nerve · Parotid Duct",
        img: IMGS.hn_veins,
        accent: "#A78BFA",
      },
    ],
  },
];

// ── Topic Card ─────────────────────────────────────────────────────────────────
function TopicCard({
  topic,
  onPress,
}: {
  topic: Topic;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={s.card}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={[s.cardAccent, { backgroundColor: topic.accent }]} />
      <Image source={topic.img} style={s.cardThumb} resizeMode="cover" />
      <View style={s.cardBody}>
        <Text style={s.cardName}>{topic.name}</Text>
        <Text style={s.cardSub} numberOfLines={2}>
          {topic.sub}
        </Text>
      </View>
      <View style={[s.cardArrow, { backgroundColor: topic.accent + "22" }]}>
        <Ionicons name="chevron-forward" size={16} color={topic.accent} />
      </View>
    </TouchableOpacity>
  );
}

// ── Image Viewer Modal ────────────────────────────────────────────────────────
function ImageViewer({
  topic,
  onClose,
}: {
  topic: Topic | null;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  if (!topic) return null;

  return (
    <Modal visible animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <StatusBar backgroundColor="#000" barStyle="light-content" />
      <View style={s.viewer}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={s.viewerScroll}
          maximumZoomScale={4}
          minimumZoomScale={1}
          centerContent
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          bouncesZoom
        >
          <Image
            source={topic.img}
            style={{ width: SW, height: SH * 0.85 }}
            resizeMode="contain"
          />
        </ScrollView>

        {/* Header overlay */}
        <View style={[s.viewerBar, { paddingTop: insets.top + 4 }]}>
          <TouchableOpacity style={s.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={s.viewerTitle}>
            <Text style={s.viewerName}>{topic.name}</Text>
            <Text style={s.viewerSub}>{topic.sub}</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* Zoom hint */}
        <View
          style={[s.zoomHint, { bottom: insets.bottom + 16 }]}
          pointerEvents="none"
        >
          <Ionicons name="search-outline" size={12} color="#6B7280" />
          <Text style={s.zoomHintTxt}>Pinch to zoom</Text>
        </View>
      </View>
    </Modal>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function SurfaceMarkingScreen() {
  const insets = useSafeAreaInsets();
  const [activeRegion, setActiveRegion] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const region = REGIONS[activeRegion]!;

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />

      {/* ── Header ── */}
      <View style={[s.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Surface Marking</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* ── Region Tabs ── */}
      <View style={s.tabWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.tabScroll}
        >
          {REGIONS.map((r, idx) => {
            const active = idx === activeRegion;
            return (
              <TouchableOpacity
                key={r.id}
                style={[
                  s.tabPill,
                  active && { backgroundColor: r.color + "22", borderColor: r.color },
                ]}
                onPress={() => setActiveRegion(idx)}
                activeOpacity={0.75}
              >
                <Text
                  style={[s.tabLabel, active && { color: r.color, fontWeight: "700" }]}
                >
                  {r.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Topic List ── */}
      <FlatList
        data={region.topics}
        keyExtractor={(t) => t.id}
        contentContainerStyle={[s.list, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={s.listHeader}>
            <View style={[s.regionDot, { backgroundColor: region.color }]} />
            <Text style={s.listHeaderTxt}>
              {region.label} — {region.topics.length}{" "}
              {region.topics.length === 1 ? "topic" : "topics"}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TopicCard topic={item} onPress={() => setSelectedTopic(item)} />
        )}
      />

      {/* ── Viewer ── */}
      {selectedTopic && (
        <ImageViewer topic={selectedTopic} onClose={() => setSelectedTopic(null)} />
      )}
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0a0a0a" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: "center", justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  headerTitle: {
    flex: 1, textAlign: "center",
    fontSize: 18, fontWeight: "700",
    color: "#FFFFFF", letterSpacing: 0.3,
  },

  tabWrap: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  tabScroll: { paddingHorizontal: 14, paddingVertical: 10, gap: 8 },
  tabPill: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.09)",
  },
  tabLabel: { fontSize: 13, fontWeight: "500", color: "#6B7280" },

  list: { paddingHorizontal: 14, paddingTop: 6 },
  listHeader: {
    flexDirection: "row", alignItems: "center", gap: 8,
    paddingVertical: 12,
  },
  regionDot: { width: 8, height: 8, borderRadius: 4 },
  listHeaderTxt: {
    fontSize: 11, fontWeight: "600",
    color: "#4B5563", letterSpacing: 1,
    textTransform: "uppercase",
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#151515",
    borderRadius: 14,
    marginBottom: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
  },
  cardAccent: { width: 3, alignSelf: "stretch" },
  cardThumb: {
    width: 86, height: 74,
    backgroundColor: "#1a1a1a",
  },
  cardBody: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  cardName: {
    fontSize: 16, fontWeight: "700",
    color: "#FFFFFF", marginBottom: 4,
  },
  cardSub: { fontSize: 12, color: "#6B7280", lineHeight: 17 },
  cardArrow: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: "center", justifyContent: "center",
    marginRight: 12,
  },

  viewer: { flex: 1, backgroundColor: "#000" },
  viewerScroll: { flexGrow: 1, justifyContent: "center", alignItems: "center" },
  viewerBar: {
    position: "absolute", top: 0, left: 0, right: 0,
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 12, paddingBottom: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  closeBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center", justifyContent: "center",
  },
  viewerTitle: { flex: 1, alignItems: "center" },
  viewerName: { fontSize: 16, fontWeight: "700", color: "#FFFFFF" },
  viewerSub: { fontSize: 11, color: "#9CA3AF", marginTop: 2 },
  zoomHint: {
    position: "absolute", left: 0, right: 0,
    flexDirection: "row", justifyContent: "center",
    alignItems: "center", gap: 5,
  },
  zoomHintTxt: { fontSize: 11, color: "#6B7280" },
});
