/*
----------
separate build/deploy processes (local machine & travis)
this gulpfile should have tasks to:
  - locally: If travis is set up, a build and gh-pages deploy will be triggered on master push. This is primarily for development.
    1. clean the dist folder
    2. run tests
      a. run test-build
      b. check for .dist/test.html
      c. verify it has sample elements and data
      d. remove .dist/test.html
    3. compiles site indexes
      a. parse the front matter from all src/content markdown files
      b. creates an dated archive index if archive: true (for blog/news)
      c. attaches tags, categories, etc. to site data
      d. outputs a .json file to dist
    4. creates pages and posts
      a. parse and strip front matter 
      b. convert markdown files to html
      c. applies template from front matter template variable
    5. deploy
      a. git add .
      b. git commit -m 'publish $timestamp'
      c. git push subtree to gh-pages

    
  - remotely 
    0. create an ~/output folder with liberal permissions in travis 
    1. same as local 2 (except saved to ~/output)
    2. same as local 3 
    3. run tests on deployment staging (output)
      a. run travis-test-build
      b. that output exsists
      c. that test files are as expected
      d. remove test files
      e. check for removal
    0. travis does deploy cd output, git init, etc. ...
----------
 */
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
  runSequence = require('run-sequence'),
  childProcess = require('child_process'),
  through = require('through2');
//testing (eventually make yeoman)
const mocha = require('gulp-mocha'),
  istanbul = require('gulp-istanbul'),
  plumber = require('gulp-plumber'),
  coveralls = require('gulp-coveralls');
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
// pass
gulp.task('pass',()=>{});

// clean
gulp.task('clean', ()=>{
  return gulp.src('./dist/')
    .pipe(clean());
});
//catalog
// creates indexes by tag and category and attaches to site object
gulp.task('catalog', ()+>{
  return gulp.src('./src/content/*.md')
    .pipe(frontMatter({property:'page', remove:false}))
    .pipe(addUrl(site));
});

//templating
gulp.task('grind-pages', ()=>{
  return gulp.src('./src/content/pages/*.md')
    .pipe(frontMatter({property:'page', remove:true}))//works with gulp-data
    .pipe(marked())
    .pipe(logPath())
    .pipe(attatchSiteData())
    .pipe(wrap((gulpData)=>{ //data gulp-data
      return fs.readFileSync('./src/templates/' + (!gulpData.file.page.template?'default.liquid':gulpData.file.page.template)).toString()
    }, null, {engine: 'liquid'}))
    .on('error',(err)=>{console.log(err)})
    .pipe(logPath())
    .pipe(gulp.dest('dist/'));
});
//responsive images
gulp.task('process-squares',()=>{});
gulp.task('process-banners',()=>{});

//gulp.task('build', ['grind-pages'],()=>{});

//deploy cant wait for gulp 4
gulp.task('deploy', ()=>{
  return childProcess.exec('git subtree push --prefix dist origin gh-pages');
});

//default
//gulp.task('default', gulp.series('clean', 'build', 'deploy'));
gulp.task('default', (cb)=>{
  runSequence('clean','grind-pages', cb);
});
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
function addUrl(siteObj, extension = ''){
  
  return through.obj((file, enc, cb)=>{
    var pageUrl = file.path.match(/([a-zA-Z0-9_-]+)\.md/)[1];
    pageUrl = pageUrl + extension;
    //refactor the following at some point
    siteObj.tags = siteObj.hasOwnProperty('tags')?siteObj.tags:{};
    if(file.page.hasOwnProperty('tags')){
      file.page.tags.forEach((tag)=>{
        siteObj.tags[tag] = siteObj.tags.hasOwnProperty(tag)?siteObj.tags[tag]:[];
        siteObj.tags[tag].push(pageUrl);
      });
    }
    siteObj.categories = siteObj.hasOwnProperty('categories')?siteObj.categories:{};
    if(file.page.hasOwnProperty('categories')){
      file.page.categories.forEach((category)=>{
        siteObj.categories[category] = siteObj.categories.hasOwnProperty(category)?siteObj.categories[category]:[];
        siteObj.categories[category].push(pageUrl);
      });
    }
    cb(null, file);
  });
}
