import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface QuizAnswer {
  questionId: string;
  selectedIndex: number;
  correctIndex: number;
  correct: boolean;
  category: string;
  timeSpent: number;
}

export interface QuizResult {
  id: string;
  date: string;
  score: number;
  total: number;
  answers: QuizAnswer[];
}

export interface AppSettings {
  timerEnabled: boolean;
  timePerQuestion: number;
  questionsPerQuiz: number;
  hapticsEnabled: boolean;
}

export interface AppStats {
  totalQuizzes: number;
  totalQuestions: number;
  totalCorrect: number;
  bestScore: number;
  categoryStats: Record<string, { correct: number; total: number }>;
}

interface AppContextValue {
  bookmarks: string[];
  stats: AppStats;
  settings: AppSettings;
  quizHistory: QuizResult[];
  toggleBookmark: (questionId: string) => void;
  isBookmarked: (questionId: string) => boolean;
  saveQuizResult: (result: QuizResult) => void;
  updateSettings: (patch: Partial<AppSettings>) => void;
  resetStats: () => void;
  unreadChatCount: number;
  setUnreadChatCount: React.Dispatch<React.SetStateAction<number>>;
}

const DEFAULT_SETTINGS: AppSettings = {
  timerEnabled: true,
  timePerQuestion: 30,
  questionsPerQuiz: 10,
  hapticsEnabled: true,
};

const DEFAULT_STATS: AppStats = {
  totalQuizzes: 0,
  totalQuestions: 0,
  totalCorrect: 0,
  bestScore: 0,
  categoryStats: {},
};

const AppContext = createContext<AppContextValue | null>(null);

const KEYS = {
  bookmarks: "@histospotter/bookmarks",
  stats: "@histospotter/stats",
  settings: "@histospotter/settings",
  history: "@histospotter/history",
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [stats, setStats] = useState<AppStats>(DEFAULT_STATS);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [quizHistory, setQuizHistory] = useState<QuizResult[]>([]);
  const [unreadChatCount, setUnreadChatCount] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const [bRaw, sRaw, setRaw, hRaw] = await Promise.all([
          AsyncStorage.getItem(KEYS.bookmarks),
          AsyncStorage.getItem(KEYS.stats),
          AsyncStorage.getItem(KEYS.settings),
          AsyncStorage.getItem(KEYS.history),
        ]);
        if (bRaw) setBookmarks(JSON.parse(bRaw));
        if (sRaw) setStats(JSON.parse(sRaw));
        if (setRaw) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(setRaw) });
        if (hRaw) setQuizHistory(JSON.parse(hRaw));
      } catch (_) {}
    })();
  }, []);

  const toggleBookmark = useCallback((questionId: string) => {
    setBookmarks((prev) => {
      const next = prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId];
      AsyncStorage.setItem(KEYS.bookmarks, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const isBookmarked = useCallback(
    (questionId: string) => bookmarks.includes(questionId),
    [bookmarks]
  );

  const saveQuizResult = useCallback((result: QuizResult) => {
    setStats((prev) => {
      const pct = Math.round((result.score / result.total) * 100);
      const catStats = { ...prev.categoryStats };
      for (const a of result.answers) {
        if (!catStats[a.category]) catStats[a.category] = { correct: 0, total: 0 };
        catStats[a.category].total += 1;
        if (a.correct) catStats[a.category].correct += 1;
      }
      const next: AppStats = {
        totalQuizzes: prev.totalQuizzes + 1,
        totalQuestions: prev.totalQuestions + result.total,
        totalCorrect: prev.totalCorrect + result.score,
        bestScore: Math.max(prev.bestScore, pct),
        categoryStats: catStats,
      };
      AsyncStorage.setItem(KEYS.stats, JSON.stringify(next)).catch(() => {});
      return next;
    });

    setQuizHistory((prev) => {
      const next = [result, ...prev].slice(0, 20);
      AsyncStorage.setItem(KEYS.history, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      AsyncStorage.setItem(KEYS.settings, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const resetStats = useCallback(async () => {
    setStats(DEFAULT_STATS);
    setQuizHistory([]);
    await Promise.all([
      AsyncStorage.removeItem(KEYS.stats),
      AsyncStorage.removeItem(KEYS.history),
    ]).catch(() => {});
  }, []);

  return (
    <AppContext.Provider
      value={{
        bookmarks,
        stats,
        settings,
        quizHistory,
        toggleBookmark,
        isBookmarked,
        saveQuizResult,
        updateSettings,
        resetStats,
        unreadChatCount,
        setUnreadChatCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
