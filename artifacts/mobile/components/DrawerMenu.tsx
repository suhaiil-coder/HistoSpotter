import { Feather } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

const DRAWER_WIDTH = 288;

// ─── Menu data ────────────────────────────────────────────────────────────────

interface SubItem {
  id: string;
  label: string;
  icon: keyof typeof Feather.glyphMap;
  isDivider?: boolean;
  isChart?: boolean;
}

interface Section {
  id: string;
  label: string;
  icon: keyof typeof Feather.glyphMap;
  expandable?: boolean;
  accent?: boolean;
  children?: SubItem[];
}

const SECTIONS: Section[] = [
  {
    id: "gross-anatomy",
    label: "Gross Anatomy",
    icon: "layers",
    expandable: true,
    children: [
      { id: "head-neck", label: "Head & Neck", icon: "user" },
      { id: "upper-limb", label: "Upper Limb", icon: "arrow-up" },
      { id: "lower-limb", label: "Lower Limb", icon: "arrow-down" },
      { id: "thorax", label: "Thorax", icon: "heart" },
      { id: "abdomen", label: "Abdomen", icon: "circle" },
      { id: "neuroanatomy-sub", label: "Neuroanatomy", icon: "cpu" },
      { id: "divider-1", label: "", icon: "minus", isDivider: true },
      { id: "charts-quiz", label: "Quiz", icon: "book-open" },
    ],
  },
  { id: "neuroanatomy", label: "Neuroanatomy", icon: "cpu" },
  { id: "embryology", label: "Embryology", icon: "git-branch" },
  { id: "osteology", label: "Osteology", icon: "box" },
  { id: "radiology", label: "Radiology", icon: "aperture" },
  {
    id: "ospe",
    label: "OSPE Exam Mode",
    icon: "clipboard",
    accent: true,
  },
];

// ─── Sub-item row ─────────────────────────────────────────────────────────────

function SubItemRow({
  item,
  onPress,
  active,
}: {
  item: SubItem;
  onPress: (id: string) => void;
  active: boolean;
}) {
  const colors = useColors();

  if (item.isDivider) {
    return (
      <View style={styles.subDivider}>
        <View style={[styles.subDividerLine, { backgroundColor: colors.border }]} />
        <Text style={[styles.subDividerLabel, { color: colors.mutedForeground }]}>
          Charts
        </Text>
        <View style={[styles.subDividerLine, { backgroundColor: colors.border }]} />
      </View>
    );
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.subRow,
        active && { backgroundColor: colors.primary + "22" },
        pressed && { backgroundColor: colors.primary + "15" },
      ]}
      onPress={() => onPress(item.id)}
    >
      <View style={[styles.subDot, { backgroundColor: active ? colors.primary : colors.border }]} />
      <Text
        style={[
          styles.subLabel,
          { color: active ? colors.primary : colors.foreground },
          item.isChart && { color: colors.primary },
        ]}
      >
        {item.label}
      </Text>
      {item.isChart && (
        <View style={[styles.chartBadge, { backgroundColor: colors.primary + "22" }]}>
          <Text style={[styles.chartBadgeTxt, { color: colors.primary }]}>Charts</Text>
        </View>
      )}
    </Pressable>
  );
}

// ─── Section row ──────────────────────────────────────────────────────────────

function SectionRow({
  section,
  activeId,
  onSelect,
}: {
  section: Section;
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const colors = useColors();
  const [expanded, setExpanded] = useState(false);
  const expandAnim = useRef(new Animated.Value(0)).current;

  const childCount = (section.children ?? []).filter((c) => !c.isDivider).length;
  const totalHeight = (section.children ?? []).reduce((h, c) => h + (c.isDivider ? 28 : 44), 0);

  const toggle = useCallback(() => {
    const toValue = expanded ? 0 : 1;
    setExpanded(!expanded);
    Animated.spring(expandAnim, {
      toValue,
      useNativeDriver: false, // height animation never uses native driver
      damping: 18,
      stiffness: 180,
    }).start();
  }, [expanded, expandAnim]);

  const isActive = activeId === section.id;
  const isAccent = section.accent;

  const rowColor = isAccent
    ? colors.primary
    : isActive
      ? colors.primary
      : colors.foreground;
  const rowBg = isAccent
    ? colors.primary + "22"
    : isActive
      ? colors.primary + "18"
      : "transparent";

  return (
    <View>
      <Pressable
        style={({ pressed }) => [
          styles.sectionRow,
          { backgroundColor: rowBg },
          pressed && !section.expandable && { backgroundColor: colors.primary + "15" },
        ]}
        onPress={() => {
          if (section.expandable) {
            toggle();
          } else {
            onSelect(section.id);
          }
        }}
      >
        <View style={[styles.sectionIcon, { backgroundColor: rowColor + "22" }]}>
          <Feather name={section.icon} size={16} color={rowColor} />
        </View>
        <Text
          style={[
            styles.sectionLabel,
            { color: rowColor },
            isAccent && { fontFamily: "Inter_700Bold" },
          ]}
        >
          {section.label}
        </Text>
        {section.expandable && (
          <Animated.View
            style={{
              transform: [
                {
                  rotate: expandAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "90deg"],
                  }),
                },
              ],
            }}
          >
            <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
          </Animated.View>
        )}
        {section.expandable && (
          <Text style={[styles.countBadge, { color: colors.mutedForeground }]}>
            {childCount}
          </Text>
        )}
      </Pressable>

      {/* Expandable children */}
      {section.expandable && section.children && (
        <Animated.View
          style={{
            height: expandAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, totalHeight],
            }),
            overflow: "hidden",
          }}
        >
          <View style={[styles.childrenWrap, { borderLeftColor: colors.border }]}>
            {section.children.map((child) => (
              <SubItemRow
                key={child.id}
                item={child}
                active={activeId === child.id}
                onPress={onSelect}
              />
            ))}
          </View>
        </Animated.View>
      )}
    </View>
  );
}

// ─── Drawer ───────────────────────────────────────────────────────────────────

interface DrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (id: string) => void;
}

export default function DrawerMenu({ isOpen, onClose, onSelect }: DrawerMenuProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topInset = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const [visible, setVisible] = useState(false);
  const [activeId, setActiveId] = useState("gross-anatomy");

  useEffect(() => {
    const native = Platform.OS !== "web";
    if (isOpen) {
      setVisible(true);
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: native,
          damping: 20,
          stiffness: 200,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: native,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: -DRAWER_WIDTH,
          useNativeDriver: native,
          damping: 22,
          stiffness: 220,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 180,
          useNativeDriver: native,
        }),
      ]).start(() => setVisible(false));
    }
  }, [isOpen, slideAnim, backdropAnim]);

  const handleSelect = useCallback(
    (id: string) => {
      setActiveId(id);
      onSelect?.(id);
      onClose();
    },
    [onClose, onSelect]
  );

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            styles.backdrop,
            { opacity: backdropAnim },
          ]}
        />
      </TouchableWithoutFeedback>

      {/* Drawer panel */}
      <Animated.View
        style={[
          styles.drawer,
          {
            backgroundColor: colors.card,
            borderRightColor: colors.border,
            paddingTop: topInset,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        {/* Header */}
        <View style={[styles.drawerHeader, { borderBottomColor: colors.border }]}>
          <View>
            <Text style={[styles.drawerTitle, { color: colors.foreground }]}>
              Histo<Text style={{ color: colors.primary }}>Spotter</Text>
            </Text>
            <Text style={[styles.drawerSub, { color: colors.mutedForeground }]}>
              Study Navigator
            </Text>
          </View>
          <Pressable
            onPress={onClose}
            style={[styles.closeBtn, { backgroundColor: colors.secondary }]}
          >
            <Feather name="x" size={18} color={colors.foreground} />
          </Pressable>
        </View>

        {/* Sections */}
        <ScrollView
          style={styles.menuScroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        >
          <Text style={[styles.menuGroupLabel, { color: colors.mutedForeground }]}>
            ANATOMY
          </Text>
          {SECTIONS.slice(0, 5).map((s) => (
            <SectionRow
              key={s.id}
              section={s}
              activeId={activeId}
              onSelect={handleSelect}
            />
          ))}

          <View style={[styles.groupDivider, { backgroundColor: colors.border }]} />
          <Text style={[styles.menuGroupLabel, { color: colors.mutedForeground }]}>
            EXAM
          </Text>
          {SECTIONS.slice(5).map((s) => (
            <SectionRow
              key={s.id}
              section={s}
              activeId={activeId}
              onSelect={handleSelect}
            />
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  drawer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    borderRightWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  drawerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  drawerTitle: { fontSize: 20, fontFamily: "Inter_700Bold" },
  drawerSub: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 1 },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },

  menuScroll: { flex: 1 },
  menuGroupLabel: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1.4,
    marginTop: 20,
    marginBottom: 6,
    marginHorizontal: 20,
  },
  groupDivider: { height: 1, marginHorizontal: 20, marginTop: 16 },

  // Section rows
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 11,
    marginHorizontal: 8,
    marginVertical: 1,
    borderRadius: 12,
    gap: 12,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionLabel: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  countBadge: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    marginRight: 4,
  },

  // Children
  childrenWrap: {
    marginLeft: 32,
    marginRight: 8,
    borderLeftWidth: 1.5,
    paddingLeft: 12,
    marginBottom: 4,
  },
  subRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginVertical: 1,
    gap: 10,
  },
  subDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  subLabel: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  chartBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  chartBadgeTxt: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
  },

  // Sub-divider (Charts separator)
  subDivider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  subDividerLine: { flex: 1, height: 1 },
  subDividerLabel: { fontSize: 10, fontFamily: "Inter_600SemiBold", letterSpacing: 1 },
});
