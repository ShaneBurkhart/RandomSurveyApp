'use strict'

var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var bower = require('gulp-bower');
var concat = require('gulp-concat');
var rename = require('gulp-rename');

var config = {
    imgFiles: "./assets/img/*",
    imgDest: "./public/img",
    sassFiles: "./assets/sass/*.scss",
    cssDest: "./public/css",
    scriptFiles: "./assets/js/*.js",
    scriptDest: "./public/js",
    bowerDir: './bower_components' 
}

gulp.task('bower', function() {
  return bower();
});

gulp.task('img', function() {
  gulp.src(config.imgFiles)
    .pipe(gulp.dest(config.imgDest));
});

gulp.task('css', function() {
  gulp.src(config.sassFiles)
    .pipe(sass().on('error', console.error))
    .pipe(gulp.dest(config.cssDest));
});

gulp.task('css:watch', ['css'], function() {
  gulp.watch(config.sassFiles, ['css']);
});

gulp.task('js', function() {
  gulp.src([
      config.bowerDir  + '/jquery/dist/jquery.js',
      config.scriptFiles
    ])
    .pipe(concat('main.min.js'))
    //.pipe(uglify())
    .pipe(gulp.dest(config.scriptDest));
});

gulp.task('js:watch', ['js'], function() {
  gulp.watch(config.scriptFiles, ['js']);
});
