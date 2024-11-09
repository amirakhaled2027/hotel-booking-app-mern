/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    container: {
      padding: {
        sm: "5rem",
        xl: "10rem",
      },
    },
    borderRadius: {
      "sm": "15px",
      "lg": "30px"
    },
    fontFamily: {
      head: ["serif", "system-ui"],
      body: ["sans-serif"]

      // head: ["Poppins", "sans-serif"],

      // 'sans': ['ui-sans-serif', 'system-ui'],
      // 'serif': ['ui-serif', 'Georgia'],
    },
  },
  plugins: [],
}