import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
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

import { useColors } from "@/hooks/useColors";
import {
  BONES,
  REGIONS,
  type Bone,
  type Region,
} from "@/constants/osteologyData";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function bonesForRegion(regionId: string) {
  const region = REGIONS.find((r) => r.id === regionId)!;
  return region.boneIds
    .map((id) => BONES.find((b) => b.id === id)!)
    .filter(Boolean);
}

// ─── Region card (2-col grid) ─────────────────────────────────────────────────

function RegionCard({
  region,
  onPress,
}: {
  region: Region;
  onPress: () => void;
}) {
  const colors = useColors();
  const boneCount = region.boneIds.length;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.regionCard, { opacity: pressed ? 0.82 : 1 }]}
    >
      <LinearGradient
        colors={[region.color, region.accent + "CC"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.regionGradient}
      >
        <View style={[styles.regionIconWrap, { backgroundColor: "rgba(255,255,255,0.22)" }]}>
          <Feather name={region.icon as any} size={22} color="#fff" />
        </View>
        <Text style={styles.regionName}>{region.name}</Text>
        <Text style={styles.regionSub}>{region.subtitle}</Text>
        <View style={styles.regionCount}>
          <Feather name="layers" size={11} color="rgba(255,255,255,0.8)" />
          <Text style={styles.regionCountTxt}>{boneCount} bone{boneCount !== 1 ? "s" : ""}</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

// ─── Bone list row ────────────────────────────────────────────────────────────

function BoneRow({
  bone,
  onPress,
}: {
  bone: Bone;
  onPress: () => void;
}) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.boneRow,
        { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.8 : 1 },
      ]}
    >
      <View style={[styles.boneRowIcon, { backgroundColor: bone.color + "22" }]}>
        <Feather name="layers" size={18} color={bone.color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.boneRowName, { color: colors.foreground }]}>{bone.name}</Text>
        <Text style={[styles.boneRowMeta, { color: colors.mutedForeground }]}>
          {bone.features.length} landmarks · {bone.articulations.length} articulations
          {bone.side === "paired" ? " · Paired" : " · Single"}
        </Text>
      </View>
      <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
    </Pressable>
  );
}

// ─── Bone detail — specimen card ──────────────────────────────────────────────

function SpecimenCard({
  bone,
  activeView,
}: {
  bone: Bone;
  activeView: number;
}) {
  return (
    <View style={styles.specimenCard}>
      <LinearGradient
        colors={["#0f0f1a", bone.color + "99", bone.accent + "44"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {/* Grid lines for anatomy-app feel */}
      <View style={styles.gridOverlay} pointerEvents="none">
        {[0.25, 0.5, 0.75].map((f) => (
          <View key={f} style={[styles.gridLine, { left: `${f * 100}%` as any }]} />
        ))}
        {[0.33, 0.66].map((f) => (
          <View key={f} style={[styles.gridLineH, { top: `${f * 100}%` as any }]} />
        ))}
      </View>

      <View style={styles.specimenContent}>
        <View style={[styles.specimenBadge, { backgroundColor: "rgba(255,255,255,0.12)" }]}>
          <Text style={styles.specimenBadgeTxt}>SPECIMEN</Text>
        </View>
        <Text style={styles.specimenBoneName}>{bone.name}</Text>
        <Text style={styles.specimenView}>{bone.views[activeView]?.label} view</Text>
        <Text style={styles.specimenViewSub}>{bone.views[activeView]?.sublabel}</Text>
      </View>
    </View>
  );
}

// ─── Feature item ─────────────────────────────────────────────────────────────

function FeatureItem({
  feature,
  index,
  showLabel,
  color,
}: {
  feature: Bone["features"][0];
  index: number;
  showLabel: boolean;
  color: string;
}) {
  const colors = useColors();
  const [expanded, setExpanded] = useState(false);

  return (
    <Pressable
      onPress={showLabel ? () => setExpanded((e) => !e) : undefined}
      style={[styles.featureItem, { borderColor: colors.border }]}
    >
      <View style={styles.featureRow}>
        {/* Number badge */}
        <View style={[styles.featureNum, { backgroundColor: color + "22" }]}>
          <Text style={[styles.featureNumTxt, { color }]}>{index + 1}</Text>
        </View>

        {/* Name or blank */}
        {showLabel ? (
          <Text style={[styles.featureName, { color: colors.foreground }]} numberOfLines={expanded ? undefined : 2}>
            {feature.name}
          </Text>
        ) : (
          <View style={styles.blankName}>
            <View style={[styles.blankLine, { backgroundColor: colors.border, width: "65%" }]} />
            <View style={[styles.blankLine, { backgroundColor: colors.border, width: "40%", marginTop: 5 }]} />
          </View>
        )}

        {showLabel && (
          <Feather
            name={expanded ? "chevron-up" : "chevron-down"}
            size={14}
            color={colors.mutedForeground}
          />
        )}
      </View>

      {/* Description when expanded */}
      {showLabel && expanded && (
        <View style={[styles.featureDesc, { borderTopColor: colors.border }]}>
          <Text style={[styles.featureDescTxt, { color: colors.foreground }]}>
            {feature.desc}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

// ─── Bone detail screen ────────────────────────────────────────────────────────

function BoneDetail({
  bone,
  onBack,
}: {
  bone: Bone;
  onBack: () => void;
}) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topInset = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  const [showLabels, setShowLabels] = useState(false);
  const [activeView, setActiveView] = useState(0);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Sticky header */}
      <View
        style={[
          styles.detailHeader,
          { paddingTop: topInset + 8, borderBottomColor: colors.border, backgroundColor: colors.card },
        ]}
      >
        <Pressable
          onPress={onBack}
          style={[styles.backBtn, { backgroundColor: colors.secondary }]}
          hitSlop={8}
        >
          <Feather name="arrow-left" size={18} color={colors.foreground} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.detailHeaderTitle, { color: colors.foreground }]} numberOfLines={1}>
            {bone.name}
          </Text>
          <Text style={[styles.detailHeaderSub, { color: colors.mutedForeground }]}>
            {bone.features.length} landmarks · {bone.side === "paired" ? "Paired" : "Single"}
          </Text>
        </View>
        {/* Labels toggle */}
        <Pressable
          onPress={() => setShowLabels((v) => !v)}
          style={[
            styles.labelsToggle,
            {
              backgroundColor: showLabels ? bone.color : colors.secondary,
              borderColor: showLabels ? bone.color : colors.border,
            },
          ]}
        >
          <Feather name={showLabels ? "eye" : "eye-off"} size={14} color={showLabels ? "#fff" : colors.mutedForeground} />
          <Text style={[styles.labelsToggleTxt, { color: showLabels ? "#fff" : colors.mutedForeground }]}>
            {showLabels ? "Labels On" : "Labels Off"}
          </Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 80 : insets.bottom + 80 }}
      >
        {/* Specimen card */}
        <SpecimenCard bone={bone} activeView={activeView} />

        {/* View tabs */}
        {bone.views.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.viewTabsRow}
          >
            {bone.views.map((v, i) => (
              <Pressable
                key={i}
                onPress={() => setActiveView(i)}
                style={[
                  styles.viewTab,
                  {
                    backgroundColor: activeView === i ? bone.color : colors.secondary,
                    borderColor: activeView === i ? bone.color : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.viewTabTxt,
                    { color: activeView === i ? "#fff" : colors.mutedForeground },
                  ]}
                >
                  {v.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        )}

        {/* Self-test banner */}
        {!showLabels && (
          <View style={[styles.selfTestBanner, { backgroundColor: bone.color + "18", borderColor: bone.color + "44" }]}>
            <Feather name="zap" size={14} color={bone.color} />
            <Text style={[styles.selfTestTxt, { color: bone.color }]}>
              Self-test mode — try to name each landmark, then tap "Labels Off" to reveal
            </Text>
          </View>
        )}

        {/* Landmarks section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionDot, { backgroundColor: bone.color }]} />
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Anatomical Landmarks
            </Text>
            <Text style={[styles.sectionCount, { color: colors.mutedForeground }]}>
              {bone.features.length}
            </Text>
          </View>

          {bone.features.map((feature, i) => (
            <FeatureItem
              key={feature.id}
              feature={feature}
              index={i}
              showLabel={showLabels}
              color={bone.color}
            />
          ))}
        </View>

        {/* Articulations */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionDot, { backgroundColor: bone.accent }]} />
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Articulations</Text>
          </View>
          <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {bone.articulations.map((art, i) => (
              <View key={i} style={styles.artRow}>
                <View style={[styles.artDot, { backgroundColor: bone.accent }]} />
                <Text style={[styles.artTxt, { color: colors.foreground }]}>{art}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Muscle note */}
        {bone.muscleNote && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionDot, { backgroundColor: "#F59E0B" }]} />
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Muscle Attachments</Text>
            </View>
            <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.infoTxt, { color: colors.foreground }]}>{bone.muscleNote}</Text>
            </View>
          </View>
        )}

        {/* Clinical note */}
        {bone.clinical && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionDot, { backgroundColor: "#EF4444" }]} />
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Clinical Importance</Text>
            </View>
            <View style={[styles.clinicalCard, { backgroundColor: "#EF444411", borderColor: "#EF444433" }]}>
              <Feather name="alert-circle" size={14} color="#EF4444" />
              <Text style={[styles.clinicalTxt, { color: colors.foreground }]}>{bone.clinical}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// ─── Bone list screen ─────────────────────────────────────────────────────────

function BoneList({
  region,
  onSelectBone,
  onBack,
}: {
  region: Region;
  onSelectBone: (bone: Bone) => void;
  onBack: () => void;
}) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topInset = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const bones = bonesForRegion(region.id);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Header */}
      <LinearGradient
        colors={[region.color + "EE", colors.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.listHeader, { paddingTop: topInset + 8 }]}
      >
        <Pressable
          onPress={onBack}
          style={[styles.backBtn, { backgroundColor: "rgba(0,0,0,0.25)" }]}
          hitSlop={8}
        >
          <Feather name="arrow-left" size={18} color="#fff" />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.listHeaderTitle}>{region.name}</Text>
          <Text style={styles.listHeaderSub}>{region.subtitle}</Text>
        </View>
        <View style={[styles.listBadge, { backgroundColor: "rgba(255,255,255,0.22)" }]}>
          <Text style={styles.listBadgeTxt}>{bones.length}</Text>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listScroll,
          { paddingBottom: Platform.OS === "web" ? 80 : insets.bottom + 80 },
        ]}
      >
        <Text style={[styles.listHint, { color: colors.mutedForeground }]}>
          Select a bone to explore landmarks and labels
        </Text>
        {bones.map((bone) => (
          <BoneRow key={bone.id} bone={bone} onPress={() => onSelectBone(bone)} />
        ))}
      </ScrollView>
    </View>
  );
}

// ─── Main screen (region selector) ───────────────────────────────────────────

export default function OsteologyScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topInset = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [selectedBone, setSelectedBone] = useState<Bone | null>(null);

  // Navigate to bone detail
  if (selectedBone) {
    return (
      <BoneDetail
        bone={selectedBone}
        onBack={() => setSelectedBone(null)}
      />
    );
  }

  // Navigate to bone list
  if (selectedRegion) {
    return (
      <BoneList
        region={selectedRegion}
        onSelectBone={setSelectedBone}
        onBack={() => setSelectedRegion(null)}
      />
    );
  }

  // Region selector
  const totalBones = BONES.length;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.homeHeader,
          { paddingTop: topInset + 8, borderBottomColor: colors.border, backgroundColor: colors.card },
        ]}
      >
        <Pressable
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.secondary }]}
          hitSlop={8}
        >
          <Feather name="arrow-left" size={18} color={colors.foreground} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.homeHeaderTitle, { color: colors.foreground }]}>🦴 Osteology</Text>
          <Text style={[styles.homeHeaderSub, { color: colors.mutedForeground }]}>
            Bone Atlas · {totalBones} bones · Labels & landmarks
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.homeScroll,
          { paddingBottom: Platform.OS === "web" ? 80 : insets.bottom + 80 },
        ]}
      >
        {/* Info strip */}
        <View style={[styles.infoStrip, { backgroundColor: "#6366F111", borderColor: "#6366F133" }]}>
          <Feather name="info" size={13} color="#818CF8" />
          <Text style={[styles.infoStripTxt, { color: "#818CF8" }]}>
            Select any bone → tap landmarks → toggle Labels to reveal/hide for self-testing
          </Text>
        </View>

        {/* Region grid */}
        <Text style={[styles.gridLabel, { color: colors.mutedForeground }]}>SELECT A REGION</Text>
        <View style={styles.regionGrid}>
          {REGIONS.map((region) => (
            <RegionCard
              key={region.id}
              region={region}
              onPress={() => setSelectedRegion(region)}
            />
          ))}
        </View>

        {/* Quick stats */}
        <View style={[styles.statsRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {[
            { label: "Regions", value: REGIONS.length },
            { label: "Bones", value: totalBones },
            { label: "Landmarks", value: BONES.reduce((s, b) => s + b.features.length, 0) },
          ].map((stat, i) => (
            <React.Fragment key={stat.label}>
              {i > 0 && <View style={[styles.statDivider, { backgroundColor: colors.border }]} />}
              <View style={styles.statItem}>
                <Text style={[styles.statNum, { color: "#6366F1" }]}>{stat.value}</Text>
                <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>{stat.label}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1 },

  // ── Home ──
  homeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  homeHeaderTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  homeHeaderSub: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 1 },

  homeScroll: { paddingHorizontal: 16, paddingTop: 20, gap: 20 },

  infoStrip: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  infoStripTxt: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },

  gridLabel: { fontSize: 10, fontFamily: "Inter_700Bold", letterSpacing: 1.2, marginBottom: -8 },

  regionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  regionCard: {
    width: "47.5%",
    borderRadius: 18,
    overflow: "hidden",
  },
  regionGradient: {
    padding: 18,
    gap: 6,
    minHeight: 160,
    justifyContent: "flex-end",
  },
  regionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  regionName: { fontFamily: "Inter_700Bold", fontSize: 15, color: "#fff", letterSpacing: -0.2 },
  regionSub: { fontFamily: "Inter_400Regular", fontSize: 11, color: "rgba(255,255,255,0.75)" },
  regionCount: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 6,
  },
  regionCountTxt: { fontFamily: "Inter_600SemiBold", fontSize: 11, color: "rgba(255,255,255,0.8)" },

  statsRow: {
    flexDirection: "row",
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    justifyContent: "space-around",
  },
  statItem: { alignItems: "center", gap: 2 },
  statNum: { fontFamily: "Inter_700Bold", fontSize: 22 },
  statLbl: { fontFamily: "Inter_400Regular", fontSize: 11 },
  statDivider: { width: 1, height: "100%" },

  // ── Bone list ──
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  listHeaderTitle: { fontFamily: "Inter_700Bold", fontSize: 20, color: "#fff", letterSpacing: -0.3 },
  listHeaderSub: { fontFamily: "Inter_400Regular", fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 2 },
  listBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  listBadgeTxt: { fontFamily: "Inter_700Bold", fontSize: 16, color: "#fff" },
  listScroll: { paddingHorizontal: 16, paddingTop: 16, gap: 10 },
  listHint: { fontSize: 12, fontFamily: "Inter_400Regular", textAlign: "center", marginBottom: 6 },

  boneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  boneRowIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  boneRowName: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
  boneRowMeta: { fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 2 },

  // ── Bone detail ──
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  detailHeaderTitle: { fontFamily: "Inter_700Bold", fontSize: 16 },
  detailHeaderSub: { fontFamily: "Inter_400Regular", fontSize: 11, marginTop: 1 },

  labelsToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  labelsToggleTxt: { fontFamily: "Inter_600SemiBold", fontSize: 12 },

  specimenCard: {
    height: 220,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  gridOverlay: { ...StyleSheet.absoluteFillObject },
  gridLine: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  gridLineH: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  specimenContent: {
    padding: 20,
    gap: 4,
  },
  specimenBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 4,
  },
  specimenBadgeTxt: { fontFamily: "Inter_700Bold", fontSize: 9, letterSpacing: 1.5, color: "rgba(255,255,255,0.7)" },
  specimenBoneName: { fontFamily: "Inter_700Bold", fontSize: 26, color: "#fff", letterSpacing: -0.5 },
  specimenView: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: "rgba(255,255,255,0.8)" },
  specimenViewSub: { fontFamily: "Inter_400Regular", fontSize: 11, color: "rgba(255,255,255,0.5)" },

  viewTabsRow: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  viewTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  viewTabTxt: { fontFamily: "Inter_600SemiBold", fontSize: 13 },

  selfTestBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 4,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  selfTestTxt: { flex: 1, fontSize: 12, fontFamily: "Inter_500Medium", lineHeight: 18 },

  section: { paddingHorizontal: 16, paddingTop: 20, gap: 10 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionDot: { width: 8, height: 8, borderRadius: 4 },
  sectionTitle: { flex: 1, fontFamily: "Inter_700Bold", fontSize: 15 },
  sectionCount: { fontFamily: "Inter_600SemiBold", fontSize: 13 },

  featureItem: {
    borderRadius: 12,
    borderBottomWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureNum: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  featureNumTxt: { fontFamily: "Inter_700Bold", fontSize: 13 },
  featureName: { flex: 1, fontFamily: "Inter_600SemiBold", fontSize: 14, lineHeight: 20 },

  blankName: { flex: 1, gap: 4 },
  blankLine: { height: 10, borderRadius: 5 },

  featureDesc: {
    marginTop: 10,
    paddingTop: 10,
    paddingLeft: 44,
    borderTopWidth: 1,
  },
  featureDescTxt: { fontFamily: "Inter_400Regular", fontSize: 13, lineHeight: 21 },

  infoCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  artRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  artDot: { width: 6, height: 6, borderRadius: 3, marginTop: 5, flexShrink: 0 },
  artTxt: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 13, lineHeight: 20 },
  infoTxt: { fontFamily: "Inter_400Regular", fontSize: 13, lineHeight: 21 },

  clinicalCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  clinicalTxt: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 13, lineHeight: 21 },
});
