var gulp = require('gulp');
var del = require('del');
var merge = require('merge-stream');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var pngmin = require('gulp-pngmin');
var gulpif = require('gulp-if');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');

var isBuild = true;
gulp.task('clean', function(cb){
    cb();
    // del(['build/'], cb);
});

gulp.task('copy', ['clean'], function() {
  var res = gulp.src('src/**/*.{mp3,wav}')
    .pipe(gulp.dest('build/'));
  return res;
});

gulp.task('js', ['clean'], function(){
    var b = browserify({
        entries: './src/entry.js',
        debug: false
    });
    return b.bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(gulpif(isBuild, uglify()))
    .pipe(gulp.dest('./build/'));
})

gulp.task('img', ['clean'], function() {
    var jpg = gulp.src('src/img/**/*.{jpg,gif,svg}')
        .pipe(imagemin({
          progressive: true,
          use: []
        }))
        .pipe(gulp.dest('build/img'));

    var png = gulp.src('src/img/**/*.png')
        .pipe(pngmin())
        .pipe(gulp.dest('build/img'));

    return merge(jpg, png);
});

gulp.task('default', ['copy', 'img', 'js']);

gulp.task('setWatch', function(done){
    isBuild = false;
    done();
});

gulp.task('watch', ['setWatch', 'default'], function(){
    gulp.watch(['src/**/*.js'], ['js']);
    gulp.watch(['src/**/*.{jpg,gif,svg,png}'], ['img']);
});
