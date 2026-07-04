import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth, useUser } from "@clerk/expo";
import { useCallback, useEffect, useState } from "react";

const GUEST_NAME_KEY = "histospotter_chat_username";
const ANON_ID_KEY = "histospotter_anon_id";

function randomId(): string {
  return (
    Math.random().toString(36).slice(2) +
    Math.random().toString(36).slice(2) +
    Date.now().toString(36)
  );
}

export interface ChatIdentity {
  ready: boolean;
  /** Stable owner id used to authorise unsend. */
  senderId: string | null;
  /** Display name shown in the chat. */
  username: string | null;
  isSignedIn: boolean;
  /** Set a guest display name (for users who don't sign in). */
  setGuestName: (name: string) => Promise<void>;
}

/**
 * Resolves the current chat identity.
 * - Signed-in (Clerk) users → senderId `clerk:<id>`, name from their profile.
 * - Guests → persistent `anon:<uuid>` + a chosen display name.
 */
export function useChatIdentity(): ChatIdentity {
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  const [anonId, setAnonId] = useState<string | null>(null);
  const [guestName, setGuestNameState] = useState<string | null>(null);
  const [localLoaded, setLocalLoaded] = useState(false);
  const [authTimedOut, setAuthTimedOut] = useState(false);

  // Auth is optional: never block chat on Clerk. If it hasn't loaded within a
  // few seconds (misconfig / offline), fall through to guest mode.
  useEffect(() => {
    if (authLoaded) return;
    const t = setTimeout(() => setAuthTimedOut(true), 3000);
    return () => clearTimeout(t);
  }, [authLoaded]);

  useEffect(() => {
    (async () => {
      try {
        let [aId, gName] = await Promise.all([
          AsyncStorage.getItem(ANON_ID_KEY),
          AsyncStorage.getItem(GUEST_NAME_KEY),
        ]);
        if (!aId) {
          aId = randomId();
          await AsyncStorage.setItem(ANON_ID_KEY, aId);
        }
        setAnonId(aId);
        setGuestNameState(gName);
      } catch {
        setAnonId(randomId());
      } finally {
        setLocalLoaded(true);
      }
    })();
  }, []);

  const setGuestName = useCallback(async (name: string) => {
    const trimmed = name.trim().slice(0, 20);
    if (!trimmed) return;
    setGuestNameState(trimmed);
    try {
      await AsyncStorage.setItem(GUEST_NAME_KEY, trimmed);
    } catch {
      // ignore
    }
  }, []);

  const ready = localLoaded && (authLoaded || authTimedOut);

  if (isSignedIn && user) {
    const name =
      user.username ||
      [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
      user.primaryEmailAddress?.emailAddress?.split("@")[0] ||
      "User";
    return {
      ready,
      senderId: `clerk:${user.id}`,
      username: name,
      isSignedIn: true,
      setGuestName,
    };
  }

  return {
    ready,
    senderId: anonId ? `anon:${anonId}` : null,
    username: guestName,
    isSignedIn: false,
    setGuestName,
  };
}
