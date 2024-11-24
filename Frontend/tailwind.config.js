/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient': 'linear-gradient(134.51deg, #FF8999 10.95%, #B76ACB 74.78%)',
      },
    },
  },
  plugins: [],
}

