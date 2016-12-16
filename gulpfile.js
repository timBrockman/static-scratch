'use strict'
//general
var gulp = require( 'gulp');
var util = require('gulp-util');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var merge = require('merge-stream');
//templating
var frontMatter = require('gulp-front-matter');
var marked = require('gulp-marked');
var handlebars = require('gulp-compile-handlebars');
//other build and deploy
var images = require('gulp-responsive-images');
var ghpages = require('gulp-gh-pages');

//templating
gulp.task('grindPages', ()=>{
    return gulp.src('content/pages/*.md')
        .pipe(frontMatter({
            property:'page',
            remove:true
        }))
        .pipe(marked());
});
//responsive images

