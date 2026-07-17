import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-be-vietnam)", "system-ui", "sans-serif"],
      },
      colors: {
        // Xanh la chu dao (30%)
        brand: {
          DEFAULT: "#039855",
          dark: "#027a48",
          50: "#ecfdf3",
          100: "#d1fadf",
          200: "#a6f4c5",
          300: "#6ce9a6",
          400: "#32d583",
          500: "#12b76a",
          600: "#039855",
          700: "#027a48",
          800: "#05603a",
          900: "#054f31",
        },
        ink: {
          DEFAULT: "#0b0f0d",
          soft: "#1a1f1c",
          muted: "#5c6b63",
        },
        paper: {
          DEFAULT: "#ffffff",
          soft: "#f7faf8",
          line: "#e6ede9",
        },
      },
      borderRadius: {
        xl: "0.9rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(16,24,40,0.04), 0 4px 20px rgba(16,24,40,0.06)",
        lift: "0 10px 40px rgba(3,152,85,0.10)",
      },
      container: {
        center: true,
        padding: "1rem",
        screens: { "2xl": "1200px" },
      },
    },
  },
  plugins: [],
};

export default config;
