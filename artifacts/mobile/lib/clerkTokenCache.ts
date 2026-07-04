import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export interface TokenCache {
  getToken: (key: string) => Promise<string | undefined | null>;
  saveToken: (key: string, token: string) => Promise<void>;
  clearToken?: (key: string) => void;
}

const createTokenCache = (): TokenCache => ({
  getToken: async (key: string) => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  saveToken: async (key: string, token: string) => {
    try {
      await SecureStore.setItemAsync(key, token);
    } catch {
      // ignore write failures
    }
  },
  clearToken: (key: string) => {
    void SecureStore.deleteItemAsync(key);
  },
});

// SecureStore is native-only; on web Clerk falls back to its own storage.
export const tokenCache =
  Platform.OS !== "web" ? createTokenCache() : undefined;
