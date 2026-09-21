import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Original clinical palette — still used directly in a few places
        // (ResultsPanel risk coloring) where shadcn's generic semantic
        // names don't carry enough meaning.
        paper: "#FAFAF7",
        ink: "#1C2321",
        teal: {
          DEFAULT: "#1F5F5B",
          dark: "#154442",
          light: "#E7F0EF",
        },
        amber: {
          DEFAULT: "#C17817",
          light: "#FBEEDD",
        },
        slate: {
          DEFAULT: "#8B8578",
          light: "#EFEDE7",
        },

        // shadcn/ui semantic tokens, mapped onto the palette above via
        // CSS variables in globals.css so every shadcn primitive picks
        // up the clinical look instead of shadcn's default zinc theme.
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        serif: ["'Source Serif 4'", "Georgia", "serif"],
        sans: ["'IBM Plex Sans'", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      maxWidth: {
        prose: "38rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
