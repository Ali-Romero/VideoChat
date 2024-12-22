const { task, series, parallel } = require('gulp')
const clean = require('./tasks/clean')
const logger = require('./tasks/logger')
const server = require('./tasks/server')
const stylus = require('./tasks/stylus')
const stylusWatch = require('./tasks/stylusWatch')
const pug = require('./tasks/pug')
const pugWatch = require('./tasks/pugWatch')
const images = require('./tasks/images')
const imagesWatch = require('./tasks/imagesWatch')
const assets = require('./tasks/assets')
const assetsWatch = require('./tasks/assetsWatch')
const js = require('./tasks/js')
const jsWatch = require('./tasks/jsWatch')
// const icons = require('./tasks/icons')
// const iconsWatch = require('./tasks/iconsWatch')
// const svgSprite = require('./tasks/svgSprite')
// const svgSpriteWatch = require('./tasks/svgSpriteWatch')

task('clean', clean)
task('logger', logger)
task('server', server)
task('stylus', stylus)
task('stylus:watch', stylusWatch)
task('pug', pug)
task('pug:watch', pugWatch)
task('images', images)
task('images:watch', imagesWatch)
task('assets', assets)
task('assets:watch', assetsWatch)
task('js', js)
task('js:watch', jsWatch)
// task('icons', icons)
// task('icons:watch', iconsWatch)
// task('svgSprite', svgSprite)
// task('svgSprite:watch', svgSpriteWatch)

function dev() {
  return series(
    'clean',
    parallel('stylus', 'pug', 'images', 'assets', 'js'),
    parallel(
      'stylus:watch',
      'pug:watch',
      'images:watch',
      'assets:watch',
      'js:watch',
    ),
    'logger',
    'server',
  )
}

function prod() {
  return series('clean', parallel('stylus', 'pug', 'images', 'assets', 'js'))
}

function deploy() {
  return series('clean', parallel('stylus', 'pug', 'images', 'assets', 'js'))
}

exports.deploy = deploy()

exports.default = process.env.NODE_ENV === 'development' ? dev() : prod()
