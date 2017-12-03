import gulp from 'gulp';
import plumber from 'gulp-plumber';
import gulpIf from 'gulp-if';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';
import errorHandler from 'gulp-plumber-error-handler';
import jsInheritance from 'gulp-js-inheritance';
import cached from 'gulp-cached';
import filter from 'gulp-filter';

gulp.task('js', () => {
  gulp.src('src/**/*.js')
    .pipe(plumber({
      errorHandler: errorHandler(`Ошибка в \'JS\' task`)
    }))
    .pipe(cached('js'))
    .pipe(gulpIf(global.isWatching, jsInheritance({
      dir: 'src/'
    })))
    .pipe(filter(file => /src[\\\/]components/.test(file.path) || /src[\\\/]js/.test(file.path) || /src[\\\/]libs/.test(file.path)))
    // .pipe(uglify())
    .pipe(rename({
      dirname: '.'
    }))
    .pipe(gulp.dest('dist/js/'))
});
