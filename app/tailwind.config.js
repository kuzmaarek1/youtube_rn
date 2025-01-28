/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,tsx,ts,jsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        red: "#e31010",
        white: "#ffffff",
        lightGrey: "#b2b2b2",
        grey: "#8d8686",
        black: "#000000",
        dark: "#181818",
        darker: "#212121",
        mediumGrey: "#3d3d3d",
        lighterGrey: "#aaaaaa",
        crimson: "#90030c",
        scarlet: "#bf2626",
        brightRed: "#ee0f0f",
        lightRed: "#ecb7b7",
        paleGrey: "#e1e1e1",
      },
    },
  },
  plugins: [],
};
