/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8B4513',    // Saddle Brown
        secondary: '#CD853F',  // Peru
        accent: '#FFD700',     // Gold
        surface: {
          50: '#8B7B6A',
          100: '#7A6B5A',
          200: '#695A4A',
          300: '#584A3A',
          400: '#473A2A',
          500: '#3E2723',      // Dark wood
          600: '#352119',
          700: '#2C1B15',
          800: '#231511',
          900: '#1A1410'       // Deep brown-black
        },
        background: '#1A1410',
        success: '#228B22',
        warning: '#FF8C00',
        error: '#8B0000',
        info: '#4682B4'
      },
      fontFamily: {
        display: ['Bebas Neue', 'cursive'],
        sans: ['DM Sans', 'ui-sans-serif', 'system-ui'],
        heading: ['Bebas Neue', 'cursive']
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
        '7xl': '4.5rem',
        '8xl': '6rem',
        '9xl': '8rem'
      },
      animation: {
        'dust': 'dust 8s infinite linear',
        'target-slide': 'target-slide 0.3s ease-out',
        'muzzle-flash': 'muzzle-flash 0.1s ease-out',
        'screen-shake': 'screen-shake 0.2s ease-out',
        'combo-bounce': 'combo-bounce 0.3s ease-out'
      },
      keyframes: {
        'dust': {
          '0%': { transform: 'translateY(100vh) translateX(-50px)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(-100px) translateX(50px)', opacity: '0' }
        },
        'target-slide': {
          '0%': { transform: 'translateX(-100px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        'muzzle-flash': {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(1.5)' }
        },
        'screen-shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-2px)' },
          '75%': { transform: 'translateX(2px)' }
        },
        'combo-bounce': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}