/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sbGreen: '#6B2737',
        sbDark: '#2C1810',
        sbLight: '#D2B48C',
        sbGold: '#C8956C',
        sbCream: '#EADBC8',
        sbGray: '#F3E9DD',
        sbText: '#2C1810',
      },
      fontFamily: {
        lexend: ['"Lexend"', 'sans-serif'],
      },
      boxShadow: {
        'sb': '0 10px 30px -10px rgba(44, 24, 16, 0.2)',
        'sb-hover': '0 20px 40px -12px rgba(44, 24, 16, 0.3)',
      },
      borderRadius: {
        'sb': '1.25rem',
      },
    },
  },
  plugins: [],
}
