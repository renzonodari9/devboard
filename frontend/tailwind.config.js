/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0a',
        'bg-soft': '#171717',
        'bg-card': '#262626',
        text: '#fafafa',
        'text-soft': '#a3a3a3',
        accent: '#22c55e',
        'accent-hover': '#16a34a',
        border: '#404040',
      },
    },
  },
  plugins: [],
}