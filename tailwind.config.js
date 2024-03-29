/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors:{
        white:'#FFFFFF',
        main_theme : '#f0f0f0',
        header_under: '#e7e7e7'
      },
      animation: {
        fade: "fadeIn 0.5s ease-in-out"
      },
      keyframes: {
        fadeIn: {
          "from": { opacity: 0, transform: "translateY(100%)" },
          "to": { opacity: 1, transform: "none" }
        }
      },
      backgroundImage:{
        'arrow-down':"url(../public/images/arrowDown.png)"
      },
      backgroundSize:{
        '15':'15px',
        '19-10':'19px 10.5px'
      }
    }
  },
  plugins: [],

}


