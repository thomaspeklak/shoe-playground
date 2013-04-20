"use strict";

var shoe = require("shoe");
var http = require("http");

var ecstatic = require("ecstatic")(__dirname + "/static");

var server = http.createServer(ecstatic);
server.listen(3000);

var sock = shoe(function (stream) {
});


sock.install(server, "/socket");
