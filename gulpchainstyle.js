const gulp = require('gulp')
const gulpSass = require('gulp-sass');
const nodeSass = require('node-sass');
const sass = gulpSass(nodeSass);
const plumber = require('gulp-plumber')
const autoprefixer = require('gulp-autoprefixer')
const csso = require('gulp-csso')
const rename = require('gulp-rename')
const sourcemap = require('gulp-sourcemaps')
const tap = require('gulp-tap')

const empty = function () {};

module.exports = (src, templatePath, browserSync) => {
  const task = gulp
    .src(src, { dot: true })
    .pipe(process.env.NODE_ENV !== 'production' ? sourcemap.init() : tap(empty))
    .pipe(plumber())
    .pipe(sass({
      includePaths: ['node_modules']
    }))

  if (process.env.NODE_ENV === 'production') {
    task.pipe(autoprefixer({
      browsers: [
        'last 2 versions',
        'iOS >= 8'
      ],
      flexbox: true,
      cascade: true
    }))
      .pipe(rename('template_styles.css'))
      .pipe(gulp.dest(templatePath))
      .pipe(csso())
      .pipe(rename({ suffix: '.min' }))
      .pipe(gulp.dest(file => file.base))
      .pipe(browserSync.stream())
  } else {
    task.pipe(rename('template_styles.css'))
      .pipe(process.env.NODE_ENV !== 'production' ? sourcemap.write('.') : tap(empty))
      .pipe(gulp.dest(templatePath))
      .pipe(gulp.dest(templatePath))
      .pipe(browserSync.stream())
  }

  return task
}
