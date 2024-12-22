const { watch } = require('gulp')
const svgSprite = require('./svgSprite')

module.exports = function (done) {
  watch(['source/svg-sprite/*.svg'], svgSprite)

  done()
}
