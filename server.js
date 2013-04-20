"use strict";

var shoe = require("shoe");
var http = require("http");
var dnode = require('dnode');


var ecstatic = require("ecstatic")(__dirname + "/static");

var server = http.createServer(ecstatic);
server.listen(3000);

var sock = shoe(function (stream) {
    var d = dnode({
        echo: function (s, cb) {
            cb(s);
        },
        uppercase: function (s, cb) {
            cb(s.toUpperCase());
        },
        route: function (route, param, cb) {
            if (route == "/test") {
                return cb(null, {
                    test: param
                });
            }

            cb(new Error("unmatched route"));

        }
    });
    d.pipe(stream).pipe(d);
});


sock.install(server, "/socket");
