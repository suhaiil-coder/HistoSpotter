import { BlurView } from "expo-blur";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Tabs } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { SymbolView } from "expo-symbols";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: "brain.head.profile", selected: "brain.head.profile" }} />
        <Label>Quiz</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="spotter">
        <Icon sf={{ default: "eye", selected: "eye.fill" }} />
        <Label>Spotter</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="bookmarks">
        <Icon sf={{ default: "bookmark", selected: "bookmark.fill" }} />
        <Label>Saved</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="stats">
        <Icon sf={{ default: "chart.bar", selected: "chart.bar.fill" }} />
        <Label>Stats</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="chat">
        <Icon sf={{ default: "message", selected: "message.fill" }} />
        <Label>Chat</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <Icon sf={{ default: "gear", selected: "gear" }} />
        <Label>Settings</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const colors = useColors();
  const { unreadChatCount } = useApp();
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: isIOS ? "transparent" : colors.card,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          elevation: 0,
          height: isWeb ? 84 : undefined,
        },
        tabBarLabelStyle: {
          fontFamily: "Inter_500Medium",
          fontSize: 11,
          marginBottom: isWeb ? 4 : 0,
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={80}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
          ) : isWeb ? (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.card }]} />
          ) : null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Quiz",
          tabBarIcon: ({ color, size }) =>
            isIOS ? (
              <SymbolView name="brain.head.profile" tintColor={color} size={size} />
            ) : (
              <Feather name="zap" size={size} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="spotter"
        options={{
          title: "Spotter",
          tabBarIcon: ({ color, size }) =>
            isIOS ? (
              <SymbolView name="eye" tintColor={color} size={size} />
            ) : (
              <Feather name="eye" size={size} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          title: "Saved",
          tabBarIcon: ({ color, size }) =>
            isIOS ? (
              <SymbolView name="bookmark" tintColor={color} size={size} />
            ) : (
              <Feather name="bookmark" size={size} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color, size }) => {
            const hasBadge = unreadChatCount > 0;
            const badgeSize = Math.min(size * 0.6, 16);
            return (
              <View style={{ position: "relative" }}>
                {isIOS ? (
                  <SymbolView name="message" tintColor={color} size={size} />
                ) : (
                  <Feather name="message-circle" size={size} color={color} />
                )}
                {hasBadge && (
                  <View
                    style={{
                      position: "absolute",
                      top: -3,
                      right: -6,
                      minWidth: badgeSize,
                      height: badgeSize,
                      borderRadius: badgeSize / 2,
                      backgroundColor: colors.destructive || "#EF4444",
                      alignItems: "center",
                      justifyContent: "center",
                      paddingHorizontal: 3,
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: badgeSize * 0.6,
                        fontFamily: "Inter_700Bold",
                        lineHeight: badgeSize * 0.85,
                      }}
                    >
                      {unreadChatCount > 9 ? "9+" : unreadChatCount}
                    </Text>
                  </View>
                )}
              </View>
            );
          },
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: "Stats",
          tabBarIcon: ({ color, size }) =>
            isIOS ? (
              <SymbolView name="chart.bar" tintColor={color} size={size} />
            ) : (
              <Feather name="bar-chart-2" size={size} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) =>
            isIOS ? (
              <SymbolView name="gear" tintColor={color} size={size} />
            ) : (
              <Feather name="settings" size={size} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  if (isLiquidGlassAvailable()) {
    return <NativeTabLayout />;
  }
  return <ClassicTabLayout />;
}
