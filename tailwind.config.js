/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        salesforce: {
          blue: '#0b66c3',
          dark: '#032d60',
          light: '#ecf3fe'
        }
      }
    },
  },
  plugins: [],
}