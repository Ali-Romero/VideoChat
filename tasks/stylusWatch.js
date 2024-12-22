const { watch } = require('gulp')
const stylus = require('./stylus')

module.exports = function(done) {
  watch(['source/stylus/**/*.styl'], stylus)

  done()
}
