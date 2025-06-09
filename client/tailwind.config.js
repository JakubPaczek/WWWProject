/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: ['bg-blue-800', 'text-white', 'text-2xl', 'shadow-lg', 'tracking-wide', 'font-light'],
  theme: {
    extend: {},
  },
  plugins: [],
}