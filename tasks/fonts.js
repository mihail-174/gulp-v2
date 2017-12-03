import gulp from 'gulp';
import gulpIf from 'gulp-if';

gulp.task('fonts', () => (
  gulp.src('src/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
));
