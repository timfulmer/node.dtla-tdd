/**
 * From https://github.com/SBoudrias/gulp-istanbul.
 *
 * Created by tim on 8/11/14.
 */
var gulp = require('gulp');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha'); // Using mocha here, but any test framework will work

gulp.task('test', function (cb) {
    gulp.src(['lib/**/*.js', 'main.js'])
        .pipe(istanbul()) // Covering files
        .on('finish', function () {
            gulp.src(['test/**/*.js'])
                .pipe(mocha())
                .pipe(istanbul.writeReports()) // Creating the reports after tests ran
                .on('end', cb);
        });
});