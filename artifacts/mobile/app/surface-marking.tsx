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
const CARD_IMG_H = 170;

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
  structures: string;
  desc: string;
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
        structures: "Axillary · Brachial · Radial · Ulnar",
        desc:
          "The axillary artery begins at the lateral border of the 1st rib and continues as the brachial artery past the lower border of teres major. The brachial pulse is felt medial to the biceps tendon. Radial and ulnar arteries are marked at the wrist over their respective styloid processes.",
        img: IMGS.ul_arteries,
        accent: "#10B981",
      },
      {
        id: "ul2",
        name: "Nerves",
        structures: "Median · Musculocutaneous · Radial · Ulnar",
        desc:
          "The median nerve runs with the brachial artery in the arm, crosses to the medial side at the elbow, and enters the palm through the carpal tunnel. The ulnar nerve passes posterior to the medial epicondyle. The radial nerve spirals in the radial groove of the humerus before piercing the lateral intermuscular septum.",
        img: IMGS.ul_nerves,
        accent: "#34D399",
      },
      {
        id: "ul3",
        name: "Wrist & Hand",
        structures: "Retinacula · Palmar Arches",
        desc:
          "The flexor retinaculum bridges the carpal bones, forming the carpal tunnel roof. The extensor retinaculum lies on the dorsum. The superficial palmar arch is marked by a line from the web of the thumb, convex distally to the level of the outstretched little finger. The deep arch lies 1 cm proximal to it.",
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
        structures: "Femoral · Popliteal · Tibial · Dorsalis Pedis",
        desc:
          "The femoral artery enters the thigh at the mid-inguinal point (midway between ASIS and pubic symphysis) and is palpable here. The popliteal pulse is felt in the popliteal fossa with the knee slightly flexed. The dorsalis pedis artery runs lateral to the extensor hallucis longus tendon on the dorsum of the foot.",
        img: IMGS.ll_arteries,
        accent: "#F59E0B",
      },
      {
        id: "ll2",
        name: "Nerves & Retinacula",
        structures: "Sciatic Nerve · Extensor & Flexor Retinacula",
        desc:
          "The sciatic nerve exits the pelvis below piriformis, midway between the ischial tuberosity and greater trochanter. The superior extensor retinaculum lies across the ankle just above the malleoli; the inferior is Y-shaped below them. The flexor retinaculum bridges the medial malleolus to the calcaneus.",
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
        name: "Planes & Regions",
        structures: "Median Vertical Plane · Subcostal · Transtubercular",
        desc:
          "The transpyloric plane (L1) lies halfway between the suprasternal notch and pubic symphysis. The subcostal plane (L3) passes through the lowest point of the costal margin. The transtubercular plane (L5) passes through the iliac tubercles. These planes divide the abdomen into 9 regions.",
        img: IMGS.abd_planes,
        accent: "#EF4444",
      },
      {
        id: "ab2",
        name: "Organs I",
        structures: "Inguinal Canal · Stomach · Liver",
        desc:
          "The inguinal canal runs from the deep ring (midpoint of inguinal ligament) to the superficial ring (just above and medial to the pubic tubercle). The stomach fundus lies under the left 5th intercostal space, mid-clavicular line. The liver extends from the right 5th intercostal space to 1 cm below the right costal margin.",
        img: IMGS.abd_organs1,
        accent: "#F87171",
      },
      {
        id: "ab3",
        name: "Organs II",
        structures: "Gallbladder · Abdominal Aorta · Spleen",
        desc:
          "The gallbladder fundus lies at the tip of the 9th costal cartilage (intersection of right lateral border of rectus abdominis with right costal margin — Murphy's point). The abdominal aorta runs from T12 to L4, slightly left of the midline. The spleen extends from ribs 9–11 in the left mid-axillary line.",
        img: IMGS.abd_organs2,
        accent: "#FCA5A5",
      },
      {
        id: "ab4",
        name: "Kidney & Ureter",
        structures: "Right & Left Kidney · Ureter",
        desc:
          "The right kidney extends from T12 to L3 posteriorly; the left is a half-vertebra higher. The hilum lies on the transpyloric plane, lateral to L1. The ureter runs from the renal pelvis to the bladder, crossing the pelvic brim at the bifurcation of the common iliac artery, opposite the sacroiliac joint.",
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
        structures: "Anterior border · Oblique & Horizontal Fissures · Arch of Aorta",
        desc:
          "The right lung anterior border runs from behind the sternoclavicular joint to the 6th costal cartilage. The left border deviates left at the 4th cartilage forming the cardiac notch. Oblique fissures follow rib 6 anteriorly. The arch of the aorta rises to the angle of Louis (T4/T5).",
        img: IMGS.thorax_lungs,
        accent: "#3B82F6",
      },
      {
        id: "th2",
        name: "Pleural Reflection",
        structures: "Costal · Mediastinal · Diaphragmatic Pleura",
        desc:
          "The pleural reflection extends below the lung border: at the mid-clavicular line it reaches the 8th rib, mid-axillary line the 10th rib, and paravertebral the 12th rib. The costodiaphragmatic recess is the lowest pleural recess, reached at the 12th rib posteriorly — a key landmark for thoracocentesis.",
        img: IMGS.thorax_pleura,
        accent: "#60A5FA",
      },
      {
        id: "th3",
        name: "Other Structures",
        structures: "Esophagus · Thoracic Duct · Trachea",
        desc:
          "The trachea bifurcates at the angle of Louis (T4/T5). The esophagus descends in the posterior mediastinum and passes through the diaphragm at T10. The thoracic duct arises from the cisterna chyli at L1–L2, ascends in the posterior mediastinum and drains into the left subclavian vein.",
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
        structures: "Common & External Carotid · Facial · Superficial Temporal",
        desc:
          "The common carotid artery is marked from the sternoclavicular joint to the level of the upper border of the thyroid cartilage where it bifurcates (C3/C4). The external carotid continues to the front of the tragus. The facial artery crosses the mandible at the anterior border of the masseter and is palpable there.",
        img: IMGS.hn_arteries,
        accent: "#8B5CF6",
      },
      {
        id: "hn2",
        name: "Veins, Nerve & Duct",
        structures: "External Jugular · Facial Nerve · Parotid Duct",
        desc:
          "The external jugular vein runs from the angle of the mandible to the midpoint of the clavicle. The facial nerve exits the stylomastoid foramen and fans out over the face; the parotid duct (Stensen's duct) runs from the tragus to a point one-third of the way from the ala of the nose to the corner of the mouth.",
        img: IMGS.hn_veins,
        accent: "#A78BFA",
      },
    ],
  },
];

// ── Topic Card ─────────────────────────────────────────────────────────────────
function TopicCard({ topic, onPress }: { topic: Topic; onPress: () => void }) {
  return (
    <TouchableOpacity style={s.card} onPress={onPress} activeOpacity={0.78}>
      {/* Image banner */}
      <View style={s.cardImgWrap}>
        <Image source={topic.img} style={s.cardImg} resizeMode="cover" />
        {/* Gradient overlay at bottom */}
        <View style={s.cardImgOverlay} />
        {/* Accent stripe */}
        <View style={[s.cardStripe, { backgroundColor: topic.accent }]} />
        {/* Tap hint */}
        <View style={s.tapHint}>
          <Ionicons name="expand-outline" size={14} color="rgba(255,255,255,0.8)" />
          <Text style={s.tapHintTxt}>Tap to view full image</Text>
        </View>
      </View>

      {/* Text body */}
      <View style={s.cardBody}>
        <View style={s.cardTitleRow}>
          <View style={[s.accentDot, { backgroundColor: topic.accent }]} />
          <Text style={s.cardName}>{topic.name}</Text>
        </View>
        <Text style={s.cardStructures}>{topic.structures}</Text>
        <Text style={s.cardDesc}>{topic.desc}</Text>
      </View>
    </TouchableOpacity>
  );
}

// ── Image Viewer Modal ────────────────────────────────────────────────────────
function ImageViewer({ topic, onClose }: { topic: Topic | null; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  if (!topic) return null;

  return (
    <Modal visible animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <StatusBar backgroundColor="#000" barStyle="light-content" />
      <View style={s.viewer}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={s.viewerScroll}
          maximumZoomScale={5}
          minimumZoomScale={1}
          centerContent
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          bouncesZoom
        >
          <Image
            source={topic.img}
            style={{ width: SW, height: SH * 0.82 }}
            resizeMode="contain"
          />
        </ScrollView>

        {/* Top bar */}
        <View style={[s.viewerBar, { paddingTop: insets.top + 6 }]}>
          <TouchableOpacity style={s.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={s.viewerTitleWrap}>
            <Text style={s.viewerName}>{topic.name}</Text>
            <Text style={s.viewerStructures} numberOfLines={1}>
              {topic.structures}
            </Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* Bottom description */}
        <View style={[s.viewerDesc, { paddingBottom: insets.bottom + 12 }]}>
          <View style={[s.viewerAccent, { backgroundColor: topic.accent }]} />
          <Text style={s.viewerDescTxt}>{topic.desc}</Text>
        </View>

        {/* Zoom hint */}
        <View style={s.zoomHint} pointerEvents="none">
          <Ionicons name="search-outline" size={11} color="#4B5563" />
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

      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Text style={s.headerTitle}>Surface Marking</Text>
          <Text style={s.headerSub}>Clinical Anatomy</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Region tabs */}
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
                  active && { backgroundColor: r.color + "25", borderColor: r.color },
                ]}
                onPress={() => setActiveRegion(idx)}
                activeOpacity={0.75}
              >
                <Text style={[s.tabLabel, active && { color: r.color, fontWeight: "700" }]}>
                  {r.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Topic list */}
      <FlatList
        key={region.id}
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

      {/* Viewer modal */}
      {selectedTopic && (
        <ImageViewer topic={selectedTopic} onClose={() => setSelectedTopic(null)} />
      )}
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0a0a0a" },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    alignItems: "center", justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  headerCenter: { flex: 1, alignItems: "center" },
  headerTitle: {
    fontSize: 17, fontWeight: "700", color: "#FFFFFF", letterSpacing: 0.2,
  },
  headerSub: { fontSize: 11, color: "#4B5563", marginTop: 1 },

  // Tabs
  tabWrap: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  tabScroll: { paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  tabPill: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.08)",
  },
  tabLabel: { fontSize: 13, fontWeight: "500", color: "#6B7280" },

  // List
  list: { paddingHorizontal: 14, paddingTop: 4 },
  listHeader: {
    flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 14,
  },
  regionDot: { width: 8, height: 8, borderRadius: 4 },
  listHeaderTxt: {
    fontSize: 11, fontWeight: "600", color: "#4B5563",
    letterSpacing: 0.8, textTransform: "uppercase",
  },

  // Card
  card: {
    backgroundColor: "#131313",
    borderRadius: 16,
    marginBottom: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
  },
  cardImgWrap: {
    height: CARD_IMG_H,
    backgroundColor: "#1a1a1a",
    position: "relative",
  },
  cardImg: {
    width: "100%",
    height: "100%",
  },
  cardImgOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.28)",
  },
  cardStripe: {
    position: "absolute",
    top: 0, left: 0,
    width: 4,
    height: "100%",
  },
  tapHint: {
    position: "absolute",
    bottom: 10, right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 20,
  },
  tapHintTxt: { fontSize: 11, color: "rgba(255,255,255,0.8)" },

  cardBody: { padding: 14 },
  cardTitleRow: {
    flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4,
  },
  accentDot: { width: 8, height: 8, borderRadius: 4 },
  cardName: { fontSize: 17, fontWeight: "700", color: "#FFFFFF" },
  cardStructures: {
    fontSize: 12, color: "#6B7280", marginBottom: 8, marginLeft: 16, letterSpacing: 0.3,
  },
  cardDesc: {
    fontSize: 13, color: "#9CA3AF", lineHeight: 20,
  },

  // Viewer modal
  viewer: { flex: 1, backgroundColor: "#000" },
  viewerScroll: { flexGrow: 1, justifyContent: "center", alignItems: "center" },
  viewerBar: {
    position: "absolute", top: 0, left: 0, right: 0,
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 12, paddingBottom: 12,
    backgroundColor: "rgba(0,0,0,0.65)",
  },
  closeBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center", justifyContent: "center",
  },
  viewerTitleWrap: { flex: 1, alignItems: "center" },
  viewerName: { fontSize: 16, fontWeight: "700", color: "#FFFFFF" },
  viewerStructures: { fontSize: 11, color: "#9CA3AF", marginTop: 2 },

  viewerDesc: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.72)",
    paddingHorizontal: 16, paddingTop: 12,
    gap: 10,
  },
  viewerAccent: { width: 3, borderRadius: 2, alignSelf: "stretch" },
  viewerDescTxt: { flex: 1, fontSize: 12, color: "#D1D5DB", lineHeight: 18 },

  zoomHint: {
    position: "absolute",
    bottom: 130,
    left: 0, right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  zoomHintTxt: { fontSize: 11, color: "#374151" },
});
