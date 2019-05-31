import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-sass';
import errorHandler from 'gulp-plumber-error-handler';
import gulpIf from 'gulp-if';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'gulp-autoprefixer';
import rename from 'gulp-rename';
import sassInheritance from 'gulp-sass-inheritance';
import cached from 'gulp-cached';
import filter from 'gulp-filter';
import concat from 'gulp-concat';
import sortCSSmq from 'sort-css-media-queries';
import mqpacker from "css-mqpacker";
import postcss from "gulp-postcss";
import debug from "gulp-debug";

gulp.task('style', () => {
  gulp.src(['src/components/**/*.scss', 'src/libs/**/*.css'])
    .pipe(plumber({
      errorHandler: errorHandler(`Ошибка в \'Стилях\' task`)
    }))
    .pipe(cached('sass'))
    .pipe(gulpIf(global.isWatching, sassInheritance({
      dir: 'src'
    })))
    .pipe(filter(file => /src[\\\/]components/.test(file.path) || /src[\\\/]libs/.test(file.path) ))
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(autoprefixer({
      browsers: ['last 200 versions'],
      cascade: true
    }))
    .pipe(postcss([
        mqpacker({
            sort: sortCSSmq
        })
    ]))
    .pipe(rename({
      dirname: '.'
    }))
    .pipe(debug({
        "title": "CSS files"
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css'))

  gulp.src('src/components/**/*.scss')
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(postcss([
        mqpacker({
            sort: sortCSSmq
        })
    ]))
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('dist/css'))
});
