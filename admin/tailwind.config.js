/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        dark: "#212121",
        primary: "#0f766e",
      },
      screens: {
        "xs": {"min": "0px", "max": "280px"},
        ...defaultTheme.screens
      }
    },
  },
  plugins: [
  ],
};
