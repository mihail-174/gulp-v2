import gulp from 'gulp';
import newer from 'gulp-newer';
import image from 'gulp-image';

gulp.task('image', () => (
  gulp.src('src/img/**/*.*')
  .pipe(newer('dist/img'))
  .pipe(image({
    pngquant: ['--speed=1', '--force', 256],
    optipng: ['-i 1', '-strip all', '-fix', '-o7', '-force'],
    // zopflipng: false,
    jpegRecompress: false,
    // jpegRecompress: ['--strip', '--quality', 'medium', '--min', 85, '--max', 90],
    mozjpeg: ['-optimize', '-progressive'],
    guetzli: false,
    gifsicle: true,
    svgo: true
  }))
  .pipe(gulp.dest('dist/img'))
));
