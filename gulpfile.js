'use strict'
//general
const gulp = require( 'gulp'),
  gutil = require('gulp-util'),
  rename = require('gulp-rename'),
  clean = require('gulp-clean'),
  merge = require('merge-stream'),
  data = require('gulp-data'),
  fs = require('fs'),
  through = require('through2');
//templating
const frontMatter = require('gulp-front-matter'),
  marked = require('gulp-marked'),
  wrap = require('gulp-wrap');
//other build and deploy
const images = require('gulp-responsive-images'),
  ghpages = require('gulp-gh-pages');
//site info
var site = require('./site.json');
site.time = new Date();

// clean
gulp.task('clean', ()=>{
  return gulp.src('./dist/')
    .pipe(clean());
});
gulp.task('log', ()=>{
  gulp.src("./src/content/**.md")
    .pipe(marked())
    .pipe(gulp.dest("./foo"));
})
//templating
gulp.task('grind-pages', ()=>{
  return gulp.src('./src/content/pages/*.md')
    .pipe(frontMatter({property:'page', remove:true}))
    .pipe(marked())
    .pipe(logPath())
    .pipe(attatchSiteData())
    .pipe(wrap(function (data) {
      return fs.readFileSync('./src/template/' + (!data.file.page.template?'default.liquid':data.file.page.template)).toString()
    }, data, {engine: 'liquid'}))
    .on('error',(err)=>{console.log(err)})
    .pipe(logPath())

//    .pipe(applyTemplate())
//      .on('error', (error)=>{console.log(error)})
//  .pipe(data((file)=>{console.log(file)}))  //sanity
//  .pipe(data((file)=>{console.log(file.contents.toString())}))  //sanity
    .pipe(gulp.dest('dist/'));
});
function logPath(label = 'file path: '){
    return through.obj((file, enc, cb)=>{
      console.log(file.page);
      console.log(label, file.path);
      console.log(file.contents.toString())
      cb(null, file);
    });
}
function attatchSiteData(){
    return through.obj((file, enc, cb)=>{
        file.site = site;
        cb(null,file);
    });
}
//indexing
function collectPosts(){
  
};
//responsive images
gulp.task('process-squares',()=>{});
gulp.task('process-banners',()=>{});
