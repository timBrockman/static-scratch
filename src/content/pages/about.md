---
template: default.liquid
---
# this is a second page

not much to see here

## this is a bit slow

  - my git flow seems to be a hangup
  - i might consider locally initing on travis
  - then pushing from the inited repo to the gh-pages branch
  - im not sure
  - this is getting a bit too trial/error 
  - maybe pull origin gh-pages or fetch origin -f gh-pages:gh-pages  

## maybe I need to rethink whats happening

  - maybe what needs to happen is a travis gulp script to handle builds
  - rather than send them to dist, send them to an ~/output folder instead of dist inside of repo directory
  - or copy dist to ~/output
  - then cd ~/output
  - then git init (in ~/output)
  - then git add remote
  - then push to gh-pages
