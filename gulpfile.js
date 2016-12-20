'use strict'
/*
required plugins and handles
*/
//general
const gulp = require( 'gulp'),
  rename = require('gulp-rename'),
  clean = require('gulp-clean'),
  gulpData = require('gulp-data'),
  fs = require('fs'),
  childProcess = require('child_process'),
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


/*
  tasks
*/

// clean
gulp.task('clean', ()=>{
  return gulp.src('./dist/')
    .pipe(clean());
});

//templating
gulp.task('grind-pages', ['clean'], ()=>{
  return gulp.src('./src/content/pages/*.md')
    .pipe(frontMatter({property:'page', remove:true}))//works with gulp-data
    .pipe(marked())
    .pipe(logPath())
    .pipe(attatchSiteData())
    .pipe(wrap(function (gulpData) { //data gulp-data
      return fs.readFileSync('./src/templates/' + (!gulpData.file.page.template?'default.liquid':gulpData.file.page.template)).toString()
    }, null, {engine: 'liquid'}))
    .on('error',(err)=>{console.log(err)})
    .pipe(logPath())
    .pipe(gulp.dest('dist/'));
});
//responsive images
gulp.task('process-squares',()=>{});
gulp.task('process-banners',()=>{});

gulp.task('build', ['grind-pages'],(cb)=>{cb();});

//deploy cant wait for gulp 4
gulp.task('deploy', ()=>{
  return childProcess.execFile('git subtree push --prefix dist origin gh-pages');
});
gulp.task('deploy-built', ['build'],()=>{
  return childProcess.execFile('git subtree push --prefix dist origin gh-pages');
});

//default
//for gulp 4 gulp.task('default',gulp.series('clean', 'build', 'deploy'));
gulp.task('default',['clean','build','deploy-built']);
/* 
helper functions 
*/
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