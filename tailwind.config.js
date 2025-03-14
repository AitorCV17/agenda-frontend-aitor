/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        azure: {
          '50': '#f5f7fa',
          '100': '#e9edf5',
          '200': '#cfdae8',
          '300': '#a4bad5',
          '400': '#7395bd',
          '500': '#5179a6',
          '600': '#3e5f8a',
          '700': '#334d71',
          '800': '#2e425e',
          '900': '#2a3950',
          '950': '#1c2535',
        },
        dark: {
          'background': '#121212',
          'foreground': '#1e1e1e',
          'text': '#e4e4e4',
          'text-muted': '#a0a0a0',
          'primary': '#bb86fc',
          'secondary': '#03dac6',
          'error': '#cf6679',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
