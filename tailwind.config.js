/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],  
  theme: {
    extend: {
      colors:{
        primary:'#161622',
        colors: {
        primaryy: '#25292e',
        accent: '#ffd33d',
        text: '#f2f2f2',
      },
      }
    },
  },
  plugins: [],
}

