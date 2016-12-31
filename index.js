/**
 * Created by Nicolas on 22/12/16.
 */
var path = require('path');
var absoluteify = require('absoluteify');
var fs = require('fs');
var cons = require('consolidate');
var http = require('http');
var socketio = require('socket.io');
var server = null;
var io = null;

var express = require('express');
var router = express.Router();

module.exports = yuubin;
module.exports.router = router;

var app;
var params = {};

/* GET home page. */
router.get('/', function (req, res, next) {
    console.log(this.params);
    var resHTML = '';
    fs.createReadStream(path.join(__dirname, 'assets/index.html'))
        .pipe(absoluteify(this.params.host + this.params.uri))
        .on('data', function (chunk) {
            resHTML += chunk.toString('utf8');
        })
        .on('end', function () {
            return res.send(resHTML);
        });
});

router.get('/styles/:file', function (req, res, next) {
    return res.sendFile(path.join(__dirname, 'assets/styles/' + req.params.file));
});

router.get('/scripts/:file', function (req, res, next) {
    return res.sendFile(path.join(__dirname, 'assets/scripts/' + req.params.file));
});

function yuubin(params) {
    this.params = params;
    server = http.Server(params.app);
    io = socketio(server);
    return function middleware(req, res, next) {
        next();
    }
}
