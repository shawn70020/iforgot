/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        'light-blue':{
          500: '#3b82f6'
        },
        'dark-bg':{
          500: '#161616'
        }
      }
    },
  },
  plugins: [],
}

