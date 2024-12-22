const path = require('path')
const { src, dest } = require('gulp')
const svgSymbols = require('gulp-svg-symbols')
const gulpif = require('gulp-if')
const rename = require('gulp-rename')
const cssmin = require('gulp-cssmin')
const filter = require('gulp-filter')

const config = {
  class: '.icon-%f'
}

// const production = process.env.NODE_ENV === 'production'
const production = false

module.exports = function () {
  const f = filter(['*.css'], { restore: true })

  return src(['source/svg-sprite/*.svg'])
    .pipe(svgSymbols(config))
    .pipe(f)
    .pipe(gulpif(production, cssmin()))
    .pipe(gulpif(production, rename({ suffix: '.min' })))
    .pipe(f.restore)
    .pipe(dest('dest/svg/'))
}
