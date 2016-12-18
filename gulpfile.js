'use strict'
//general
var gulp = require( 'gulp'),
  gutil = require('gulp-util'),
  rename = require('gulp-rename'),
  clean = require('gulp-clean'),
  merge = require('merge-stream'),
  data = require('gulp-data'),
  through = require('through2');
//templating
var frontMatter = require('gulp-front-matter'),
  marked = require('gulp-marked'),
  handlebars = require('gulp-compile-handlebars');
//other build and deploy
var images = require('gulp-responsive-images'),
  ghpages = require('gulp-gh-pages');
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
    .pipe(data(applyTemplates(file)))
//  .pipe(data((file)=>{console.log(file.page)}))  //sanity
//  .pipe(data((file)=>{console.log(file.contents.toString())}))  //sanity
    .pipe(gulp.dest('dist/'));
});
function applyTemplates(dataFile){
  var templateData = {
    content: dataFile.contents.toString(),
    site: site,
    page: dataFile.page
  };  
  var options={
    ignorePartials:true,
    batch:['./src/partials']
  };
  var templateUrl = '.src/templates/' + dataFile.page.template?dataFile.page.template:'default.hbs';

  return gulp.src(templateUrl);
};
function collectPosts(){
  
};
//responsive images
gulp.task('process-squares',()=>{});
gulp.task('process-banners',()=>{});
