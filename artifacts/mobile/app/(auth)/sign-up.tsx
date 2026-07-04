import { Feather } from "@expo/vector-icons";
import { useAuth, useSignUp } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
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

import { GoogleAuthButton } from "@/components/GoogleAuthButton";
import { useColors } from "@/hooks/useColors";

export default function SignUpScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const busy = fetchStatus === "fetching";

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/chat");
  };

  const handleSubmit = async () => {
    const { error } = await signUp.password({ emailAddress: email, password });
    if (error) return;
    await signUp.verifications.sendEmailCode();
  };

  const handleVerify = async () => {
    await signUp.verifications.verifyEmailCode({ code });
    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: () => router.replace("/(tabs)/chat"),
      });
    }
  };

  const topInset = Platform.OS === "web" ? Math.max(insets.top, 24) : insets.top;

  const awaitingCode =
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields?.includes("email_address");

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: topInset + 16 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          style={[styles.closeBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={goBack}
        >
          <Feather name="x" size={20} color={colors.foreground} />
        </Pressable>

        {awaitingCode && !isSignedIn ? (
          <>
            <View style={styles.hero}>
              <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                <Feather name="mail" size={26} color="#fff" />
              </View>
              <Text style={[styles.title, { color: colors.foreground }]}>Verify your email</Text>
              <Text style={[styles.sub, { color: colors.mutedForeground }]}>
                We sent a 6-digit code to {email}
              </Text>
            </View>

            <Text style={[styles.label, { color: colors.mutedForeground }]}>Verification code</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
              placeholder="123456"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="number-pad"
              value={code}
              onChangeText={setCode}
            />
            {errors?.fields?.code && (
              <Text style={styles.error}>{errors.fields.code.message}</Text>
            )}

            <Pressable
              style={[styles.primaryBtn, { backgroundColor: colors.primary, opacity: !code || busy ? 0.5 : 1 }]}
              onPress={handleVerify}
              disabled={!code || busy}
            >
              <Text style={styles.primaryBtnTxt}>{busy ? "Verifying…" : "Verify & continue"}</Text>
            </Pressable>

            <Pressable style={styles.resend} onPress={() => signUp.verifications.sendEmailCode()}>
              <Text style={[styles.footerLink, { color: colors.primary }]}>Resend code</Text>
            </Pressable>
          </>
        ) : (
          <>
            <View style={styles.hero}>
              <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                <Feather name="user-plus" size={26} color="#fff" />
              </View>
              <Text style={[styles.title, { color: colors.foreground }]}>Create account</Text>
              <Text style={[styles.sub, { color: colors.mutedForeground }]}>
                Get a real identity for the HistoSpotter chat
              </Text>
            </View>

            <GoogleAuthButton />

            <View style={styles.dividerRow}>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <Text style={[styles.dividerTxt, { color: colors.mutedForeground }]}>or</Text>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
            </View>

            <Text style={[styles.label, { color: colors.mutedForeground }]}>Email</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
              placeholder="you@example.com"
              placeholderTextColor={colors.mutedForeground}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            {errors?.fields?.emailAddress && (
              <Text style={styles.error}>{errors.fields.emailAddress.message}</Text>
            )}

            <Text style={[styles.label, { color: colors.mutedForeground }]}>Password</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
              placeholder="At least 8 characters"
              placeholderTextColor={colors.mutedForeground}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            {errors?.fields?.password && (
              <Text style={styles.error}>{errors.fields.password.message}</Text>
            )}

            <Pressable
              style={[
                styles.primaryBtn,
                { backgroundColor: colors.primary, opacity: !email || !password || busy ? 0.5 : 1 },
              ]}
              onPress={handleSubmit}
              disabled={!email || !password || busy}
            >
              <Text style={styles.primaryBtnTxt}>{busy ? "Creating…" : "Create account"}</Text>
            </Pressable>

            <View style={styles.footerRow}>
              <Text style={[styles.footerTxt, { color: colors.mutedForeground }]}>
                Already have an account?{" "}
              </Text>
              <Link href="/(auth)/sign-in" replace>
                <Text style={[styles.footerLink, { color: colors.primary }]}>Sign in</Text>
              </Link>
            </View>
          </>
        )}

        {/* Required for Clerk bot sign-up protection */}
        <View nativeID="clerk-captcha" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 24, paddingBottom: 40 },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
  },
  hero: { alignItems: "center", gap: 8, marginTop: 8, marginBottom: 28 },
  badge: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  title: { fontSize: 26, fontFamily: "Inter_700Bold" },
  sub: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", maxWidth: 280 },
  dividerRow: { flexDirection: "row", alignItems: "center", gap: 12, marginVertical: 20 },
  divider: { flex: 1, height: 1 },
  dividerTxt: { fontSize: 12, fontFamily: "Inter_500Medium" },
  label: { fontSize: 13, fontFamily: "Inter_500Medium", marginBottom: 6, marginTop: 12 },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  error: { color: "#EF4444", fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 6 },
  primaryBtn: {
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 24,
  },
  primaryBtnTxt: { color: "#fff", fontSize: 16, fontFamily: "Inter_600SemiBold" },
  resend: { alignItems: "center", marginTop: 20 },
  footerRow: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  footerTxt: { fontSize: 14, fontFamily: "Inter_400Regular" },
  footerLink: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
});
