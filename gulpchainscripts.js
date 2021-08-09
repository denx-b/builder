const gulp = require('gulp')
const plumber = require('gulp-plumber')
const rename = require('gulp-rename')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')
const babel = require('gulp-babel')
const sourcemaps = require('gulp-sourcemaps')
const tap = require('gulp-tap')

const empty = function() {
}

const PROD = process.env.NODE_ENV === 'production'

module.exports = (src, templatePath, browserSync) => {
  const task = gulp
    .src(src, { dot: true })
    .pipe(plumber())
    .pipe(!PROD ? sourcemaps.init() : tap(empty))
    .pipe(babel({
      ignore: ['./src/js/polyfill/*.js'],
      presets: ['@babel/env'],
      plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-proposal-private-methods']
    }))
    .pipe(concat('build.js'))
    .pipe(!PROD ? sourcemaps.write('.'): tap(empty))
    .pipe(gulp.dest(templatePath + '/js/'))

  if (PROD) {
    task.pipe(uglify())
      .pipe(rename({ suffix: '.min' }))
      .pipe(gulp.dest(file => {
        return file.base
      }))
  }

  task.pipe(browserSync.stream())

  return task
}
