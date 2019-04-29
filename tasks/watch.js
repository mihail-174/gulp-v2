import gulp from 'gulp';
import watch from 'gulp-watch';
import runSequence from 'run-sequence';
import htmlInjector from 'bs-html-injector';
var browserSync = require('browser-sync').create();

gulp.task('watch', () => {
  global.isWatching = true;
  watch(['src/{components,layout}/**/*.jade'], () => runSequence('template'));
  watch('src/**/*.scss', () => {
    runSequence('style');
  });
  watch('src/**/*.js', () => {
    runSequence('js');
  });
  watch('src/img/**/*.*', () => {
    runSequence('image');
  });
});
