/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2D4D39', // pine green
          light: '#3E6A4F',
          dark: '#1C3024',
        },
        secondary: '#F6F4E8', // off-white/cream
        accent: '#E87461', // soft terracotta
        success: '#6A994E', // medium green
        error: '#BC4749', // soft red
        text: '#333333', // dark gray
        background: '#FFFFFF', // white
      },
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
    },
  },
  plugins: [],
} 