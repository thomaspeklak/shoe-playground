"use strict";

var shoe = require("shoe");
var http = require("http");
var Model = require("scuttlebutt/model");

var ecstatic = require("ecstatic")(__dirname + "/static");

var server = http.createServer(ecstatic);
server.listen(3000);

var numbers = new Model;

var sock = shoe(function (stream) {
    stream.pipe(numbers.createStream()).pipe(stream);
});

setInterval( function () {
    numbers.set("numbers", Math.random());
}, 1500);

sock.install(server, "/socket");
