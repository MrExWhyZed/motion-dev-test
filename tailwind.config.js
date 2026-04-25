/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        background: { DEFAULT: 'var(--background)' },
        foreground: { DEFAULT: 'var(--foreground)' },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        border: { DEFAULT: 'var(--border)' },
        input: { DEFAULT: 'var(--input)' },
        ring: { DEFAULT: 'var(--ring)' },
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        xl: 'calc(var(--radius) * 1.5)',
        '2xl': 'calc(var(--radius) * 2)',
        '3xl': 'calc(var(--radius) * 3)',
      },
      fontFamily: {
        sans: ['var(--font-manrope)', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(2.8rem, 9vw, 7rem)', { lineHeight: '0.95', letterSpacing: '-0.04em' }],
        'display-lg': ['clamp(2.2rem, 6.5vw, 5rem)', { lineHeight: '1.0', letterSpacing: '-0.03em' }],
        'display-md': ['clamp(1.6rem, 4.5vw, 3.2rem)', { lineHeight: '1.08', letterSpacing: '-0.025em' }],
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(201,169,110,0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(74,158,255,0.08) 0%, transparent 50%), radial-gradient(ellipse 50% 40% at 20% 90%, rgba(139,92,246,0.06) 0%, transparent 50%)',
        'card-gradient': 'linear-gradient(135deg, rgba(201,169,110,0.06) 0%, rgba(13,13,20,0) 100%)',
        'gold-shimmer': 'linear-gradient(90deg, transparent 0%, rgba(201,169,110,0.15) 50%, transparent 100%)',
      },
      animation: {
        'float': 'float-gentle 8s ease-in-out infinite',
        'float-reverse': 'float-gentle-reverse 9s ease-in-out infinite',
        'pulse-gold': 'pulse-glow-gold 5s ease-in-out infinite',
        'pulse-blue': 'pulse-glow-blue 5s ease-in-out infinite',
        'rotate-slow': 'rotate-slow 30s linear infinite',
        'scroll-bounce': 'scroll-bounce 2.5s ease-in-out infinite',
        'shimmer': 'shimmer-sweep 3s ease-in-out infinite',
        'gradient': 'gradient-shift 10s ease infinite',
        'fade-in': 'fade-in 1.2s ease-out forwards',
        'breathe': 'breathe 6s ease-in-out infinite',
        'light-sweep': 'light-sweep 3.5s ease-in-out infinite',
      },
      keyframes: {
        'float-gentle': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'float-gentle-reverse': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(10px)' },
        },
        'pulse-glow-gold': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(201,169,110,0.15)' },
          '50%': { boxShadow: '0 0 50px rgba(201,169,110,0.35), 0 0 80px rgba(201,169,110,0.15)' },
        },
        'pulse-glow-blue': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(74,158,255,0.1)' },
          '50%': { boxShadow: '0 0 50px rgba(74,158,255,0.3), 0 0 80px rgba(74,158,255,0.1)' },
        },
        'rotate-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'scroll-bounce': {
          '0%, 100%': { transform: 'translateY(0)', opacity: '1' },
          '50%': { transform: 'translateY(8px)', opacity: '0.4' },
        },
        'shimmer-sweep': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'breathe': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.03)' },
        },
        'light-sweep': {
          '0%': { transform: 'translateX(-100%) skewX(-15deg)', opacity: '0' },
          '30%': { opacity: '1' },
          '100%': { transform: 'translateX(300%) skewX(-15deg)', opacity: '0' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};