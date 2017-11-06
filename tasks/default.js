import gulp from 'gulp';
import runSequence from 'run-sequence';

gulp.task('default', () => (
  runSequence(
    [
      'template',
      'style'
    ],
    'server',
    'watch'
  )
));
