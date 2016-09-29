var gulp = require('gulp');
var sass = require('gulp-sass');
var nano = require('gulp-cssnano');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var browserSync = require('browser-sync');
var htmlmin = require('gulp-htmlmin');

gulp.task('browser-sync', ['sass', 'js', 'minify'], function() {
  browserSync({
      server: {
          baseDir: ''
      }
  });
});

gulp.task('minify', function() {
  return gulp.src('index-prod.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(rename('index.html'))
    .pipe(browserSync.reload({stream:true}))
    .pipe(gulp.dest(''));
});

gulp.task('sass', function () {
  return gulp.src('styles/main.scss')
    .pipe(sass({
        includePaths: ['_sass'],
    }))
    // .pipe(nano())
    .pipe(browserSync.reload({stream:true}))
    .pipe(gulp.dest('styles'));
});

gulp.task('js', function () {
  return gulp.src('js/script.js')
      .pipe(babel({
        presets: ['es2015']
      }))
      .pipe(uglify())
      .pipe(rename('script.min.js'))
      .pipe(browserSync.reload({stream:true}))
      .pipe(gulp.dest('js'))
});

gulp.task('watch', function () {
    gulp.watch('styles/main.scss', ['sass']);
    gulp.watch('js/script.js', ['js']);
    gulp.watch('index-prod.html', ['minify']);
});

gulp.task('default', ['browser-sync', 'watch']);
