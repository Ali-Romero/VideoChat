const path = require('path')
const { src, dest } = require('gulp')
const gulpif = require('gulp-if')
const cssmin = require('gulp-cssmin')
const rename = require('gulp-rename')
const stylus = require('gulp-stylus')
const rupture = require('rupture')
const gcmq = require('gulp-group-css-media-queries')

const config = {
  use: [rupture()],
  include: [path.join(__dirname, '..', 'node_modules')],
  'include css': true,
}

const production = false
// const production = process.env.NODE_ENV === 'production'

module.exports = function() {
  return src('source/stylus/*.styl')
    .pipe(stylus(config))
    .pipe(gcmq())
    .pipe(gulpif(production, cssmin()))
    .pipe(gulpif(production, rename({ suffix: '.min' })))
    .pipe(dest('dest/css'))
}
