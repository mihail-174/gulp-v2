import gulp from 'gulp';
import gulpIf from 'gulp-if';

gulp.task('copy', () => (
  gulp.src('src/**/*.js')
  .pipe(gulp.dest('dist'))
));
