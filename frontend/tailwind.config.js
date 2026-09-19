/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: "#080c14",
          card: "#0f172a",
          cardHover: "#162038",
          border: "#1e293b",
          neonCyan: "#00f3ff",
          neonPurple: "#a855f7",
          neonPink: "#ec4899",
          neonGreen: "#10b981",
          neonYellow: "#eab308",
          neonOrange: "#f97316",
        }
      },
      fontFamily: {
        cyber: ['"Chakra Petch"', '"Orbitron"', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 243, 255, 0.2), 0 0 10px rgba(0, 243, 255, 0.2)' },
          '100%': { boxShadow: '0 0 15px rgba(0, 243, 255, 0.6), 0 0 25px rgba(0, 243, 255, 0.4)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}
