# glitchatory

apply filters to canvas using the mouse to create stills and animations

## setup & running

This server has a dependency on `imagemagick`

```
npm install
gulp build
gulp watch
node app.js
```


## api

* `/` base app
* `POST /save` saves a base64 image to file
* `GET /download/:id` downloads the specified image
* `GET /gif/:id` downloads the specified gif
* `POST /gif` uploads a series of base64 images and converts them to a gif
* `POST /upload` uploads a image

## todo

* drag and drop rearrange of frames
* cronjob to cleanup temp folders (prod)
* adjustable loop interval
* circular brush
* brush preview?
* block upload with no file
* moooar filters (blur!)
