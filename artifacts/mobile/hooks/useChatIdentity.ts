import AsyncStorage from "@react-native-async-storage/async-storage";
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
  /** Set a guest display name. */
  setGuestName: (name: string) => Promise<void>;
}

/**
 * Resolves the current chat identity.
 * - Guests → persistent `anon:<uuid>` + a chosen display name.
 */
export function useChatIdentity(): ChatIdentity {
  const [anonId, setAnonId] = useState<string | null>(null);
  const [guestName, setGuestNameState] = useState<string | null>(null);
  const [localLoaded, setLocalLoaded] = useState(false);

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

  return {
    ready: localLoaded,
    senderId: anonId ? `anon:${anonId}` : null,
    username: guestName,
    setGuestName,
  };
}
