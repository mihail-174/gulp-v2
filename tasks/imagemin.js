import gulp from 'gulp';
import image from 'gulp-image';

gulp.task('imagemin', () => (
  gulp.src('src/img/**/*.*')
  .pipe(image({
    pngquant: ['--speed=1', '--force', 256],
    optipng: ['-i 1', '-strip all', '-fix', '-o7', '-force'],
    zopflipng: false,
    jpegRecompress: false,
    // jpegRecompress: ['--strip', '--quality', 'medium', '--min', 85, '--max', 90],
    mozjpeg: ['-optimize', '-progressive'],
    guetzli: false,
    gifsicle: true,
    svgo: true
  }))
  .pipe(gulp.dest('dist/img'))
));
