module.exports = {
  // important: '.vue-simple-select-container',
  purge: [
    'src/**/*.vue'
  ],
  prefix: 'vss-',
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      minWidth: theme => theme('spacing')
    },
  },
  variants: {
    extend: {
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false
  }
}
