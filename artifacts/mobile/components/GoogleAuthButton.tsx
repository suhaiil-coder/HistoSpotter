import { useSSO } from "@clerk/expo";
import * as AuthSession from "expo-auth-session";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useColors } from "@/hooks/useColors";

WebBrowser.maybeCompleteAuthSession();

function useWarmUpBrowser() {
  useEffect(() => {
    if (Platform.OS !== "android") return;
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
}

const GoogleLogo = () => (
  <View style={styles.logo}>
    <Text style={styles.logoTxt}>G</Text>
  </View>
);

export function GoogleAuthButton({ onDone }: { onDone?: () => void }) {
  useWarmUpBrowser();
  const colors = useColors();
  const { startSSOFlow } = useSSO();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const onPress = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl: AuthSession.makeRedirectUri(),
      });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        if (onDone) onDone();
        else router.replace("/(tabs)/chat");
      }
    } catch (err) {
      console.error("Google SSO error", JSON.stringify(err, null, 2));
    } finally {
      setBusy(false);
    }
  }, [busy, startSSOFlow, router, onDone]);

  return (
    <Pressable
      style={[
        styles.btn,
        { backgroundColor: "#fff", opacity: busy ? 0.7 : 1 },
      ]}
      onPress={onPress}
      disabled={busy}
    >
      {busy ? (
        <ActivityIndicator color="#111" />
      ) : (
        <>
          <GoogleLogo />
          <Text style={styles.btnTxt}>Continue with Google</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 12,
    paddingVertical: 14,
  },
  logo: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4285F4",
  },
  logoTxt: { color: "#fff", fontSize: 13, fontFamily: "Inter_700Bold" },
  btnTxt: { color: "#111", fontSize: 15, fontFamily: "Inter_600SemiBold" },
});
