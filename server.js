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
        echo: function (s, cb) {
           cb(s);
        },
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
    var mdm = MuxDemux(function (mdmstream) {
        if (mdmstream.meta == "first") {
            console.dir("FIRST CONNECTED");
            streams.push({
                meta: "first",
                stream: mdmstream
            });
        }

        if (mdmstream.meta == "second") {
            console.dir("SECOND CONNECTED");
            streams.push({
                meta: "second",
                stream: mdmstream
            });
        }

        if (mdmstream.meta == "rpc") {
            console.dir("RPC CONNECTED");
            mdmstream.on("data", function () { console.dir(arguments); });
            d.pipe(mdmstream).pipe(d);
        }

    });

    mdm.pipe(stream).pipe(mdm);
});


sock.install(server, "/socket");
