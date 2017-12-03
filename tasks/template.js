import gulp from 'gulp';
import gulpIf from 'gulp-if';
import plumber from 'gulp-plumber';
import jade from 'gulp-jade';
import pugLinter from 'gulp-pug-linter';
import prettify from 'gulp-jsbeautifier';
import inheritance from 'gulp-jade-inheritance';
import cached from 'gulp-cached';
import filter from 'gulp-filter';
import rename from 'gulp-rename';
import errorHandler from 'gulp-plumber-error-handler';
import useref from 'gulp-useref';
import csso from 'gulp-csso';

gulp.task('template', () => (
  gulp.src('src/**/*.jade')
  .pipe(plumber({
    errorHandler: errorHandler(`Ошибка в \'template\' task`)
  }))
  .pipe(cached('jade'))
  .pipe(gulpIf(global.isWatching, inheritance({
    basedir: 'src'
  })))
  .pipe(filter(file => /src[\\\/]layout/.test(file.path)))
  .pipe(jade({
    basedir: 'src'
  }))
  .pipe(gulpIf(process.env.PRETTIFY !== false, prettify({
    braceStyle: 'expand',
    indentWithTabs: true,
    indentInnerHtml: true,
    preserveNewlines: true,
    endWithNewline: true,
    wrapLineLength: 120,
    maxPreserveNewlines: 50,
    wrapAttributesIndentSize: 1,
    unformatted: ['use']
  })))
  .pipe(rename({
    dirname: '.'
  }))
  .pipe(gulpIf(process.env.NODE_ENV === 'production', useref()))
  .pipe(gulp.dest('dist'))
  // .pipe(gulpIf(process.env.NODE_ENV === 'production', gulp.dest('dist')))
  // .pipe(gulpIf(process.env.NODE_ENV === 'developer', gulp.dest('src')))
));

gulp.task('template:lint', () =>
  gulp.src('src/**/*.jade')
  .pipe(pugLinter())
  .pipe(pugLinter.reporter('fail'))
);
