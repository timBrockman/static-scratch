# Static Scratch 

[![Build Status](https://travis-ci.org/timBrockman/static-scratch.svg?branch=master)](https://travis-ci.org/timBrockman/static-scratch)

This is a quick project to experiment with non-jekyll GitHub static site builds. 
The goal end game is to create something that lets you edit or add content, issue a PR, and let Travis build, test, and deploy to gh-pages.

  - gulp
  - handlebars
  - mocha -> chai (testing)
  - travis (deploys to gh-pages)
  - travis-ci (builds, tests, on success deploys to gh-pages)

## refactoring (done)
  - simple build (cp random index.html)
  - deploy to GitHub process works
  - refine travis-ci After_success deploy to use travis variables for config
  

## todo
  - write simple test
  - create simple hbs template
  - create simple md file
  - gulp hbs build
