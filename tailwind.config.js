/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin'

export default {
  content: ["./index.html", 
            "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        custom: ['Rubik', 'sans-serif'],
        audiowide: ['Audiowide', 'cursive'],
        content: ['Oxanium', 'cursive'],
        kanit: ['Kanit', 'sans-serif'],
      },

      // ใช้ gradient แบบกำหนดเอง
      backgroundImage: {
        "modal-gradient":"linear-gradient(90deg,rgba(105, 18, 102, 1) 0%, rgba(219, 0, 80, 1) 50%, rgba(194, 55, 196, 1) 100%)",
        "headtable-gradient":
          "linear-gradient(180deg,rgba(168, 43, 240, 1) 0%, rgba(75, 14, 244, 1) 100%)",
        "caution-1-gradient":
          "linear-gradient(to top,oklch(50.5% 0.213 27.518),oklch(51.4% 0.222 16.935),oklch(58.6% 0.253 17.585))",
        "caution-0.5-gradient":
          "linear-gradient(to bottom ,oklch(85.2% 0.199 91.936),oklch(90.5% 0.182 98.111))",
        "caution-blue-gradient": "linear-gradient(to top, #3b82f6, #60a5fa)",
        "normal-gradient":"radial-gradient(circle,rgba(161, 222, 255, 1) 0%, rgba(203, 233, 242, 1) 100%)",
      },
      textColor: {
        black: "#000000",
        white: "ffffff",
      },
      colors: {
        "hover-blue": "#3b82f6"
        ,
      },
      
      keyframes: {
        fadeInSlideIn: {
          '0%': { opacity: 0, transform: 'translateX(8px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
      },
      animation: {
        fadeInSlideIn: 'fadeInSlideIn 0.1s ease-out forwards',
      },
    },
  },
 
  plugins: [
    plugin(function ({ addComponents }) {
      addComponents({
        ".dropdown-style": {
          "@apply relative inline-flex": {},
        },
        ".dropdown-button": {
          // ไม่ใช้ @apply hs-dropdown-toggle เพื่อป้องกัน error
          "@apply py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50":
            {},
        },
        ".dropdown-menu": {
          "@apply transition-[opacity,margin] duration absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-md dark:bg-neutral-800 dark:border dark:border-neutral-700":
            {},
        },
        ".dropdown-item": {
          "@apply block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700":
            {},
        },
      });
    }),
  ],
};

