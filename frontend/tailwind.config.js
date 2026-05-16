/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        fg: {
          950: '#0c1f17',
          900: '#123026',
          700: '#2d4a3e',
          500: '#5a7d6e',
          300: '#9db5aa',
        },
        mint: {
          50: '#eef8f3',
          100: '#d8f0e4',
          400: '#3ecf8e',
          500: '#19a974',
          600: '#13875e',
        },
        coral: {
          400: '#ff8a65',
          500: '#ff6b4a',
        },
        surface: '#f6faf7',
      },
      boxShadow: {
        soft: '0 10px 40px -20px rgba(12, 31, 23, 0.35)',
        card: '0 4px 24px -8px rgba(12, 31, 23, 0.12)',
      },
    },
  },
  plugins: [],
}
