/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      animation: {
        fade: "fadeIn 0.5s ease-in-out"
      },
      keyframes: {
        fadeIn: {
          "from": { opacity: 0, transform: "translateY(100%)" },
          "to": { opacity: 1, transform: "none" }
        }
      }
    }
  },
  plugins: [],
}

