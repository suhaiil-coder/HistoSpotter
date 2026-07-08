import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
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

const PRIMARY = "#06B6D4";
const ACCENT = "#22D3EE";
const BG = "#060C18";
const CARD = "#0D1A2E";
const BORDER = "#1C3550";
const INPUT_BG = "#112040";
const MUTED = "#5F899F";
const PLACEHOLDER = "#2A4A60";
const FOREGROUND = "#E8F4FF";

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
  const [focused, setFocused] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const isPassword = secureTextEntry;

  return (
    <View style={[styles.inputWrap, focused && styles.inputWrapFocused]}>
      <Feather name={icon} size={18} color={focused ? PRIMARY : MUTED} style={styles.inputIcon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={PLACEHOLDER}
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
          <Feather name={showPw ? "eye-off" : "eye"} size={16} color={MUTED} />
        </Pressable>
      )}
    </View>
  );
}

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { login, register } = useAuth();

  const [mode, setMode] = useState<Mode>("login");
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const slideAnim = useRef(new Animated.Value(0)).current;

  const switchMode = (next: Mode) => {
    if (next === mode) return;
    Animated.timing(slideAnim, {
      toValue: next === "register" ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
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
    <View style={styles.root}>
      <LinearGradient
        colors={["#030A18", BG, BG]}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.glowTop, { top: insets.top + 40 }]} />
      <View style={styles.glowBottom} />

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
            <View style={styles.logoMark}>
              <Text style={styles.logoLetter}>M</Text>
            </View>
            <Text style={styles.appName}>
              <Text style={styles.appNameLight}>Med</Text>
              <Text style={styles.appNameCyan}>Spotter</Text>
            </Text>
            <Text style={styles.appTagline}>Master Histology</Text>
          </View>

          <Animated.View style={styles.card}>
            <View style={styles.modeToggle}>
              {(["login", "register"] as Mode[]).map((m) => (
                <Pressable
                  key={m}
                  style={[styles.modeBtn, mode === m && styles.modeBtnActive]}
                  onPress={() => switchMode(m)}
                >
                  <Text style={[styles.modeBtnText, mode === m && styles.modeBtnTextActive]}>
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
              <View style={styles.errorBox}>
                <Feather name="alert-circle" size={14} color="#EF4444" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <Pressable
              style={({ pressed }) => [
                styles.submitBtn,
                pressed && styles.submitBtnPressed,
                loading && styles.submitBtnLoading,
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
                <Text style={styles.switchLinkText}>
                  New here? <Text style={styles.switchLinkAccent}>Create an account</Text>
                </Text>
              </Pressable>
            ) : (
              <Pressable onPress={() => switchMode("login")} style={styles.switchLink}>
                <Text style={styles.switchLinkText}>
                  Already have an account? <Text style={styles.switchLinkAccent}>Sign in</Text>
                </Text>
              </Pressable>
            )}
          </Animated.View>

          <Text style={styles.footer}>
            Your progress is saved locally on this device.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  kav: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 24 },

  glowTop: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: PRIMARY,
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
    backgroundColor: ACCENT,
    opacity: 0.06,
  },

  hero: { alignItems: "center", marginBottom: 36 },
  logoMark: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 14,
  },
  logoLetter: {
    color: "#FFFFFF",
    fontSize: 38,
    fontFamily: "Inter_700Bold",
    letterSpacing: -1,
  },
  appName: { fontSize: 34, letterSpacing: -0.5 },
  appNameLight: { color: FOREGROUND, fontFamily: "Inter_700Bold" },
  appNameCyan: { color: PRIMARY, fontFamily: "Inter_700Bold" },
  appTagline: {
    color: MUTED,
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    letterSpacing: 2.5,
    textTransform: "uppercase",
    marginTop: 6,
  },

  card: {
    backgroundColor: CARD,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 24,
    gap: 16,
  },

  modeToggle: {
    flexDirection: "row",
    backgroundColor: BG,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: BORDER,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 9,
  },
  modeBtnActive: { backgroundColor: PRIMARY },
  modeBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: MUTED },
  modeBtnTextActive: { color: "#FFFFFF" },

  fields: { gap: 12 },

  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: INPUT_BG,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: BORDER,
    paddingHorizontal: 14,
    height: 52,
  },
  inputWrapFocused: { borderColor: PRIMARY },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    color: FOREGROUND,
    fontFamily: "Inter_400Regular",
    fontSize: 15,
  },
  eyeBtn: { padding: 4 },

  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#1A0808",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#3A1010",
  },
  errorText: { color: "#EF4444", fontFamily: "Inter_400Regular", fontSize: 13, flex: 1 },

  submitBtn: {
    backgroundColor: PRIMARY,
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  submitBtnPressed: { opacity: 0.85 },
  submitBtnLoading: { opacity: 0.6 },
  submitText: { color: "#FFFFFF", fontFamily: "Inter_600SemiBold", fontSize: 16 },

  switchLink: { alignItems: "center", paddingVertical: 4 },
  switchLinkText: { color: MUTED, fontFamily: "Inter_400Regular", fontSize: 13 },
  switchLinkAccent: { color: ACCENT, fontFamily: "Inter_600SemiBold" },

  footer: {
    textAlign: "center",
    color: "#1E3A4A",
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    marginTop: 24,
  },
});
