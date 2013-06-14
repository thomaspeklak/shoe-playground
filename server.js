"use strict";

var shoe = require("shoe");
var http = require("http");
var tuple = require("tuple-stream");
var Stream = require("stream");

var a = new Stream;
a.readable = true;
var b = new Stream;
b.readable = true;

var write = function (stream) {
    stream.emit("data", Date.now());
    setTimeout(function () { write(stream); }, Math.random() * 300 + 200);
};

var ecstatic = require("ecstatic")(__dirname + "/static");

var server = http.createServer(ecstatic);
server.listen(3000);

var sock = shoe(function (stream) {
    tuple(a, b).pipe(stream);

    write(a);
    write(b);
});


sock.install(server, "/socket");
