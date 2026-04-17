/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#060e20',
          dim: '#060e20',
          bright: '#1f2b49',
          'container-lowest': '#000000',
          'container-low': '#091328',
          container: '#0f1930',
          'container-high': '#141f38',
          'container-highest': '#192540',
          variant: '#192540',
          tint: '#a7a5ff',
        },
        primary: {
          DEFAULT: '#a7a5ff',
          container: '#9795ff',
          dim: '#645efb',
          fixed: '#9795ff',
          'fixed-dim': '#8885ff',
        },
        onPrimary: {
          DEFAULT: '#1c00a0',
          container: '#14007e',
          fixed: '#000000',
          'fixed-variant': '#1a0099',
        },
        secondary: {
          DEFAULT: '#e2e2e2',
          container: '#454747',
          dim: '#d4d4d4',
          fixed: '#e2e2e2',
          'fixed-dim': '#d4d4d4',
        },
        outline: {
          DEFAULT: '#6d758c',
          variant: '#40485d',
        },
        indigo: {
          500: '#4F46E5',
          600: '#4338CA',
        },
        error: '#ff6e84',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #a7a5ff 0%, #645efb 100%)',
        'hero-glow': 'radial-gradient(ellipse at 50% 0%, rgba(79,70,229,0.3) 0%, transparent 70%)',
        'card-glow': 'radial-gradient(ellipse at 50% 50%, rgba(100,94,251,0.08) 0%, transparent 80%)',
      },
      backdropBlur: {
        glass: '24px',
      },
      animation: {
        'bounce-dot': 'bounceDot 1.2s infinite ease-in-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-glow': 'pulseGlow 2s infinite',
        'skeleton': 'skeleton 1.5s infinite linear',
      },
      keyframes: {
        bounceDot: {
          '0%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-8px)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        slideUp: {
          from: { transform: 'translateY(16px)', opacity: 0 },
          to: { transform: 'translateY(0)', opacity: 1 },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(79,70,229,0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(79,70,229,0.8)' },
        },
        skeleton: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'glow-primary': '0 0 40px 0 rgba(100,94,251,0.06)',
        'glow-indigo': '0 0 20px rgba(79,70,229,0.4)',
      },
      borderRadius: {
        xl: '0.75rem',
      },
    },
  },
  plugins: [],
};
