/**
 * Created by Nicolas on 22/12/16.
 */
var path = require('path');
var absoluteify = require('absoluteify');
var fs = require('fs');
var http = require('http');
var socketio = require('socket.io');
const EventEmitter = require('events');
var io = null;


var express = require('express');
var router = express.Router();

module.exports = yuubin;
module.exports.middleware = middleware;
module.exports.router = router;

var params = {};

const httpEventEmitter = new EventEmitter();

function yuubin(params) {
    console.log("yuubin setup");
    this.params = params;
    io = socketio(params.socketPort);
    io.on('connection', function (socket) {
        socket.emit('news', {hello: 'world'});
        socket.on('my other event', function (data) {
            console.log(data);
        });
    });
}

httpEventEmitter.on('httpEvent', function (req) {
    io.sockets.emit('httpEvent', {
            http: {
                method: req.method,
                url : req.url,
                body : req.body
            }
        }
    );
});

/* GET home page. */
router.get('/', function (req, res, next) {
    var resHTML = '';
    fs.createReadStream(path.join(__dirname, 'assets/index.html'))
        .pipe(absoluteify(this.params.host + ":" + this.params.hostPort + "/" + this.params.uri))
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

router.get('/scripts/script.js', function (req, res, next) {
    fs.readFile(path.join(__dirname, 'assets/scripts/script.js'), "utf-8", function (err, data) {
        return res.send(data.replace("{{SOCKET_URL}}", this.params.host + ":" + this.params.socketPort));
    });
});

router.get('/scripts/:file', function (req, res, next) {
    return res.sendFile(path.join(__dirname, 'assets/scripts/' + req.params.file));
});

function middleware(req, res, next) {
    httpEventEmitter.emit("httpEvent", req);
    next();

}


