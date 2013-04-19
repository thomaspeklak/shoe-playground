"use strict";

var shoe = require("shoe");
var http = require("http");

var ecstatic = require("ecstatic")(__dirname + "/static");

var server = http.createServer(ecstatic);
server.listen(3000);

var sock = shoe(function (stream) {
    stream.on("data", function (data) {
    });

    stream.on("connection", function () {
        console.log("CONNECTION");
    });

    stream.on("end", function () {
        console.log("stream end");
    });

    stream.pipe(process.stdout, {
        end: false
    });

    setInterval(function () {
        stream.write("Server\n");
    }, 500);
});


sock.install(server, "/socket");
