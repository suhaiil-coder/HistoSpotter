import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

export default function NameEntryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { setName } = useAuth();
  const colors = useColors();

  const [name, setNameValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleStart = async () => {
    if (loading) return;
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Please enter your name to continue.");
      shake();
      return;
    }
    if (trimmed.length < 2) {
      setError("Name must be at least 2 characters.");
      shake();
      return;
    }
    setError("");
    setLoading(true);
    await setName(trimmed);
    router.replace("/(tabs)");
    setLoading(false);
  };

  const ready = name.trim().length >= 2;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.glowTop, { backgroundColor: colors.primary }]} />
      <View style={[styles.glowBottom, { backgroundColor: colors.accent }]} />

      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View
          style={[
            styles.content,
            { paddingTop: insets.top + 48, paddingBottom: insets.bottom + 32 },
          ]}
        >
          <View style={styles.hero}>
            <View style={[styles.badge, { backgroundColor: colors.primary, shadowColor: colors.primary }]}>
              <Text style={styles.badgeLetter}>M</Text>
            </View>
            <Text style={styles.appName}>
              <Text style={{ color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 36 }}>Med</Text>
              <Text style={{ color: colors.primary, fontFamily: "Inter_700Bold", fontSize: 36 }}>Spotter</Text>
            </Text>
            <Text style={[styles.tagline, { color: colors.mutedForeground }]}>Master Histology</Text>
          </View>

          <View style={styles.formArea}>
            <Text style={[styles.question, { color: colors.foreground }]}>
              What's your name?
            </Text>
            <Text style={[styles.hint, { color: colors.mutedForeground }]}>
              This is how you'll appear on the leaderboard.
            </Text>

            <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
              <View
                style={[
                  styles.inputWrap,
                  {
                    backgroundColor: colors.input,
                    borderColor: focused ? colors.primary : error ? colors.destructive : colors.border,
                  },
                ]}
              >
                <Feather
                  name="user"
                  size={20}
                  color={focused ? colors.primary : colors.mutedForeground}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { color: colors.foreground }]}
                  placeholder="Your display name"
                  placeholderTextColor={colors.mutedForeground + "80"}
                  value={name}
                  onChangeText={(v) => { setNameValue(v); setError(""); }}
                  autoCapitalize="words"
                  autoCorrect={false}
                  autoComplete="off"
                  textContentType="none"
                  importantForAutofill="no"
                  autoFocus
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  onSubmitEditing={handleStart}
                  returnKeyType="go"
                  maxLength={32}
                />
                {name.length > 0 && (
                  <Pressable onPress={() => { setNameValue(""); setError(""); }}>
                    <Feather name="x" size={18} color={colors.mutedForeground} />
                  </Pressable>
                )}
              </View>
            </Animated.View>

            {error ? (
              <View style={styles.errorRow}>
                <Feather name="alert-circle" size={13} color={colors.destructive} />
                <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text>
              </View>
            ) : null}

            <Pressable
              onPress={handleStart}
              disabled={loading}
              style={({ pressed }) => [
                styles.btn,
                {
                  backgroundColor: ready ? colors.primary : colors.secondary,
                  shadowColor: colors.primary,
                  opacity: pressed || loading ? 0.8 : 1,
                },
              ]}
            >
              <Text style={[styles.btnText, { color: ready ? "#FFFFFF" : colors.mutedForeground }]}>
                {loading ? "Starting…" : "Let's Go"}
              </Text>
              <Feather
                name="arrow-right"
                size={18}
                color={ready ? "#FFFFFF" : colors.mutedForeground}
              />
            </Pressable>
          </View>

          <Text style={[styles.footer, { color: colors.mutedForeground + "60" }]}>
            No account needed — your progress is saved on this device.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  kav: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 28 },

  glowTop: {
    position: "absolute",
    top: -60,
    alignSelf: "center",
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.09,
  },
  glowBottom: {
    position: "absolute",
    bottom: -100,
    right: -80,
    width: 240,
    height: 240,
    borderRadius: 120,
    opacity: 0.06,
  },

  hero: { alignItems: "center", gap: 10, marginBottom: 52 },
  badge: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 14,
  },
  badgeLetter: { color: "#FFFFFF", fontSize: 40, fontFamily: "Inter_700Bold", letterSpacing: -1 },
  appName: { letterSpacing: -0.5 },
  tagline: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    letterSpacing: 2.5,
    textTransform: "uppercase",
  },

  formArea: { gap: 16 },
  question: { fontFamily: "Inter_700Bold", fontSize: 26, letterSpacing: -0.5 },
  hint: { fontFamily: "Inter_400Regular", fontSize: 14, marginTop: -6 },

  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 2,
    paddingHorizontal: 16,
    height: 58,
  },
  inputIcon: { marginRight: 12 },
  input: {
    flex: 1,
    fontFamily: "Inter_500Medium",
    fontSize: 17,
  },

  errorRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: -6 },
  errorText: { fontFamily: "Inter_400Regular", fontSize: 13 },

  btn: {
    height: 58,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  btnText: { fontFamily: "Inter_700Bold", fontSize: 17 },

  footer: {
    textAlign: "center",
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    marginTop: "auto",
    paddingTop: 24,
  },
});
