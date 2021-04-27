const mix = require('laravel-mix')
require('mix-tailwindcss')

mix.sass('styles.scss', 'dist').tailwind()