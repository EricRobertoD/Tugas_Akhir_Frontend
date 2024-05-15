/** @type {import('tailwindcss').Config} */
import {nextui} from "@nextui-org/react";
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#3498db',
        'secondary': '#2ecc71',
        'danger': '#e74c3c',
        'warning': '#f39c12',
        'info': '#3498db',
        'light': '#ecf0f1',
        'dark': '#34495e',
        'black': '#000000',
        'white': '#ffffff',
        'gray': '#7f8c8d',
        'gray-eric1': '#F2F2F2',
      },
    },
    screens: {
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }
    }
  },
  darkMode: "class",
  plugins: [nextui()],
};
