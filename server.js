"use strict";

var shoe = require("shoe");
var http = require("http");
var RemoteEventEmitter = require("remote-events");

var ecstatic = require("ecstatic")(__dirname + "/static");

var ree = new RemoteEventEmitter();

ree.on("ping", function () {
    ree.emit("ping");
    setTimeout(function () {
        console.log("pong");
        ree.emit("pong");
    }, Math.random() * 1000);
});

var server = http.createServer(ecstatic);
server.listen(3000);

var sock = shoe(function (stream) {
    stream.pipe(ree.getStream()).pipe(stream);
});


sock.install(server, "/socket");
