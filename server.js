"use strict";

var shoe = require("shoe");
var http = require("http");
var dnode = require("dnode");
var MuxDemux = require('mux-demux');

var ecstatic = require("ecstatic")(__dirname + "/static");

var server = http.createServer(ecstatic);
server.listen(3000);

var sock = shoe(function (stream) {
    console.dir("CONNECTION");
    var mdm = MuxDemux(function (stream) {
        if (stream.meta == "first") {
            setInterval(function () {
                stream.write("first stream");
            }, 1000);

        }

        if (stream.meta == "second") {
            setInterval( function () {
                stream.write("second");
            }, 750);
        }
    });

    mdm.pipe(stream).pipe(mdm);

    var first = mdm.createStream("first");

    setInterval(function () {
       first.write("another first");
    }, 800);
});


sock.install(server, "/socket");
