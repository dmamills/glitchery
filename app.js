var express = require('express');
var multipart = require('connect-multiparty');
var uuid = require('node-uuid');
var fs = require('fs');
var bodyParser = require('body-parser');
var async = require('async');
var exec = require('child_process').exec; 

var logger = require('./logger');

var multipartMiddleware = multipart({ uploadDir: __dirname + '/public/uploads'});
var app = express();

app.use(express.static('public'));

app.use(function(req,res,next) {
    logger.info('request for: ' + req.url);
    next();
});

app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', function(req,res) {
    res.sendFile(__dirname + '/views/index.html');
});

app.post('/save', function(req,res) {
    var base64Data = req.body.data.replace(/^data:image\/png;base64,/, "");
    var id = uuid.v4()
    var filename = id + '.png';

    fs.writeFile(__dirname + '/public/downloads/' + filename, base64Data, 'base64', function(err) {
        if(err) throw err;

        res.json({
           'id': id 
        });
    });
});


app.get('/download/:id', function(req,res) {
    var file = __dirname + '/public/downloads/' + req.params.id + '.png';
    res.download(file);
});

app.get('/gif/:id', function(req,res) {
    var file = __dirname + '/public/gif/' + req.params.id + '.gif';
    res.download(file);
});

app.post('/gif', function(req,res) {
    var frames = req.body.frames;
    var w = req.body.width;
    var h = req.body.height;
    var id = uuid.v4();
    var filename = id + '.gif';
    var path = __dirname + '/public/gif/' + filename;
    logger.info('Uploading gif of ' + frames.length + ' frames id: ' + id);

    async.each(frames, function(frame, cb) {
        var base64Data = frame.data.replace(/^data:image\/png;base64,/, "");
        var ffn = id.toString() + '-' + frames.indexOf(frame) + '.png';

        fs.writeFile(__dirname + '/public/gt/' + ffn, base64Data, 'base64', function(err) {
            if(err) cb(err);
            cb();
        })
    }, function(err) {
        if(err) throw err;
        logger.info('Finished writing frames for ' + id);

        var cmd = 'convert ';

        for(var i=0; i < frames.length;i++) {
            var ffn = id.toString() + '-' + i + '.png';
            cmd += '-delay ' + (frames[i].duration / 10) + ' ' + __dirname + '/public/gt/' + ffn + ' ';
        };

        cmd += path;
        // logger.info('cmd: ' + cmd);
        
        exec(cmd, function(err, stdout,stderr) {
            if(err) throw err;
            logger.info('Finished creating gif for ' + id);
            res.json({
                'id': id,
                'frames': frames.length
            });

        });

    });
});

app.post('/upload', multipartMiddleware, function(req,res) {
    var photo = req.files.photo;
    logger.info('uploading photo');
    res.json({'result': 'okay', 'filepath': photo.path.split('/public/')[1]});
});

app.listen(8000);
logger.info('GLITCHERY server listening on 8000');
