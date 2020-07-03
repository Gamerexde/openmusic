const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

const directoryPath = path.join(__dirname, 'mp3');

var port = 3000;

app.get('/', function (req, res) {
    fs.readdir(directoryPath, function (err, files, callback) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        var songs = [];
        files.forEach(function (file) {
            songs.push(file)
        });
        var jsonObj = {};
        for (var i = 0 ; i < songs.length; i++) {
            jsonObj[i] = songs[i];
        }
        res.json(jsonObj)
    });
})

app.get('/music/:music', function (req, res) {
    var song = path.join(__dirname + "/mp3/" + req.params.music);
    var filePath = song;
    var stat = fs.statSync(filePath);
    var total = stat.size;
    if (req.headers.range) {
        var range = req.headers.range;
        var parts = range.replace(/bytes=/, "").split("-");
        var partialstart = parts[0];
        var partialend = parts[1];

        var start = parseInt(partialstart, 10);
        var end = partialend ? parseInt(partialend, 10) : total-1;
        var chunksize = (end-start)+1;
        var readStream = fs.createReadStream(filePath, {start: start, end: end});
        res.writeHead(206, {
            'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
            'Accept-Ranges': 'bytes', 'Content-Length': chunksize,
            'Content-Type': 'video/mp4'
        });
        readStream.pipe(res);
    } else {
        res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'audio/mpeg' });
        fs.createReadStream(filePath).pipe(res);
    }
});

app.listen(port, function() {
    console.log("Servidor de musica iniciado! \nPuerto: " + port)
})