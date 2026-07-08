import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

type Mode = "login" | "register";

function InputField({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  autoCapitalize,
}: {
  icon: React.ComponentProps<typeof Feather>["name"];
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "words" | "sentences";
}) {
  const colors = useColors();
  const [focused, setFocused] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const isPassword = secureTextEntry;

  return (
    <View
      style={[
        styles.inputWrap,
        {
          backgroundColor: colors.input,
          borderColor: focused ? colors.primary : colors.border,
        },
      ]}
    >
      <Feather name={icon} size={18} color={focused ? colors.primary : colors.mutedForeground} style={styles.inputIcon} />
      <TextInput
        style={[styles.input, { color: colors.foreground }]}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground + "88"}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={isPassword && !showPw}
        autoCapitalize={autoCapitalize ?? "none"}
        autoCorrect={false}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {isPassword && (
        <Pressable onPress={() => setShowPw((v) => !v)} style={styles.eyeBtn}>
          <Feather name={showPw ? "eye-off" : "eye"} size={16} color={colors.mutedForeground} />
        </Pressable>
      )}
    </View>
  );
}

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { login, register } = useAuth();
  const colors = useColors();

  const [mode, setMode] = useState<Mode>("login");
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const switchMode = (next: Mode) => {
    if (next === mode) return;
    setMode(next);
    setError("");
    setDisplayName("");
    setUsername("");
    setPassword("");
  };

  const handleSubmit = async () => {
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      const result =
        mode === "login"
          ? await login(username.trim(), password)
          : await register(displayName.trim(), username.trim(), password);
      if (!result.success) {
        setError(result.error ?? "Something went wrong.");
      } else {
        router.replace("/(tabs)");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.primary + "22", colors.background, colors.background]}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.glowTop, { top: insets.top + 40, backgroundColor: colors.primary }]} />
      <View style={[styles.glowBottom, { backgroundColor: colors.accent }]} />

      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 32 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <View style={[styles.logoMark, { backgroundColor: colors.primary, shadowColor: colors.primary }]}>
              <Text style={styles.logoLetter}>M</Text>
            </View>
            <Text style={styles.appName}>
              <Text style={[styles.appNameLight, { color: colors.foreground }]}>Med</Text>
              <Text style={{ color: colors.primary, fontFamily: "Inter_700Bold", fontSize: 34 }}>Spotter</Text>
            </Text>
            <Text style={[styles.appTagline, { color: colors.mutedForeground }]}>Master Histology</Text>
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.modeToggle, { backgroundColor: colors.background, borderColor: colors.border }]}>
              {(["login", "register"] as Mode[]).map((m) => (
                <Pressable
                  key={m}
                  style={[
                    styles.modeBtn,
                    mode === m && { backgroundColor: colors.primary },
                  ]}
                  onPress={() => switchMode(m)}
                >
                  <Text
                    style={[
                      styles.modeBtnText,
                      { color: mode === m ? "#FFFFFF" : colors.mutedForeground },
                    ]}
                  >
                    {m === "login" ? "Sign In" : "Sign Up"}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.fields}>
              {mode === "register" && (
                <InputField
                  icon="user"
                  placeholder="Display name"
                  value={displayName}
                  onChangeText={setDisplayName}
                  autoCapitalize="words"
                />
              )}
              <InputField
                icon="at-sign"
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
              />
              <InputField
                icon="lock"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {error ? (
              <View style={[styles.errorBox, { backgroundColor: colors.destructive + "18", borderColor: colors.destructive + "50" }]}>
                <Feather name="alert-circle" size={14} color={colors.destructive} />
                <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text>
              </View>
            ) : null}

            <Pressable
              style={({ pressed }) => [
                styles.submitBtn,
                { backgroundColor: colors.primary, shadowColor: colors.primary, opacity: pressed || loading ? 0.8 : 1 },
              ]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.submitText}>
                {loading ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
              </Text>
              {!loading && <Feather name="arrow-right" size={18} color="#FFFFFF" />}
            </Pressable>

            {mode === "login" ? (
              <Pressable onPress={() => switchMode("register")} style={styles.switchLink}>
                <Text style={[styles.switchLinkText, { color: colors.mutedForeground }]}>
                  New here?{" "}
                  <Text style={[styles.switchLinkAccent, { color: colors.accent }]}>Create an account</Text>
                </Text>
              </Pressable>
            ) : (
              <Pressable onPress={() => switchMode("login")} style={styles.switchLink}>
                <Text style={[styles.switchLinkText, { color: colors.mutedForeground }]}>
                  Already have an account?{" "}
                  <Text style={[styles.switchLinkAccent, { color: colors.accent }]}>Sign in</Text>
                </Text>
              </Pressable>
            )}
          </View>

          <Text style={[styles.footer, { color: colors.mutedForeground + "60" }]}>
            Your progress is saved locally on this device.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  kav: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 24 },

  glowTop: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    opacity: 0.1,
    alignSelf: "center",
  },
  glowBottom: {
    position: "absolute",
    bottom: -80,
    right: -80,
    width: 220,
    height: 220,
    borderRadius: 110,
    opacity: 0.06,
  },

  hero: { alignItems: "center", marginBottom: 36 },
  logoMark: {
    width: 76,
    height: 76,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 14,
  },
  logoLetter: { color: "#FFFFFF", fontSize: 38, fontFamily: "Inter_700Bold", letterSpacing: -1 },
  appName: { fontSize: 34, letterSpacing: -0.5 },
  appNameLight: { fontFamily: "Inter_700Bold" },
  appTagline: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    letterSpacing: 2.5,
    textTransform: "uppercase",
    marginTop: 6,
  },

  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    gap: 16,
  },

  modeToggle: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 9,
  },
  modeBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 14 },

  fields: { gap: 12 },

  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    height: 52,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 15 },
  eyeBtn: { padding: 4 },

  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
  },
  errorText: { fontFamily: "Inter_400Regular", fontSize: 13, flex: 1 },

  submitBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  submitText: { color: "#FFFFFF", fontFamily: "Inter_600SemiBold", fontSize: 16 },

  switchLink: { alignItems: "center", paddingVertical: 4 },
  switchLinkText: { fontFamily: "Inter_400Regular", fontSize: 13 },
  switchLinkAccent: { fontFamily: "Inter_600SemiBold" },

  footer: {
    textAlign: "center",
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    marginTop: 24,
  },
});
