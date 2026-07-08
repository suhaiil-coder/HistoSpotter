import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

import { ColorTokens, DEFAULT_THEME, THEMES, ThemeKey } from "@/constants/themes";

const STORAGE_KEY = "@medspotter/theme";

interface ThemeContextValue {
  themeKey: ThemeKey;
  colors: ColorTokens;
  setTheme: (key: ThemeKey) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  themeKey: DEFAULT_THEME,
  colors: THEMES[DEFAULT_THEME].colors,
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeKey, setThemeKey] = useState<ThemeKey>(DEFAULT_THEME);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored && stored in THEMES) {
        setThemeKey(stored as ThemeKey);
      }
    });
  }, []);

  const setTheme = useCallback((key: ThemeKey) => {
    setThemeKey(key);
    AsyncStorage.setItem(STORAGE_KEY, key);
  }, []);

  return (
    <ThemeContext.Provider value={{ themeKey, colors: THEMES[themeKey].colors, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
