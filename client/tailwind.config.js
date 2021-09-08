module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      spacing: {
        85: '340px',
        100: '550px',
        200: '800px',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-5deg)' },
          '50%': { transform: 'rotate(5deg)' },
        },
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
      },
      colors: {
        'light-purple': '#e6c8fa',
        'nice-purple': '#A548FC',
      },
    },
  },
  variants: {
    extend: {
      fontWeight: ['hover'],
      cursor: ['hover'],
      animation: ['hover'],
    },
  },
  plugins: [],
};
