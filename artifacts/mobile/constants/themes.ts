export type ThemeKey = "midnight" | "gold" | "cobalt" | "forest" | "rose" | "ocean";

export interface ColorTokens {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  border: string;
  input: string;
  destructive: string;
  destructiveForeground: string;
  success: string;
  warning: string;
  text: string;
  tint: string;
  radius: number;
}

export interface ThemeDef {
  key: ThemeKey;
  name: string;
  preview: string;
  colors: ColorTokens;
}

const BASE = {
  destructive: "#EF4444",
  destructiveForeground: "#FFFFFF",
  success: "#22C55E",
  warning: "#F59E0B",
  radius: 16,
};

export const THEMES: Record<ThemeKey, ThemeDef> = {
  midnight: {
    key: "midnight",
    name: "Midnight",
    preview: "#7C65FA",
    colors: {
      ...BASE,
      background: "#0A0A12",
      foreground: "#F0EEFF",
      card: "#12121E",
      cardForeground: "#F0EEFF",
      primary: "#7C65FA",
      primaryForeground: "#FFFFFF",
      secondary: "#1A1A2E",
      secondaryForeground: "#F0EEFF",
      muted: "#14142A",
      mutedForeground: "#7070A0",
      accent: "#9D8BFA",
      accentForeground: "#FFFFFF",
      border: "#22224A",
      input: "#1A1A2E",
      text: "#F0EEFF",
      tint: "#7C65FA",
    },
  },
  gold: {
    key: "gold",
    name: "Onyx Gold",
    preview: "#F59E0B",
    colors: {
      ...BASE,
      background: "#0A0800",
      foreground: "#FFF8E8",
      card: "#181200",
      cardForeground: "#FFF8E8",
      primary: "#F59E0B",
      primaryForeground: "#000000",
      secondary: "#1A1500",
      secondaryForeground: "#FFF8E8",
      muted: "#121000",
      mutedForeground: "#8A7040",
      accent: "#FBBF24",
      accentForeground: "#000000",
      border: "#2A2000",
      input: "#1A1500",
      text: "#FFF8E8",
      tint: "#F59E0B",
    },
  },
  cobalt: {
    key: "cobalt",
    name: "Cobalt",
    preview: "#3B82F6",
    colors: {
      ...BASE,
      background: "#040B1A",
      foreground: "#E8F0FF",
      card: "#0A1528",
      cardForeground: "#E8F0FF",
      primary: "#3B82F6",
      primaryForeground: "#FFFFFF",
      secondary: "#0E1E40",
      secondaryForeground: "#E8F0FF",
      muted: "#0A1830",
      mutedForeground: "#5080A0",
      accent: "#60A5FA",
      accentForeground: "#FFFFFF",
      border: "#142A55",
      input: "#0E1E40",
      text: "#E8F0FF",
      tint: "#3B82F6",
    },
  },
  forest: {
    key: "forest",
    name: "Forest",
    preview: "#22C55E",
    colors: {
      ...BASE,
      background: "#020A03",
      foreground: "#EAFFEE",
      card: "#091408",
      cardForeground: "#EAFFEE",
      primary: "#22C55E",
      primaryForeground: "#FFFFFF",
      secondary: "#0D1C0C",
      secondaryForeground: "#EAFFEE",
      muted: "#071005",
      mutedForeground: "#4A7850",
      accent: "#4ADE80",
      accentForeground: "#FFFFFF",
      border: "#183218",
      input: "#0D1C0C",
      text: "#EAFFEE",
      tint: "#22C55E",
    },
  },
  rose: {
    key: "rose",
    name: "Rose Dark",
    preview: "#F43F5E",
    colors: {
      ...BASE,
      background: "#0A0208",
      foreground: "#FFE8EE",
      card: "#160810",
      cardForeground: "#FFE8EE",
      primary: "#F43F5E",
      primaryForeground: "#FFFFFF",
      secondary: "#1E0812",
      secondaryForeground: "#FFE8EE",
      muted: "#12050E",
      mutedForeground: "#806070",
      accent: "#FB7185",
      accentForeground: "#FFFFFF",
      border: "#2A1020",
      input: "#1E0812",
      text: "#FFE8EE",
      tint: "#F43F5E",
    },
  },
  ocean: {
    key: "ocean",
    name: "Ocean",
    preview: "#06B6D4",
    colors: {
      ...BASE,
      background: "#060C18",
      foreground: "#E8F4FF",
      card: "#0D1A2E",
      cardForeground: "#E8F4FF",
      primary: "#06B6D4",
      primaryForeground: "#FFFFFF",
      secondary: "#112040",
      secondaryForeground: "#E8F4FF",
      muted: "#0F1C35",
      mutedForeground: "#5F899F",
      accent: "#22D3EE",
      accentForeground: "#FFFFFF",
      border: "#1C3550",
      input: "#112040",
      text: "#E8F4FF",
      tint: "#06B6D4",
    },
  },
};

export const DEFAULT_THEME: ThemeKey = "midnight";
