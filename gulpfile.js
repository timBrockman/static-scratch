'use strict'
//general
var gulp = require( 'gulp');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var merge = require('merge-stream');
var data = require('gulp-data');
//templating
var frontMatter = require('gulp-front-matter'),
  marked = require('gulp-marked');
var handlebars = require('gulp-compile-handlebars');
//other build and deploy
var images = require('gulp-responsive-images');
var ghpages = require('gulp-gh-pages');
//site info
var site = require('./site.json');
site.time = new Date();

//templating
gulp.task('grind-pages', ()=>{
  
  return gulp.src('content/pages/*.md')
    .pipe(frontMatter({
      property:'page',
      remove:true
    }))
    .pipe(marked())
//  .pipe(data((file)=>{console.log(file.page)}))  //sanity
//  .pipe(data((file)=>{console.log(file.contents.toString())}))  //sanity
    .pipe(gulp.dest('dist/'));
});
function applyTemplates(src = 'templates/page.hbs'){

}
function collectPosts(){
  
}
//responsive images

