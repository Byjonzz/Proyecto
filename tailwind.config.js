/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5B3BDC',
        secondary: '#F97316',
        dark: '#1a1a2e',
        'dark-2': '#16213e',
      }
    },
  },
  plugins: [],
}
