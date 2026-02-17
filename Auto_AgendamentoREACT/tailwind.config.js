// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html", // se existir
    "./src/**/*.{js,jsx,ts,tsx}", // isso aqui é o mais importante
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
