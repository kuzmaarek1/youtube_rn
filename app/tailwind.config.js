/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,tsx,ts,jsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        red: "#FF0000",
        black: "#212121",
        white: "#FFFFFF",
        darkGrey: "#212121",
        lightGrey: "#606060",
        grey: "#303030",
      },
    },
  },
  plugins: [],
};
