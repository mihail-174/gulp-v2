import gulp from 'gulp';
import runSequence from 'run-sequence';
import gulpIf from 'gulp-if';

gulp.task('build', () => (
  runSequence(
    'clean',
    'template',
    'style',
    'copy',
    'imagemin'
  )
));
