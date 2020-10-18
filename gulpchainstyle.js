const gulp = require('gulp')
const sass = require('gulp-sass')
const plumber = require('gulp-plumber')
const autoprefixer = require('gulp-autoprefixer')
const csso = require('gulp-csso')
const rename = require('gulp-rename')

module.exports = (src, templatePath, browserSync) => {
  const task = gulp
  .src(src, {dot: true})
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
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(file => file.base))
    .pipe(browserSync.stream())
  } else {
    task.pipe(rename('template_styles.css'))
    .pipe(gulp.dest(templatePath))
    .pipe(browserSync.stream())
  }

  return task
}
