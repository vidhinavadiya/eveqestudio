/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',           // yeh already tha, theek hai
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // ------------------ yahan se animations add kar rahe hain ------------------
      animation: {
        'shine-fast': 'shine 3s linear infinite',
        'shine-slow': 'shine 6s linear infinite',
        'text-shine': 'textShine 4s ease-in-out infinite',
        'pulse-slow': 'pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-fast': 'pulse 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
        'fade-slide': 'fadeSlide 0.8s ease-out forwards',
      },
      keyframes: {
        shine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        textShine: {
          '0%, 100%': { backgroundPosition: '200% center' },
          '50%':   { backgroundPosition: '-200% center' },
        },
        fadeSlide: {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      // -------------------------------------------------------------------------
    },
  },
  plugins: [],
}