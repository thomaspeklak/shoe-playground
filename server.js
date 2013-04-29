"use strict";

var shoe = require("shoe");
var http = require("http");
var dnode = require("dnode");
var MuxDemux = require("mux-demux");
var Doc = require("crdt").Doc;

var ecstatic = require("ecstatic")(__dirname + "/static");

var server = http.createServer(ecstatic);
server.listen(3000);

var sock = shoe(function (stream) {
    console.dir("CONNECTION");
    var doc = new Doc;
    var docStream = doc.createStream();
    var timer;

    var d = dnode({
        echo: function (s, cb) {
            cb(s + " from SERVER");
            console.dir("ECHO");
        },
        start: function (cb) {
            timer = setInterval(function () {
                var number = Math.random();
                doc.add({type: "number", number: number, _sort: 1 - number});
            }, parseInt(Math.random() * 1000, 10));
            cb("started");
            console.dir("STARTED");
        },
        stop: function (cb) {
            clearInterval(timer);
            timer = null;
            cb("stopped");
            console.dir("STOPPED");
        }
    });
    var mdm = MuxDemux(function (mdmstream) {
        if (mdmstream.meta == "doc") {
            docStream.pipe(mdmstream).pipe(docStream);
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
