var gulp = require('gulp');
var sass = require('gulp-sass');
var nano = require('gulp-cssnano');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var browserSync = require('browser-sync');

gulp.task('browser-sync', ['sass'], function() {
    browserSync({
        server: {
            baseDir: ''
        }
    });
});

gulp.task('sass', function () {
  return gulp.src('styles/main.scss')
    .pipe(sass({
        includePaths: ['_sass'],
    }))
    .pipe(nano())
    .pipe(browserSync.reload({stream:true}))
    .pipe(gulp.dest('styles'));
});

// gulp.task('js', function () {
//   return gulp.src('js/*.js')
//       .pipe(uglify())
//       .pipe(rename('script.min.js'))
//       .pipe(browserSync.reload({stream:true}))
//       .pipe(gulp.dest('js'))
// });

gulp.task('watch', function () {
    gulp.watch('styles/main.scss', ['sass']);
    // gulp.watch('js/*.js', ['js']);
    gulp.watch("*.html").on('change', browserSync.reload);
});

gulp.task('default', ['browser-sync', 'watch']);
