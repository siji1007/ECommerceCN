/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        glowingBorder: {
          '0%': { boxShadow: '0 0 0px rgba(34, 197, 94, 0.5)' },
          '50%': { boxShadow: '0 0 10px rgba(34, 197, 94, 0.8)' },
          '100%': { boxShadow: '0 0 0px rgba(34, 197, 94, 0.5)' },
        },
      },
      animation: {
        glowingBorder: 'glowingBorder 2s infinite ease-in-out',
      },
    },
  },
  plugins: [],
};
