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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          'primary-foreground': "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          'accent-foreground': "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
        },
        // Brand palette
        kissan: {
          green: {
            dark: '#1B5E20',
            DEFAULT: '#2E7D32',
            mid: '#388E3C',
            light: '#66BB6A',
            pale: '#E8F5E9',
          },
          brown: {
            dark: '#3E2723',
            DEFAULT: '#5D4037',
            light: '#8D6E63',
            pale: '#EFEBE9',
          },
          sky: {
            dark: '#0D47A1',
            DEFAULT: '#42A5F5',
            light: '#90CAF9',
            pale: '#E3F2FD',
          },
          amber: {
            dark: '#E65100',
            DEFAULT: '#FFA726',
            light: '#FFCC80',
            pale: '#FFF3E0',
          },
          gold: '#F9A825',
          earth: '#795548',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans', 'sans-serif'],
        devanagari: ['Noto Sans Devanagari', 'sans-serif'],
        gujarati: ['Noto Sans Gujarati', 'sans-serif'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1rem",
        '2xl': "1.5rem",
        '3xl': "2rem",
      },
      boxShadow: {
        'card': '0 2px 12px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)',
        'card-hover': '0 8px 32px rgba(46,125,50,0.12), 0 2px 8px rgba(0,0,0,0.06)',
        'green': '0 4px 16px rgba(46,125,50,0.25)',
        'amber': '0 4px 16px rgba(255,167,38,0.3)',
        'blue': '0 4px 16px rgba(66,165,245,0.25)',
        'bottom-nav': '0 -2px 16px rgba(0,0,0,0.08)',
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pulse-green': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(46,125,50,0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(46,125,50,0)' },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fade-in 0.4s ease-out',
        'pulse-green': 'pulse-green 2s infinite',
        'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
}
