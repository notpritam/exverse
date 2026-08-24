import type { Config } from "tailwindcss";

/**
 * Tokens are CSS variables (see app/globals.css) so themes can swap them at
 * runtime with zero rebuilds. Tailwind utilities map onto those variables,
 * keeping utilities and the design system in sync.
 */
const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        "paper-2": "var(--paper-2)",
        panel: "var(--panel)",
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        muted: "var(--muted)",
        faint: "var(--faint)",
        line: "var(--line)",
        "line-soft": "var(--line-soft)",
        zip: "var(--zip)",
        "zip-wash": "var(--zip-wash)",
        think: "var(--think)",
        "think-wash": "var(--think-wash)",
        tool: "var(--tool)",
        "tool-wash": "var(--tool-wash)",
        verify: "var(--verify)",
        "verify-wash": "var(--verify-wash)",
        tip: "var(--tip)",
        "tip-wash": "var(--tip-wash)",
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: { sm: "6px", DEFAULT: "12px", lg: "20px", xl: "28px" },
      boxShadow: {
        card: "0 1px 2px rgb(0 0 0 / 0.05), 0 10px 34px -18px rgb(0 0 0 / 0.28)",
        float: "0 30px 70px -40px rgb(0 0 0 / 0.5)",
      },
      maxWidth: { measure: "45rem" },
      transitionTimingFunction: { spring: "cubic-bezier(.2,.8,.2,1)" },
      keyframes: {
        "fade-up": { "0%": { opacity: "0", transform: "translateY(8px)" }, "100%": { opacity: "1", transform: "none" } },
        "pulse-ring": { "0%,100%": { boxShadow: "0 0 0 0 var(--ring-c)" }, "70%": { boxShadow: "0 0 0 8px transparent" } },
      },
      animation: { "fade-up": "fade-up .5s var(--e,cubic-bezier(.2,.8,.2,1)) both" },
    },
  },
  plugins: [],
};

export default config;
