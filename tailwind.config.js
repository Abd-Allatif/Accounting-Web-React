/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          root: 'var(--bg-root)',
          surface: 'var(--bg-surface)',
          card: 'var(--bg-card)',
          elevated: 'var(--bg-elevated)',
          input: 'var(--bg-input)',
          hover: 'var(--bg-hover)',
        },
        brand: {
          accent: 'var(--accent)',
          'accent-light': 'var(--accent-light)',
          'accent-dark': 'var(--accent-dark)',
          'accent-glow': 'var(--accent-glow)',
          cyan: 'var(--cyan)',
          emerald: 'var(--emerald)',
          rose: 'var(--rose)',
          amber: 'var(--amber)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
          accent: 'var(--text-accent)',
        },
        border: {
          DEFAULT: 'var(--border)',
          hover: 'var(--border-hover)',
          focus: 'var(--border-focus)',
        },
      },
      borderRadius: {
        xs: 'var(--radius-xs)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        full: 'var(--radius-full)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        glow: 'var(--shadow-glow)',
        card: 'var(--shadow-card)',
      },
      transitionDuration: {
        fast: 'var(--transition-fast)',
        normal: 'var(--transition-normal)',
        slow: 'var(--transition-slow)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
      },
      animation: {
        'card-in': 'cardIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fadeIn 0.2s ease both',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) both',
        'bar-pulse': 'barPulse 1s ease-in-out infinite',
      },
      keyframes: {
        cardIn: {
          from: { opacity: '0', transform: 'translateY(20px) scale(0.98)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        barPulse: {
          '0%, 100%': { transform: 'scaleY(1)', opacity: '0.6' },
          '50%': { transform: 'scaleY(1.5)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
