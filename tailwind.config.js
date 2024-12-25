/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "all",
  content: ["./src/**/*.{rs,html,css}", "./dist/**/*.html"],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".drag-none": {
          "user-drag": "none",
          "-webkit-user-drag": "none",
          "-moz-user-drag": "none",
          "-o-user-drag": "none",
        },
      });
    },
  ],
};
