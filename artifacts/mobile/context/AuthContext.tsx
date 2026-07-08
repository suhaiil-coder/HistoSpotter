import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AppState } from "react-native";

export interface UserProfile {
  username: string;
  passwordHash: string;
  displayName: string;
  totalMinutes: number;
  joinedAt: string;
}

interface AuthContextValue {
  user: UserProfile | null;
  allUsers: UserProfile[];
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (displayName: string, username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUsers: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const USERS_KEY = "@medspotter/users_v1";
const SESSION_KEY = "@medspotter/session_v1";

function simpleHash(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return h.toString(16);
}

function formatUsersKey() {
  return USERS_KEY;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const sessionStartRef = useRef<number | null>(null);
  const currentUserRef = useRef<UserProfile | null>(null);

  useEffect(() => {
    currentUserRef.current = user;
  }, [user]);

  const persistUsers = useCallback(async (users: UserProfile[]) => {
    await AsyncStorage.setItem(formatUsersKey(), JSON.stringify(users)).catch(() => {});
  }, []);

  const flushMinutes = useCallback(async () => {
    const cur = currentUserRef.current;
    if (!sessionStartRef.current || !cur) return;
    const elapsed = Math.floor((Date.now() - sessionStartRef.current) / 60000);
    if (elapsed <= 0) return;
    sessionStartRef.current = Date.now();

    setAllUsers((prev) => {
      const next = prev.map((u) =>
        u.username === cur.username
          ? { ...u, totalMinutes: u.totalMinutes + elapsed }
          : u
      );
      persistUsers(next);
      const updated = next.find((u) => u.username === cur.username);
      if (updated) {
        setUser(updated);
      }
      return next;
    });
  }, [persistUsers]);

  useEffect(() => {
    (async () => {
      try {
        const [usersRaw, sessionRaw] = await Promise.all([
          AsyncStorage.getItem(USERS_KEY),
          AsyncStorage.getItem(SESSION_KEY),
        ]);
        const users: UserProfile[] = usersRaw ? JSON.parse(usersRaw) : [];
        setAllUsers(users);
        if (sessionRaw) {
          const { username } = JSON.parse(sessionRaw);
          const found = users.find((u) => u.username === username);
          if (found) {
            setUser(found);
            sessionStartRef.current = Date.now();
          }
        }
      } catch (_) {}
      setIsLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!user) return;
    sessionStartRef.current = Date.now();

    const sub = AppState.addEventListener("change", async (state) => {
      if (state === "background" || state === "inactive") {
        await flushMinutes();
      } else if (state === "active") {
        sessionStartRef.current = Date.now();
      }
    });

    const interval = setInterval(flushMinutes, 60_000);

    return () => {
      sub.remove();
      clearInterval(interval);
      flushMinutes();
    };
  }, [user?.username]);

  const refreshUsers = useCallback(async () => {
    const raw = await AsyncStorage.getItem(USERS_KEY).catch(() => null);
    if (raw) setAllUsers(JSON.parse(raw));
  }, []);

  const login = useCallback(
    async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
      const raw = await AsyncStorage.getItem(USERS_KEY).catch(() => null);
      const users: UserProfile[] = raw ? JSON.parse(raw) : [];
      setAllUsers(users);

      const found = users.find(
        (u) => u.username.toLowerCase() === username.toLowerCase().trim()
      );
      if (!found) return { success: false, error: "No account found with that username." };
      if (found.passwordHash !== simpleHash(password)) {
        return { success: false, error: "Incorrect password." };
      }
      setUser(found);
      sessionStartRef.current = Date.now();
      await AsyncStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ username: found.username })
      ).catch(() => {});
      return { success: true };
    },
    []
  );

  const register = useCallback(
    async (
      displayName: string,
      username: string,
      password: string
    ): Promise<{ success: boolean; error?: string }> => {
      if (!displayName.trim()) return { success: false, error: "Display name is required." };
      if (!username.trim() || username.length < 3)
        return { success: false, error: "Username must be at least 3 characters." };
      if (password.length < 4)
        return { success: false, error: "Password must be at least 4 characters." };

      const raw = await AsyncStorage.getItem(USERS_KEY).catch(() => null);
      const users: UserProfile[] = raw ? JSON.parse(raw) : [];

      if (users.some((u) => u.username.toLowerCase() === username.toLowerCase().trim())) {
        return { success: false, error: "Username already taken." };
      }

      const newUser: UserProfile = {
        username: username.trim(),
        passwordHash: simpleHash(password),
        displayName: displayName.trim(),
        totalMinutes: 0,
        joinedAt: new Date().toISOString(),
      };
      const next = [...users, newUser];
      setAllUsers(next);
      setUser(newUser);
      sessionStartRef.current = Date.now();
      await Promise.all([
        AsyncStorage.setItem(USERS_KEY, JSON.stringify(next)),
        AsyncStorage.setItem(SESSION_KEY, JSON.stringify({ username: newUser.username })),
      ]).catch(() => {});
      return { success: true };
    },
    []
  );

  const logout = useCallback(async () => {
    await flushMinutes();
    setUser(null);
    sessionStartRef.current = null;
    await AsyncStorage.removeItem(SESSION_KEY).catch(() => {});
  }, [flushMinutes]);

  return (
    <AuthContext.Provider
      value={{ user, allUsers, isLoading, login, register, logout, refreshUsers }}
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
