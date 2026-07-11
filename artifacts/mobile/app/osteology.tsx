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

// ── All images pre-required at module level (Metro static analysis) ──────────
const IMGS: Record<string, ImageSourcePropType> = {
  skull_main:          require("../assets/osteology/skull_main.jpg"),
  skull_lat_inf:       require("../assets/osteology/skull_lateral_inferior.jpg"),
  cranial_cavity:      require("../assets/osteology/cranial_cavity.jpg"),
  mandible:            require("../assets/osteology/mandible.jpg"),
  atlas:               require("../assets/osteology/atlas.jpg"),
  axis:                require("../assets/osteology/axis.jpg"),
  cervical:            require("../assets/osteology/cervical.jpg"),
  thoracic:            require("../assets/osteology/thoracic.jpg"),
  lumbar:              require("../assets/osteology/lumbar.jpg"),
  sacrum:              require("../assets/osteology/sacrum.jpg"),
  sternum:             require("../assets/osteology/sternum.jpg"),
  ribs:                require("../assets/osteology/ribs.jpg"),
  clavicle:            require("../assets/osteology/clavicle.jpg"),
  scapula:             require("../assets/osteology/scapula.jpg"),
  humerus:             require("../assets/osteology/humerus.jpg"),
  radius_ulna:         require("../assets/osteology/radius_ulna.jpg"),
  hand:                require("../assets/osteology/hand.jpg"),
  pelvis:              require("../assets/osteology/pelvis.jpg"),
  hip_bone:            require("../assets/osteology/hip_bone.jpg"),
  patella:             require("../assets/osteology/patella.jpg"),
  femur:               require("../assets/osteology/femur.jpg"),
  tibia_fibula:        require("../assets/osteology/tibia_fibula.jpg"),
  foot:                require("../assets/osteology/foot.jpg"),
};

// ── Data ─────────────────────────────────────────────────────────────────────
type Bone = {
  id: string;
  name: string;
  sub: string;
  img: ImageSourcePropType;
};

type TabData = {
  id: string;
  label: string;
  bones: Bone[];
};

const TABS: TabData[] = [
  {
    id: "skull",
    label: "Skull",
    bones: [
      { id: "skull1", name: "Skull",           sub: "Anterior · Posterior · Lateral",        img: IMGS.skull_main      },
      { id: "skull2", name: "Skull",           sub: "Lateral · Inferior views",               img: IMGS.skull_lat_inf   },
      { id: "skull3", name: "Cranial Cavity",  sub: "Floor — Superior view",                  img: IMGS.cranial_cavity  },
      { id: "skull4", name: "Mandible",        sub: "Anterior · Lateral · Posterior",         img: IMGS.mandible        },
    ],
  },
  {
    id: "vertebrae",
    label: "Vertebrae",
    bones: [
      { id: "vert1", name: "Atlas (C1)",              sub: "Superior · Inferior views",              img: IMGS.atlas    },
      { id: "vert2", name: "Axis (C2)",               sub: "Anterior · Posterior views",             img: IMGS.axis     },
      { id: "vert3", name: "Cervical Vertebrae",      sub: "Anterior · Oblique · Superior",          img: IMGS.cervical },
      { id: "vert4", name: "Thoracic Vertebrae",      sub: "Superior · Lateral · Posterior",         img: IMGS.thoracic },
      { id: "vert5", name: "Lumbar Vertebrae",        sub: "Superior · Lateral · Posterior",         img: IMGS.lumbar   },
      { id: "vert6", name: "Sacrum",                  sub: "Anterior · Posterior views",             img: IMGS.sacrum   },
    ],
  },
  {
    id: "thorax",
    label: "Thorax",
    bones: [
      { id: "thor1", name: "Sternum", sub: "Anterior · Lateral views",               img: IMGS.sternum },
      { id: "thor2", name: "Ribs",    sub: "Rib 1 Superior · Rib 5 Medial/Lateral",  img: IMGS.ribs    },
    ],
  },
  {
    id: "upper",
    label: "Upper Limb",
    bones: [
      { id: "up1", name: "Clavicle",      sub: "Superior · Inferior views",                    img: IMGS.clavicle    },
      { id: "up2", name: "Scapula",       sub: "Anterior · Posterior views",                   img: IMGS.scapula     },
      { id: "up3", name: "Humerus",       sub: "Anterior · Posterior · Proximal · Distal",     img: IMGS.humerus     },
      { id: "up4", name: "Radius & Ulna", sub: "Anterior · Posterior · Proximal · Distal",     img: IMGS.radius_ulna },
      { id: "up5", name: "Hand",          sub: "Dorsal view — left hand",                      img: IMGS.hand        },
    ],
  },
  {
    id: "lower",
    label: "Lower Limb",
    bones: [
      { id: "lo1", name: "Pelvis",         sub: "Anterior · Posterior · Hip bone medial",     img: IMGS.pelvis      },
      { id: "lo2", name: "Hip Bone",       sub: "Lateral view",                               img: IMGS.hip_bone    },
      { id: "lo3", name: "Patella",        sub: "Anterior · Posterior views",                 img: IMGS.patella     },
      { id: "lo4", name: "Femur",          sub: "Anterior · Lateral · Posterior · Distal",   img: IMGS.femur       },
      { id: "lo5", name: "Tibia & Fibula", sub: "Anterior · Lateral · Posterior · Distal",   img: IMGS.tibia_fibula},
      { id: "lo6", name: "Foot",           sub: "Lateral · Medial views",                    img: IMGS.foot        },
    ],
  },
];

// ── Bone list card ────────────────────────────────────────────────────────────
function BoneCard({ bone, onPress }: { bone: Bone; onPress: () => void }) {
  return (
    <TouchableOpacity style={s.card} onPress={onPress} activeOpacity={0.75}>
      <Image source={bone.img} style={s.cardThumb} resizeMode="cover" />
      <View style={s.cardBody}>
        <Text style={s.cardName}>{bone.name}</Text>
        <Text style={s.cardSub} numberOfLines={1}>{bone.sub}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#4B5563" />
    </TouchableOpacity>
  );
}

// ── Full-screen image viewer ──────────────────────────────────────────────────
function ImageViewer({
  bone,
  onClose,
}: {
  bone: Bone | null;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();

  if (!bone) return null;

  return (
    <Modal
      visible
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <StatusBar backgroundColor="#000" barStyle="light-content" />
      <View style={s.viewer}>
        {/* Zoomable image */}
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
            source={bone.img}
            style={{ width: SW, height: SH * 0.85 }}
            resizeMode="contain"
          />
        </ScrollView>

        {/* Top overlay bar */}
        <View style={[s.viewerBar, { paddingTop: insets.top + 4 }]}>
          <TouchableOpacity style={s.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={s.viewerTitle}>
            <Text style={s.viewerName}>{bone.name}</Text>
            <Text style={s.viewerSub}>{bone.sub}</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* Zoom hint */}
        <View style={[s.zoomHint, { bottom: insets.bottom + 16 }]} pointerEvents="none">
          <Ionicons name="search-outline" size={12} color="#6B7280" />
          <Text style={s.zoomHintTxt}>Pinch to zoom</Text>
        </View>
      </View>
    </Modal>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function OsteologyScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab]       = useState(0);
  const [selectedBone, setSelectedBone] = useState<Bone | null>(null);

  const currentTab = TABS[activeTab]!;

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />

      {/* ── Header ── */}
      <View style={[s.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Osteology</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* ── Tabs ── */}
      <View style={s.tabWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.tabScroll}
        >
          {TABS.map((tab, idx) => {
            const active = idx === activeTab;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[s.tabPill, active && s.tabPillActive]}
                onPress={() => setActiveTab(idx)}
                activeOpacity={0.75}
              >
                <Text style={[s.tabLabel, active && s.tabLabelActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Bone list ── */}
      <FlatList
        data={currentTab.bones}
        keyExtractor={b => b.id}
        contentContainerStyle={[s.list, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <BoneCard bone={item} onPress={() => setSelectedBone(item)} />
        )}
        ListHeaderComponent={
          <Text style={s.listHeader}>
            {currentTab.bones.length} {currentTab.bones.length === 1 ? "bone" : "bones"}
          </Text>
        }
      />

      {/* ── Image viewer modal ── */}
      {selectedBone && (
        <ImageViewer bone={selectedBone} onClose={() => setSelectedBone(null)} />
      )}
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0a0a0a" },

  // Header
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

  // Tabs
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
  tabPillActive: {
    backgroundColor: "#1D4ED8",
    borderColor: "#3B82F6",
  },
  tabLabel:       { fontSize: 13, fontWeight: "500", color: "#6B7280" },
  tabLabelActive: { color: "#fff", fontWeight: "700" },

  // List
  list: { paddingHorizontal: 14, paddingTop: 6 },
  listHeader: {
    fontSize: 11, fontWeight: "600",
    color: "#4B5563", letterSpacing: 1,
    textTransform: "uppercase",
    paddingVertical: 10,
  },

  // Card
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
  cardThumb: {
    width: 80, height: 70,
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
  cardSub: {
    fontSize: 12, color: "#6B7280",
  },

  // Viewer
  viewer: { flex: 1, backgroundColor: "#000" },
  viewerScroll: { flexGrow: 1, justifyContent: "center", alignItems: "center" },
  viewerBar: {
    position: "absolute", top: 0, left: 0, right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  closeBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center", justifyContent: "center",
  },
  viewerTitle: { flex: 1, alignItems: "center" },
  viewerName: { fontSize: 16, fontWeight: "700", color: "#FFFFFF" },
  viewerSub:  { fontSize: 11, color: "#9CA3AF", marginTop: 2 },
  zoomHint: {
    position: "absolute", left: 0, right: 0,
    flexDirection: "row", justifyContent: "center",
    alignItems: "center", gap: 5,
  },
  zoomHintTxt: { fontSize: 11, color: "#6B7280" },
});
