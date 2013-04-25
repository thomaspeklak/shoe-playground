"use strict";

var shoe = require("shoe");
var http = require("http");
var dnode = require("dnode");
var MuxDemux = require("mux-demux");

var ecstatic = require("ecstatic")(__dirname + "/static");

var server = http.createServer(ecstatic);
server.listen(3000);

var sock = shoe(function (stream) {
    console.dir("CONNECTION");
    var streams = [];
    var d = dnode({
        start: function (cb) {
            streams.forEach(function (stream) {
                stream.timer = setInterval(function () {
                    stream.stream.write(stream.meta);
                }, parseInt(Math.random() * 1000, 10));
            });
            cb("started");
        },
        stop: function (cb) {
            streams.forEach(function (stream) {
                clearInterval(stream.timer);
            });
            cb("stopped");
        }
    });
    var mdm = MuxDemux(function (stream) {
        if (stream.meta == "first") {
            console.dir("FIRST CONNECTED");
            streams.push({
                meta: "first",
                stream: stream
            });
        }

        if (stream.meta == "second") {
            console.dir("SECOND CONNECTED");
            streams.push({
                meta: "second",
                stream: stream
            });
        }

        if (stream.meta == "rpc") {
            console.dir("RPC CONNECTED");
            d.pipe(stream).pipe(d);
        }

    });

    mdm.pipe(stream).pipe(mdm);
});


sock.install(server, "/socket");
