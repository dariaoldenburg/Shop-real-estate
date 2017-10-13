var gulp = require('gulp'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat')
    sourcemaps = require('gulp-sourcemaps'),
    // ngAnnotate = require('gulp-ng-annotate'),
    argv = require('yargs').argv,
    gulpif = require('gulp-if');

config = {
    enableSourceMaps: argv.dev,
    enableMinify: !argv.dev
};

gulp.task('scripts', function () {
    return gulp.src(['media/vendors/**/*.js', 'media/app.js','media/app/**/*.js'])
        .pipe(gulpif(config.enableSourceMaps, sourcemaps.init()))
        .pipe(concat('all.js'))
        // .pipe(ngAnnotate())
        .pipe(gulpif(config.enableMinify, uglify()))
        .pipe(gulp.dest('public/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulpif(config.enableSourceMaps, sourcemaps.write('maps')))
        .pipe(gulp.dest('public/js'));
});

gulp.task('styles', function () {
    return gulp.src(['media/styles/**/*.scss'])
        .pipe(concat('all.css'))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulpif(config.enableMinify, cssnano()))
        .pipe(autoprefixer({
            browsers: ['last 8 version'],
            cascade: false
        }))
        .pipe(gulp.dest('public/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('public/css'));
});

// Default task
gulp.task('default', function() {
    gulp.run('styles', 'scripts');
});

gulp.task('watch', ['scripts', 'styles'], function () {
    gulp.watch('media/styles/**/*.scss', ['styles']);
    gulp.watch('media/app/**/*.js', ['scripts']);
});
