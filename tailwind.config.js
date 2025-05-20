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
      },

      // ใช้ gradient แบบกำหนดเอง
      backgroundImage: {
        "headtable-gradient":
          "linear-gradient(to top, oklch(13% 0.028 261.692), oklch(20.8% 0.042 265.755),oklch(27.9% 0.041 260.031),oklch(37.2% 0.044 257.287))",
        "caution-1-gradient":
          "linear-gradient(to top,oklch(45.5% 0.188 13.697),oklch(51.4% 0.222 16.935),oklch(58.6% 0.253 17.585))",
        // 'caution-1-gradient': 'linear-gradient(to top, oklch(39.6% 0.141 25.723), oklch(50.5% 0.213 27.518), oklch(63.7% 0.237 25.331))',
        "caution-0.5-gradient":
          "linear-gradient(to top ,oklch(79.5% 0.184 86.047),oklch(85.2% 0.199 91.936),oklch(94.5% 0.129 101.54))",
        "caution-blue-gradient": "linear-gradient(to top, #3b82f6, #60a5fa)",
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

