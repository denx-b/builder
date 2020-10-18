const gulp = require('gulp')
const del = require('del')

// ...
const plumber = require('gulp-plumber')
const imageMin = require('gulp-imagemin')
const chainStyle = require('./gulpchainstyle')
const chainScripts = require('./gulpchainscripts')

// twig
const twig = require('gulp-twig')
const changed = require('gulp-changed')
const htmlBeautify = require('gulp-html-beautify')

// const
const browserSync = require('browser-sync').create()
const templatePath = './public'

gulp.task('html', () => {
  return gulp.src('./src/*.twig')
  .pipe(plumber())
  .pipe(changed('./src/*.twig'))
  .pipe(twig())
  .pipe(htmlBeautify({indentSize: 4}))
  .pipe(gulp.dest(templatePath))
})

gulp.task('images', () => {
  return gulp
  .src(['./src/images/**/*.{png,jpg,jpeg,webp,svg,ico}'])
  .pipe(
      imageMin([
        imageMin.optipng({optimizationLevel: 3}),
        imageMin.mozjpeg({quality: 75, progressive: true}),
        imageMin.svgo()
      ])
  )
  .pipe(gulp.dest(templatePath + '/assets/images'))
})

gulp.task('copy', () => {
  return gulp
  .src([
    './src/**/*.{eot,ttf,woff,woff2,png,jpg,jpeg,webp,svg,ico}',
    './src/js/vendor/**/*.js',
  ], {
    base: 'src'
  })
  .pipe(gulp.dest(templatePath + '/assets'))
})

gulp.task('styles', () => {
  return chainStyle([
    './src/sass/style.scss'
  ], templatePath + '/assets', browserSync)
})

gulp.task('scripts', () => {
  return chainScripts([
    './src/js/polyfill/*.js',
    './src/js/functions/*.js',
    './src/js/legancy/*.js',
    './src/js/index.js',
    '!./src/js/**/*.min.js'
  ], templatePath + '/assets', browserSync)
})

gulp.task('clean', () => {
  return del(templatePath);
})

gulp.task('serve', () => {
  browserSync.init({
    server: templatePath
  })
  gulp.watch('./src/sass/**/*.scss', gulp.series('styles'))
  gulp.watch('./src/**/*.twig', gulp.series('html', 'reload'))
  gulp.watch(['./src/js/**/*.js', '!./src/js/**/*.min.js'], gulp.series('scripts', 'reload'))
})

gulp.task('reload', done => {
  browserSync.reload()
  done()
})

gulp.task('build', gulp.series(
    'clean',
    'copy',
    'images',
    'styles',
    'scripts',
    'html',
))

gulp.task('start', gulp.series(
    'clean',
    'copy',
    'styles',
    'scripts',
    'html',
    'serve',
))
