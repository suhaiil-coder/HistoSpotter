import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { QuizAnswer, QuizResult } from "@/context/AppContext";
import { ALL_QUESTIONS, imageMap } from "@/constants/questions";
import { playCorrect, playTick, playTimeout, playWarning, playWrong } from "@/lib/sound";

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function QuizScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { settings, saveQuizResult } = useApp();

  const [questions] = useState(() =>
    shuffleArray(ALL_QUESTIONS).slice(0, settings.questionsPerQuiz)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  const timerAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef<ReturnType<typeof Animated.timing> | null>(null);
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTickRef = useRef(0);

  const question = questions[currentIndex];
  const progress = (currentIndex + 1) / questions.length;
  const topInset = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  const advanceQuestion = useCallback(
    (answerIndex: number | null) => {
      const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);
      const correctIndex = question.correctIndex;
      const wasCorrect = answerIndex === correctIndex;

      const newAnswer: QuizAnswer = {
        questionId: question.id,
        selectedIndex: answerIndex ?? -1,
        correctIndex,
        correct: wasCorrect,
        category: question.category,
        timeSpent,
      };

      const updatedAnswers = [...answers, newAnswer];

      if (currentIndex + 1 >= questions.length) {
        const result: QuizResult = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          score: updatedAnswers.filter((a) => a.correct).length,
          total: questions.length,
          answers: updatedAnswers,
        };
        saveQuizResult(result);
        router.replace({
          pathname: "/results",
          params: { resultsJson: JSON.stringify(result) },
        });
      } else {
        setAnswers(updatedAnswers);
        setCurrentIndex((i) => i + 1);
        setSelectedIndex(null);
        setAnswered(false);
        setQuestionStartTime(Date.now());
      }
    },
    [question, answers, currentIndex, questions.length, questionStartTime, saveQuizResult]
  );

  useEffect(() => {
    timerAnim.setValue(1);
    if (timerRef.current) timerRef.current.stop();
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    if (tickRef.current) clearInterval(tickRef.current);

    if (settings.timerEnabled) {
      const totalMs = settings.timePerQuestion * 1000;
      const anim = Animated.timing(timerAnim, {
        toValue: 0,
        duration: totalMs,
        useNativeDriver: false,
      });
      timerRef.current = anim;

      lastTickRef.current = totalMs;
      tickRef.current = setInterval(() => {
        lastTickRef.current -= 1000;
        if (lastTickRef.current <= 0) {
          clearInterval(tickRef.current!);
          tickRef.current = null;
          return;
        }
        if (lastTickRef.current <= 5000) {
          playWarning();
        } else {
          playTick();
        }
      }, 1000);

      anim.start(({ finished }) => {
        if (finished) {
          if (tickRef.current) clearInterval(tickRef.current);
          playTimeout();
          if (settings.hapticsEnabled) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          }
          setAnswered(true);
          setSelectedIndex(null);
          autoAdvanceRef.current = setTimeout(() => advanceQuestion(null), 1200);
        }
      });
    }

    return () => {
      if (timerRef.current) timerRef.current.stop();
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [currentIndex]);

  const handleAnswer = (index: number) => {
    if (answered) return;

    if (timerRef.current) timerRef.current.stop();
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    if (tickRef.current) clearInterval(tickRef.current);

    setSelectedIndex(index);
    setAnswered(true);

    const correct = index === question.correctIndex;
    if (correct) {
      playCorrect();
    } else {
      playWrong();
    }
    if (settings.hapticsEnabled) {
      if (correct) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }

    autoAdvanceRef.current = setTimeout(() => advanceQuestion(index), 900);
  };

  const getOptionStyle = (index: number) => {
    if (!answered) return {};
    if (index === question.correctIndex) {
      return { backgroundColor: colors.success + "33", borderColor: colors.success };
    }
    if (index === selectedIndex && index !== question.correctIndex) {
      return { backgroundColor: colors.destructive + "33", borderColor: colors.destructive };
    }
    return { opacity: 0.5 };
  };

  const getOptionTextColor = (index: number) => {
    if (!answered) return colors.foreground;
    if (index === question.correctIndex) return colors.success;
    if (index === selectedIndex && index !== question.correctIndex) return colors.destructive;
    return colors.mutedForeground;
  };

  const timerBarWidth = timerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });


  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topInset + 12 }]}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <Feather name="x" size={22} color={colors.mutedForeground} />
        </Pressable>
        <Text style={[styles.questionCounter, { color: colors.mutedForeground }]}>
          {currentIndex + 1} / {questions.length}
        </Text>
        <View style={{ width: 34 }} />
      </View>

      {/* Progress Bar */}
      <View style={[styles.progressBg, { backgroundColor: colors.secondary }]}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              width: `${progress * 100}%` as any,
              backgroundColor: colors.primary,
            },
          ]}
        />
      </View>

      {/* Timer Bar — gradient line that depletes right-to-left */}
      {settings.timerEnabled && (
        <View style={[styles.timerTrack, { backgroundColor: colors.border }]}>
          <Animated.View
            style={[
              styles.timerBarContainer,
              { width: timerBarWidth },
            ]}
          >
            <LinearGradient
              colors={["#22C55E", "#FBBF24", "#F97316", "#EF4444"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </View>
      )}

      {/* Image */}
      <View style={styles.imageContainer}>
        <Image
          source={imageMap[question.imageKey]}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
        <LinearGradient
          colors={["transparent", colors.background]}
          style={styles.imageOverlay}
        />
        <View style={[styles.categoryBadge, { backgroundColor: colors.primary + "DD" }]}>
          <Text style={styles.categoryText}>{question.category}</Text>
        </View>
      </View>

      {/* Question & Options */}
      <View style={styles.bottomSection}>
        <Text style={[styles.question, { color: colors.foreground }]}>
          {question.question}
        </Text>

        <View style={styles.options}>
          {question.options.map((opt, i) => (
            <Pressable
              key={i}
              onPress={() => handleAnswer(i)}
              disabled={answered}
              style={({ pressed }) => [
                styles.option,
                { backgroundColor: colors.card, borderColor: colors.border },
                getOptionStyle(i),
                { opacity: pressed && !answered ? 0.8 : undefined },
              ]}
            >
              <View style={[styles.optionLetter, { backgroundColor: colors.secondary }]}>
                <Text style={[styles.optionLetterText, { color: colors.mutedForeground }]}>
                  {String.fromCharCode(65 + i)}
                </Text>
              </View>
              <Text style={[styles.optionText, { color: getOptionTextColor(i) }]}>
                {opt}
              </Text>
              {answered && i === question.correctIndex && (
                <Feather name="check-circle" size={18} color={colors.success} />
              )}
              {answered && i === selectedIndex && i !== question.correctIndex && (
                <Feather name="x-circle" size={18} color={colors.destructive} />
              )}
            </Pressable>
          ))}
        </View>
      </View>

      {/* Bottom safe area */}
      <View style={{ height: Platform.OS === "web" ? 34 : insets.bottom + 10 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  backBtn: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  questionCounter: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
  progressBg: {
    height: 3,
    marginHorizontal: 20,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: 3,
    borderRadius: 2,
  },
  timerTrack: {
    height: 4,
    marginHorizontal: 20,
    marginTop: 6,
    borderRadius: 2,
    overflow: "hidden",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  timerBarContainer: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
    position: "relative",
  },
  imageContainer: {
    marginTop: 12,
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: "hidden",
    height: 200,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  categoryBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  categoryText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  bottomSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  question: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 17,
    lineHeight: 24,
    marginBottom: 16,
  },
  options: {
    gap: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 14,
    gap: 12,
  },
  optionLetter: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  optionLetterText: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
  },
  optionText: {
    flex: 1,
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    lineHeight: 19,
  },
});
