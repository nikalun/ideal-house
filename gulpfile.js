const gulp = require('gulp');
const babel = require('gulp-babel');
const stylus = require('gulp-stylus');
const plumber = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const watch = require('gulp-watch');
const remember = require('gulp-remember');
const paths = require('gulp-path');
const html = require('gulp-html');
const fileinclude = require('gulp-file-include');
const browserSync = require("browser-sync");
const concat = require('gulp-concat');

const config = {
    server: {
        baseDir: "./",
        directory: true
    },
    host: "localhost",
    port: 9000,
    startPath: "./dist/index.html",
    tunnel: null,
    ui: false,
    online: true,
    notify: false,
    timestamps: false,
    ghostMode: false,
    logFileChanges: false,
    logSnippet: false,
    logPrefix: "tehnocentr"
};

gulp.task('webserver', () =>  browserSync(config));

gulp.task('js', function() {
    return gulp.src(['src/js/jquery.waypoints.min.js', 'src/js/jquery.inputmask.js', 'src/js/app.js'])
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('app.js'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('css', function() {
    return gulp.src('src/css/styles.styl')
        .pipe(plumber())
        .pipe(stylus({
            'include css': true
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('html', function() {
    gulp.src(['src/pages/index.html'])
        .pipe(html())
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('fonts', function () {
    gulp.src('src/fonts/**/*.*')
        .pipe(gulp.dest('dist/fonts/'));
});

gulp.task('img', function () {
    gulp.src('src/resources/img/*.*')
        .pipe(gulp.dest('dist/img/'));
});

gulp.task('build', [
    'css',
    'js',
    'html',
    'fonts',
    'img'
]);

gulp.task('watch', function() {
    watch(['src/css/*.styl', 'src/components/**/*.styl'], function(event, cb) {
        gulp.start('css').on('unlink', function(filepath) {
            remember.forget('css', paths.resolve(filepath));
        });
    });
    watch(['src/js/app.js'], function(event, cb) {
        gulp.start('js');
    });
    watch(['src/components/**/*.html'], function(event, cb) {
        gulp.start('html');
    });
    watch(['src/resources/img/*.*'], function(event, cb) {
        gulp.start('img');
    });
});

gulp.task('default', ['build', 'webserver', 'watch']);