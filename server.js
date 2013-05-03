"use strict";

var shoe = require("shoe");
var http = require("http");
var Auth = require("auth-stream");

var ecstatic = require("ecstatic")(__dirname + "/static");

var server = http.createServer(ecstatic);
server.listen(3000);

var sock = shoe(function (stream) {
    var auth = Auth(stream, function (user, pass) {
        if (user === "user" && pass === "secret") {
            return true;
        }

        return "ACCESS DENIED";
    });

    setInterval(function () {
        stream.write("beep");
    }, 1000);

    stream.pipe(auth).pipe(stream);
});

sock.install(server, "/socket");
