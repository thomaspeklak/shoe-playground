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
            cb(s + " from SERVER");
            console.dir("ECHO");
        },
        start: function (cb) {
            streams.forEach(function (stream) {
                if (stream.timer) return;

                stream.timer = setInterval(function () {
                    stream.stream.write(stream.meta);
                }, parseInt(Math.random() * 1000, 10));
            });
            cb("started");
            console.dir("STARTED");
        },
        stop: function (cb) {
            streams.forEach(function (stream) {
                clearInterval(stream.timer);
                stream.timer = null;
            });
            cb("stopped");
            console.dir("STOPPED");
        }
    });
    var mdm = MuxDemux(function (mdmstream) {
        if (mdmstream.meta == "first") {
            streams.push({
                meta: "first",
                stream: mdmstream
            });
        }

        if (mdmstream.meta == "second") {
            streams.push({
                meta: "second",
                stream: mdmstream
            });
        }

        console.dir(mdmstream.meta);
    });


    var l = function () {
        console.dir(arguments)
    };
    mdm.on("error", function () {
        stream.end();
    });
    stream.on("error", function () {
        mdm.end();
    });

    mdm.pipe(stream).pipe(mdm);
    d.pipe(mdm.createStream("rpc")).pipe(d);
});

sock.install(server, "/socket");
