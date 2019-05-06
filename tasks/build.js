import gulp from 'gulp';
import runSequence from 'run-sequence';

gulp.task('build', () => (
  runSequence(
      'clean',
      [
          'template',
          'style',
          'js',
          'fonts',
          'image',
      ],
      'zip'
  )
));
