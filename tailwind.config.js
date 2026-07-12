/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // FIFA 2026 Design System
        gold: {
          DEFAULT: '#10B981',
          light: '#34D399',
          dark: '#059669',
          subtle: 'rgba(16, 185, 129,0.15)',
        },
        pitch: {
          950: '#0A0A0A',
          900: '#111111',
          800: '#1A1A1A',
          700: '#242424',
          600: '#2E2E2E',
        },
        navy: {
          DEFAULT: '#1A2F5A',
          light: '#243F78',
          dark: '#0F1C38',
        },
        danger: '#E53E3E',
        medical: '#38A169',
        safety: '#C084FC',
        warning: '#DD6B20',
        // Zone colors
        zone: {
          A: '#E53E3E',
          B: '#DD6B20',
          C: '#D69E2E',
          D: '#276749',
          E: '#2B6CB0',
          F: '#553C9A',
          G: '#97266D',
          H: '#10B981',
        }
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.4s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'shimmer': 'shimmer 2.5s linear infinite',
        'ping-slow': 'ping 2s cubic-bezier(0,0,0.2,1) infinite',
      },
      keyframes: {
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(16, 185, 129,0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(16, 185, 129,0)' },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gold-shimmer': 'linear-gradient(90deg, transparent 0%, rgba(16, 185, 129,0.2) 50%, transparent 100%)',
        'hero-gradient': 'linear-gradient(135deg, #0A0A0A 0%, #1A2F5A 50%, #0A0A0A 100%)',
        'card-gradient': 'linear-gradient(135deg, #1A1A1A 0%, #242424 100%)',
        'gold-gradient': 'linear-gradient(135deg, #10B981 0%, #34D399 50%, #059669 100%)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
