/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}", // Include all app directory files
    "./src/pages/**/*.{js,ts,jsx,tsx}", // if you have pages directory
    "./src/components/**/*.{js,ts,jsx,tsx}", // if you have components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
