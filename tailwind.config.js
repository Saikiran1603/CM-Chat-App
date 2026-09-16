/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: '420px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        rail: '#12141d',
        railHover: '#1c1f2c',
        accent: {
          DEFAULT: '#3366ff',
          50: '#eef2ff',
          100: '#dde6ff',
          500: '#3366ff',
          600: '#2b56e0',
          700: '#2445b8',
        },
        panel: '#ffffff',
        appbg: '#f4f5f9',
        muted: '#8a8f9c',
        border: '#e7e9f0',
        bubbleIn: '#f0f1f6',
        bubbleOut: '#3366ff',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'ui-sans-serif', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        panel: '0 1px 2px rgba(16, 24, 40, 0.06)',
      },
      keyframes: {
        pulseSlow: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        },
      },
      animation: {
        pulseSlow: 'pulseSlow 2.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
