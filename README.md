
Explaination
============

There are 2 sections in the demo

Uploading/Tile Generation: This is the root path for the app. Upload a picture and it will become available for use in the mapping section.

Mapping Section: At /map this lets you play around with markers and maps. You will need to manually change /public/js/main.js so that the tile path points to your uploaded tiles in /public/layers/{tilename}


Setup
=====

Install NPM packages
npm install

Install the GDAL library
brew install gdal

Install redis
brew install redis


Running
=======

Launch Redis
redis-server

In project directory
npm start


