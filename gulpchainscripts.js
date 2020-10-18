const gulp = require('gulp')
const plumber = require('gulp-plumber')
const rename = require('gulp-rename')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')
const babel = require('gulp-babel')

module.exports = (src, templatePath, browserSync) => {
  const task = gulp
  .src(src, {dot: true})
  .pipe(plumber())
  .pipe(babel({
    ignore: ['./src/js/polyfill/*.js'],
    presets: ['@babel/env']
  }))
  .pipe(concat('build.js'))
  .pipe(gulp.dest(templatePath + '/js/'))

  if (process.env.NODE_ENV === 'production') {
    task.pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(file => {
      return file.base
    }))
  }

  task.pipe(browserSync.stream())

  return task
}
