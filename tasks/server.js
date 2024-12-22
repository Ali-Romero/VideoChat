const browserSync = require('browser-sync').create()
const { watch } = require('gulp')

const config = {
  startPath : '/',
  server: {
    baseDir: 'dest/',
  },
  notify: false
}

module.exports = function(done) {
  browserSync.init(config)

  const watcher = watch(['dest/**/*.*'])

  watcher.on('change', browserSync.reload)

  done()
}
