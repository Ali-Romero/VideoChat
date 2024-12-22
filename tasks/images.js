const { src, dest } = require('gulp')
const newer = require('gulp-newer')

module.exports = function () {
  return src('source/images/**/*.*')
    .pipe(newer('dest/images'))
    .pipe(dest('dest/images'))
}
