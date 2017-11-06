import gulp from 'gulp';
var browserSync = require('browser-sync').create();
import htmlInjector from 'bs-html-injector';

gulp.task('server', function() {
  browserSync.use(htmlInjector, {
    files: 'src/*.html',
  })
  browserSync.init({
    // files: ['src/*.html', 'src/**/*.js'],
    server: {
      baseDir: 'src',
    },
    open: false,
    injectChanges: true,
    tunnel: false,
    notify: true
  });
});
