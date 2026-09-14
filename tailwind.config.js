/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        classified: {
          black: '#030303',
          dark: '#080808',
          charcoal: '#0f0f10',
          graphite: '#18181b',
          border: '#27272a',
          muted: '#71717a',
          light: '#f4f4f5',
        },
        cyan: {
          accent: '#00f0ff',
          glow: 'rgba(0, 240, 255, 0.4)',
          dim: 'rgba(0, 240, 255, 0.15)',
        }
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'scanline': 'scanline 8s linear infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'flicker': 'flicker 0.15s ease-in-out infinite alternate',
        'glitch-fast': 'glitchFast 0.3s ease-in-out',
        'radar-sweep': 'radarSweep 4s linear infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%': { opacity: '0.7', filter: 'brightness(0.85)' },
        },
        flicker: {
          '0%': { opacity: '0.85' },
          '100%': { opacity: '1' },
        },
        glitchFast: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
