module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1971c2",
      },
      animation: {
        fadeIn: "fadeIn 0.2s linear",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0.3, width: 0 },
          "100%": { opacity: 1, width: "unset" },
        },
      },
    },
  },
  plugins: [],
};
