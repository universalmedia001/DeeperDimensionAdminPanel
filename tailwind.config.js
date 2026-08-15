/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: { colors: { ink: { 950: '#0d0b09', 900: '#14100d', 800: '#1d1611' }, ember: { 400: '#dfaa68', 500: '#c78a49', 600: '#9b6330' } }, fontFamily: { display: ['Playfair Display', 'serif'], sans: ['DM Sans', 'sans-serif'] } } },
  plugins: [],
};
