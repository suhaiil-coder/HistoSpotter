import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

// ─── Menu data ────────────────────────────────────────────────────────────────

interface MenuItem {
  id: string;
  label: string;
  sub?: string;
  icon: keyof typeof Feather.glyphMap;
  accent?: string;
  available?: boolean;
}

const MENU_ITEMS: MenuItem[] = [
  { id: "head-neck",    label: "Head & Neck",      sub: "30 spotters",  icon: "user",       accent: "#0EA5E9", available: true  },
  { id: "upper-limb",  label: "Upper Limb",        sub: "31 spotters",  icon: "arrow-up",   accent: "#10B981", available: true  },
  { id: "thorax",      label: "Thorax",            sub: "29 spotters",  icon: "heart",      accent: "#F59E0B", available: true  },
  { id: "abdomen",     label: "Abdomen & Pelvis",  sub: "60 spotters",  icon: "circle",     accent: "#EF4444", available: true  },
  { id: "neuroanatomy",label: "Neuroanatomy",      sub: "26 spotters",  icon: "cpu",        accent: "#8B5CF6", available: true  },
  { id: "embryology",  label: "Embryology",        sub: "Coming soon",  icon: "git-branch", accent: "#EC4899", available: false },
  { id: "osteology",   label: "Osteology",         sub: "Coming soon",  icon: "box",        accent: "#6366F1", available: false },
];

// ─── Menu item row ────────────────────────────────────────────────────────────

function MenuRow({
  item,
  onPress,
}: {
  item: MenuItem;
  onPress: (id: string) => void;
}) {
  const colors = useColors();
  const accent = item.accent ?? colors.primary;
  const dim = !item.available;

  return (
    <Pressable
      onPress={dim ? undefined : () => onPress(item.id)}
      style={({ pressed }) => [
        styles.menuRow,
        { backgroundColor: colors.card, borderColor: colors.border },
        !dim && pressed && { backgroundColor: accent + "22", borderColor: accent + "55" },
        dim && { opacity: 0.4 },
      ]}
    >
      <View style={[styles.menuIcon, { backgroundColor: accent + "22" }]}>
        <Feather name={item.icon} size={18} color={accent} />
      </View>

      <View style={styles.menuText}>
        <Text style={[styles.menuLabel, { color: colors.foreground }]}>
          {item.label}
        </Text>
        <Text style={[styles.menuSub, { color: colors.mutedForeground }]}>
          {item.sub}
        </Text>
      </View>

      {item.available ? (
        <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
      ) : (
        <View style={[styles.soonBadge, { backgroundColor: colors.secondary }]}>
          <Text style={[styles.soonTxt, { color: colors.mutedForeground }]}>Soon</Text>
        </View>
      )}
    </Pressable>
  );
}

// ─── Bottom sheet ─────────────────────────────────────────────────────────────

interface DrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (id: string) => void;
}

export default function DrawerMenu({ isOpen, onClose, onSelect }: DrawerMenuProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  function handleSelect(id: string) {
    onSelect?.(id);
    onClose();
  }

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Backdrop tap-to-close */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      {/* Sheet */}
      <View
        style={[
          styles.sheet,
          {
            backgroundColor: colors.background,
            borderColor: colors.border,
            paddingBottom: Platform.OS === "web" ? 24 : insets.bottom + 12,
          },
        ]}
      >
        {/* Handle bar */}
        <View style={[styles.handle, { backgroundColor: colors.border }]} />

        {/* Header */}
        <View style={[styles.sheetHeader, { borderBottomColor: colors.border }]}>
          <View style={styles.sheetTitleRow}>
            <MaterialCommunityIcons name="microscope" size={20} color={colors.primary} />
            <Text style={[styles.sheetTitle, { color: colors.foreground }]}>
              Study Navigator
            </Text>
          </View>
          <Pressable
            onPress={onClose}
            style={[styles.closeBtn, { backgroundColor: colors.card }]}
            hitSlop={8}
          >
            <Feather name="x" size={16} color={colors.foreground} />
          </Pressable>
        </View>

        {/* Items */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          bounces={false}
        >
          <Text style={[styles.groupLabel, { color: colors.mutedForeground }]}>
            ANATOMY SECTIONS
          </Text>

          {MENU_ITEMS.map((item) => (
            <MenuRow key={item.id} item={item} onPress={handleSelect} />
          ))}

          <Text style={[styles.groupLabel, { color: colors.mutedForeground, marginTop: 20 }]}>
            EXAM
          </Text>
          <Pressable
            onPress={() => handleSelect("ospe")}
            style={({ pressed }) => [
              styles.examRow,
              { backgroundColor: colors.primary + "22", borderColor: colors.primary + "44" },
              pressed && { opacity: 0.7 },
            ]}
          >
            <Feather name="clipboard" size={18} color={colors.primary} />
            <Text style={[styles.examLabel, { color: colors.primary }]}>
              OSPE Exam Mode
            </Text>
            <Feather name="arrow-right" size={16} color={colors.primary} />
          </Pressable>
        </ScrollView>
      </View>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 20,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 4,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  sheetTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sheetTitle: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 8,
  },
  groupLabel: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1.4,
    marginBottom: 6,
    marginLeft: 4,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  menuIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  menuText: { flex: 1 },
  menuLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  menuSub: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 1 },
  soonBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  soonTxt: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  examRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  examLabel: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_700Bold",
  },
});
