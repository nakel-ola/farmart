/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        dark: "#212121",
        primary: "#0f766e",
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar-hide"),
    // require("./src/components/scrollbar")
  ],
};
