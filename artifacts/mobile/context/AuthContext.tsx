import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AppState, Platform } from "react-native";

export interface UserProfile {
  id: string;
  displayName: string;
  totalMinutes: number;
  joinedAt: string;
}

interface AuthContextValue {
  user: UserProfile | null;
  allUsers: UserProfile[];
  isLoading: boolean;
  setName: (displayName: string) => Promise<void>;
  clearName: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUsers: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const PROFILE_KEY = "@medspotter/profile_v2";

function generateId(): string {
  return "u_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const sessionStartRef = useRef<number | null>(null);
  const currentUserRef = useRef<UserProfile | null>(null);

  useEffect(() => {
    currentUserRef.current = user;
  }, [user]);

  const persistUser = useCallback(async (u: UserProfile) => {
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(u)).catch(() => {});
  }, []);

  const flushMinutes = useCallback(async () => {
    const cur = currentUserRef.current;
    if (!sessionStartRef.current || !cur) return;
    const elapsed = Math.floor((Date.now() - sessionStartRef.current) / 60000);
    if (elapsed <= 0) return;
    sessionStartRef.current = Date.now();
    const updated = { ...cur, totalMinutes: cur.totalMinutes + elapsed };
    setUser(updated);
    await persistUser(updated);
  }, [persistUser]);

  useEffect(() => {
    // Web preview dev bypass — skip onboarding so screens are visible in Replit
    if (Platform.OS === "web" && __DEV__) {
      setUser({ id: "dev", displayName: "Preview", totalMinutes: 0, joinedAt: new Date().toISOString() });
      setIsLoading(false);
      return;
    }
    AsyncStorage.getItem(PROFILE_KEY)
      .then((raw) => {
        if (raw) {
          const profile: UserProfile = JSON.parse(raw);
          setUser(profile);
          sessionStartRef.current = Date.now();
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!user) return;
    sessionStartRef.current = Date.now();
    const sub = AppState.addEventListener("change", async (state) => {
      if (state === "background" || state === "inactive") await flushMinutes();
      else if (state === "active") sessionStartRef.current = Date.now();
    });
    const interval = setInterval(flushMinutes, 60_000);
    return () => {
      sub.remove();
      clearInterval(interval);
      flushMinutes();
    };
  }, [user?.id]);

  const setName = useCallback(
    async (displayName: string) => {
      const existing = currentUserRef.current;
      const profile: UserProfile = {
        id: existing?.id ?? generateId(),
        displayName: displayName.trim(),
        totalMinutes: existing?.totalMinutes ?? 0,
        joinedAt: existing?.joinedAt ?? new Date().toISOString(),
      };
      setUser(profile);
      sessionStartRef.current = Date.now();
      await persistUser(profile);
    },
    [persistUser]
  );

  const clearName = useCallback(async () => {
    await flushMinutes();
    setUser(null);
    sessionStartRef.current = null;
    await AsyncStorage.removeItem(PROFILE_KEY).catch(() => {});
  }, [flushMinutes]);

  const refreshUsers = useCallback(async () => {
    const raw = await AsyncStorage.getItem(PROFILE_KEY).catch(() => null);
    if (raw) setUser(JSON.parse(raw));
  }, []);

  const allUsers = user ? [user] : [];

  return (
    <AuthContext.Provider
      value={{
        user,
        allUsers,
        isLoading,
        setName,
        clearName,
        logout: clearName,
        refreshUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
