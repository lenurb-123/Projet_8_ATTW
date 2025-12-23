/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs de la charte graphique
        navy: {
          DEFAULT: '#0A1F33',
          dark: '#0D2B45',
        },
        sand: {
          DEFAULT: '#0A1F33',
        },
        orange: {
          DEFAULT: '#E8902C',
          dark: '#C57A25',
          light: '#EA9B41',
        },
        text: {
          DEFAULT: '#2E2E2E',
        },
        gray: {
          warm: '#B5AFA6',
        },
        cream: {
          DEFAULT: '#FAF7F2',
        },
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      fontWeight: {
        title: '600',
        'title-bold': '700',
        text: '400',
        'text-medium': '500',
      },
      borderRadius: {
        card: '12px',
      },
      boxShadow: {
        card: '0 2px 10px rgba(0,0,0,0.05)',
      },
    },
  },
  plugins: [],
}

