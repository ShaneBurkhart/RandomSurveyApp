'use strict'

var gulp = require('gulp');
var sass = require('gulp-sass');
var bower = require('gulp-bower');

var config = {
    imgFiles: "./assets/img/*",
    imgDest: "./public/img",
    sassFiles: "./assets/sass/*.scss",
    cssDest: "./public/css",
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
