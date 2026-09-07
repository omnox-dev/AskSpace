/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        mono: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
          950: '#030712',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'sharp': '4px 4px 0px 0px rgba(0,0,0,1)',
        'sharp-white': '4px 4px 0px 0px rgba(255,255,255,1)',
        'sharp-sm': '2px 2px 0px 0px rgba(0,0,0,1)',
        'sharp-sm-white': '2px 2px 0px 0px rgba(255,255,255,1)',
      }
    },
  },
  plugins: [],
};
