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
        "form-modal-gradient": 
          "linear-gradient(0deg,#6700f7 27%, rgba(0, 8, 255, 1) 100%)",
        "modal-gradient":
          "linear-gradient(90deg,rgba(105, 18, 102, 1) 0%, rgba(219, 0, 80, 1) 50%, rgba(194, 55, 196, 1) 100%)",
        "headtable-gradient":
          "linear-gradient(0deg,rgba(0, 89, 255, 1) 0%, rgba(0, 25, 99, 1) 100%)",
        "caution-1-gradient":
          "linear-gradient(to top,oklch(51.4% 0.222 16.935),oklch(63.7% 0.237 25.331))",
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
        "hover-blue": "#3b82f6",
        "head-column":"#142850",
        "caution-1" : "#BF3131",
        "caution-0" : "#F6F4F0",
        "border":"2E5077",
      },
      fontsize:{
         sm:['12px','16px'],
         base:['16px','24px'],
         lg:['20px','28px'],
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
