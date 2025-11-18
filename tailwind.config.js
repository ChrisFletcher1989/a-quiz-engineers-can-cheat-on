/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".correct-answer": {
          "background-color": "#ef4444",
          color: "#ffffff",
          "font-weight": "bold",
          padding: "2px 4px",
          "border-radius": "4px",
          "margin-right": "12px",
        },
      });
    },
  ],
};
