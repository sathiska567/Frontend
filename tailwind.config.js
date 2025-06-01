module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        shimmer: 'shimmer 4s infinite',
        blob: 'blob 7s infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)', opacity: 0 },
          '50%': { opacity: 0.3 },
          '100%': { transform: 'translateX(100%)', opacity: 0 },
        },
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid-pattern': '40px 40px',
      },
      perspective: {
        '1000': '1000px',
        '2000': '2000px',
      },
      rotate: {
        'y-6': 'rotateY(6deg)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    function({ addUtilities }) {
      const newUtilities = {
        '.perspective': {
          perspective: '1000px',
        },
        '.rotate-y-6': {
          transform: 'rotateY(6deg)',
        },
        '.animation-delay-2000': {
          'animation-delay': '2s',
        },
        '.animation-delay-4000': {
          'animation-delay': '4s',
        },
      };
      addUtilities(newUtilities);
    },
  ],
} 