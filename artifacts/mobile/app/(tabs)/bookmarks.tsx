import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import React from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { ALL_QUESTIONS, imageMap } from "@/constants/questions";

export default function BookmarksScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { bookmarks, toggleBookmark, settings } = useApp();
  const topInset = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  const bookmarkedQuestions = ALL_QUESTIONS.filter((q) =>
    bookmarks.includes(q.id)
  );

  const handleUnbookmark = (id: string) => {
    if (settings.hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    toggleBookmark(id);
  };

  if (bookmarkedQuestions.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background, paddingTop: topInset }]}>
        <Feather name="bookmark" size={48} color={colors.mutedForeground} />
        <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No Saved Questions</Text>
        <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
          Bookmark questions during review to study them here.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={bookmarkedQuestions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingTop: topInset + 16,
          paddingHorizontal: 20,
          paddingBottom: Platform.OS === "web" ? 100 : 100,
        }}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.foreground }]}>Saved</Text>
            <Text style={[styles.count, { color: colors.mutedForeground }]}>
              {bookmarkedQuestions.length} question{bookmarkedQuestions.length !== 1 ? "s" : ""}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Image
              source={imageMap[item.imageKey]}
              style={styles.thumbnail}
              contentFit="cover"
            />
            <View style={styles.cardContent}>
              <View style={[styles.categoryBadge, { backgroundColor: colors.secondary }]}>
                <Text style={[styles.categoryText, { color: colors.primary }]}>
                  {item.category}
                </Text>
              </View>
              <Text
                style={[styles.questionText, { color: colors.foreground }]}
                numberOfLines={3}
              >
                {item.question}
              </Text>
              <Text style={[styles.answerText, { color: colors.success }]}>
                {item.options[item.correctIndex]}
              </Text>
            </View>
            <Pressable
              onPress={() => handleUnbookmark(item.id)}
              hitSlop={8}
              style={styles.removeBtn}
            >
              <Feather name="x" size={18} color={colors.mutedForeground} />
            </Pressable>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        showsVerticalScrollIndicator={false}
        scrollEnabled={bookmarkedQuestions.length > 0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 20,
    marginTop: 8,
  },
  emptyText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  header: { marginBottom: 16 },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 28,
  },
  count: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    marginTop: 2,
  },
  card: {
    borderRadius: 14,
    overflow: "hidden",
    flexDirection: "row",
    borderWidth: 1,
    alignItems: "flex-start",
  },
  thumbnail: {
    width: 80,
    height: 90,
  },
  cardContent: {
    flex: 1,
    padding: 12,
    gap: 4,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 4,
  },
  categoryText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    letterSpacing: 0.5,
  },
  questionText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    lineHeight: 18,
  },
  answerText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    marginTop: 2,
  },
  removeBtn: {
    padding: 10,
  },
});
