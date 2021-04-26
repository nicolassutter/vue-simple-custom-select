let mix = require('laravel-mix')
const path = require('path')
require('mix-tailwindcss')

mix.sass('styles.scss', 'dist').tailwind()