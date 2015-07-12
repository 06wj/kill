var gulp = require('gulp');
var del = require('del');
var merge = require('merge-stream');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var pngmin = require('gulp-pngmin');

gulp.task('clean', function(cb){
    del(['build/src'], cb);
});

gulp.task('copy', ['clean'], function() {
  var res = gulp.src('src/**/*.+(png|jpg|mp3|gif|swf|wav)')
    .pipe(gulp.dest('build/src'));
  return res;
});

gulp.task('js', ['clean'], function(){
    return gulp.src('src/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('build/src/'))
})

gulp.task('img', ['copy'], function() {
  var jpg = gulp.src('build/src/img/**/*.{jpg,gif,svg}')
    .pipe(imagemin({
      progressive: true,
      use: []
    }))
    .pipe(gulp.dest('build/src/img'));

    var png = gulp.src('build/src/img/**/*.png')
    .pipe(pngmin())
    .pipe(gulp.dest('build/src/img'));

    return merge(jpg, png);
});

gulp.task('default', ['img', 'js']);
