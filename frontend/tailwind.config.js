/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./(tabs)/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#ff6a00",  // Default shade (primary-500)
        secondary: "#9c4a22", // Default shade (secondary-500)
        error: "#ff0000",    // Example error color
        inputBg: "#f5f5f5",  // Example background for inputs
        text: "#333333",     // Example text color
        background: "#ffffff", // Example background color
      },
    },
  },
  plugins: [],
};
