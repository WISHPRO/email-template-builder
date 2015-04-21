var gulp = require('gulp');
var sass = require('gulp-sass');
var fileinclude = require('gulp-file-include');
var inlineCss = require('gulp-inline-css');
var minifyHTML = require('gulp-minify-html');
var zip = require('gulp-zip');

// Build CSS files(s)
gulp.task('sass', function() {
   return gulp.src('./source/stylesheets/*.scss')
       .pipe(sass())
       .pipe(gulp.dest('./dist/html/css'));
});

// Build full HTML file(s)
gulp.task('build', ['sass'], function() {
    // gulp.src('./source/css/*').pipe(gulp.dest('./dist/html/css/'));
    gulp.src('./source/images/*').pipe(gulp.dest('./dist/html/images'));
    return gulp.src('./source/layout.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('./dist/html'));
});


gulp.task('inline', ['build'], function() {
    return gulp.src('./dist/html/*.html')
        .pipe(inlineCss({
                applyStyleTags: true,
                applyLinkTags: true,
                removeStyleTags: false,
                removeLinkTags: true
        }))
        .pipe(gulp.dest('dist/inline'))
        .pipe(minifyHTML({ conditionals: true, spare: true }))
        .pipe(gulp.dest('dist/compact'));
});

// Copy Images folder
gulp.task('images', function () {
    return gulp.src('./source/images/*')
        .pipe(gulp.dest('dist/inline/images'))
        .pipe(zip('images.zip'))
        .pipe(gulp.dest('dist/compact'))
});

// Default Task
gulp.task('default', ['build', 'inline', 'images']);
