/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // База
        milk: '#FDFCFA',
        cream: '#FAF9F6',
        'gray-violet': '#F5F3F7',
        'lavender-soft': '#EDE8F2',
        'lavender-light': '#E8E0F0',
        sand: '#F9F6F0',
        
        // Акценты
        'violet-deep': '#7C3AED',
        amethyst: '#9966CC',
        lavender: '#B794F4',
        lilac: '#C4B5FD',
        'violet-smoke': '#DDD6FE',
        
        // Текст
        'text-primary': '#3D3852',
        'text-secondary': '#6B6280',
        'text-muted': '#9992A8',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'breathe': 'breathe 6s ease-in-out infinite',
        'float': 'float 8s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
