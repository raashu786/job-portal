/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,tsx}"],
  theme: {
    extend: {
      
      borderWidth: {
        '05': '0.5px',
        '02': '0.2px',
      },
      screens: {
        'xsm': '350px',
        'xs': '476px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
       
       
       
        
        
        '2xl-max': { 'max': '1535px' },
        'xl-mx': { 'max': '1279px' },
        'lg-mx': { 'max': '1023px' },
        'bs-mx':{'max':'899'},
        'md-mx': { 'max': '767px' },
        'sm-mx': { 'max': '639px' },
        'xs-mx': { 'max': '475px' },
        'xsm-mx': { 'max': '349px' },
      },
      colors: {
        'mine-shaft': {
          '50': '#f6f6f6',
          '100': '#e7e7e7',
          '200': '#d1d1d1',
          '300': '#b0b0b0',
          '400': '#888888',
          '500': '#6d6d6d',
          '600': '#5d5d5d',
          '700': '#4f4f4f',
          '800': '#454545',
          '900': '#3d3d3d',
          '950': '#2d2d2d',
        },
        'bright-sun': {
          '50': '#fffbeb',
          '100': '#fff3c6',
          '200': '#ffe588',
          '300': '#ffd149',
          '400': '#ffbd20',
          '500': '#f99b07',
          '600': '#dd7302',
          '700': '#b75006',
          '800': '#943c0c',
          '900': '#7a330d',
          '950': '#461902',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'bounce-icon': 'bounceIcon 0.6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        bounceIcon: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        
      },
      plugins: [require("daisyui")],
    },
  },
  plugins: [],
};
