import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

export function LoadingScreen() {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.85)).current;
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    const bounce = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: -10,
            duration: 280,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 280,
            useNativeDriver: true,
          }),
          Animated.delay(560),
        ])
      );

    const a1 = bounce(dot1, 0);
    const a2 = bounce(dot2, 160);
    const a3 = bounce(dot3, 320);
    a1.start();
    a2.start();
    a3.start();
    return () => {
      a1.stop();
      a2.stop();
      a3.stop();
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.glow} />

      <Animated.View
        style={[
          styles.logoWrap,
          { opacity: logoOpacity, transform: [{ scale: logoScale }] },
        ]}
      >
        <View style={styles.badge}>
          <Text style={styles.badgeText}>M</Text>
        </View>

        <Text style={styles.wordmark}>
          <Text style={styles.wordmarkLight}>Med</Text>
          <Text style={styles.wordmarkPurple}>Spotter</Text>
        </Text>

        <Text style={styles.tagline}>Master Histology</Text>
      </Animated.View>

      <View style={styles.dotsRow}>
        {[dot1, dot2, dot3].map((dot, i) => (
          <Animated.View
            key={i}
            style={[styles.dot, { transform: [{ translateY: dot }] }]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D1A",
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "#7C3AED",
    opacity: 0.08,
    top: "30%",
    alignSelf: "center",
  },
  logoWrap: {
    alignItems: "center",
    gap: 12,
  },
  badge: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: "#7C3AED",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 36,
    fontFamily: "Inter_700Bold",
    letterSpacing: -1,
  },
  wordmark: {
    fontSize: 36,
    letterSpacing: -0.5,
  },
  wordmarkLight: {
    color: "#F8F8FF",
    fontFamily: "Inter_700Bold",
  },
  wordmarkPurple: {
    color: "#7C3AED",
    fontFamily: "Inter_700Bold",
  },
  tagline: {
    color: "#9090B0",
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  dotsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 60,
    alignItems: "flex-end",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#7C3AED",
  },
});
