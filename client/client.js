(function () {
    "use strict";
    var reconnect = require("reconnect");
    var MuxDemux = require("mux-demux");
    var dnode = require("dnode");
    var l = function (err) {
        console.dir({
            error: arguments[0],
            args: arguments[1],
            stack: err && err.stack
        });
    };

    var messages = document.getElementById("messages");

    reconnect(function (stream) {

        var mdm = MuxDemux();

        mdm.pipe(stream).pipe(mdm);

        mdm.on("error", l);
        stream.on("error", l);

        var first = mdm.createStream("first");
        first.on("data", function (data) {
            messages.textContent += "FIRST: " + data + "\n";
        });

        var second = mdm.createStream("second");
        second.on("data", function (data) {
            messages.textContent += "SECOND: " + data + "\n";
        });

        var d = dnode();
        d.on("remote", function (remote) {
            remote.echo("echo me", function (s) {
                console.log(s);
            });

            document.getElementById("start").addEventListener("click", function (e) {
                e.preventDefault();
                remote.start(function (s) {console.dir(s)});
            });

            document.getElementById("stop").addEventListener("click", function (e) {
                e.preventDefault();
                remote.stop(function (s) {console.dir(s)});
            });
        });

        d.on("error", l);
        d.on("end", l);
        d.on("fail", l);

        mdm.on("connection", function (stream) {
            if (stream.meta == "rpc") {
                console.log("RPC CONNECTED");
                stream.pipe(d).pipe(stream);
            }
        });

    }).connect("/socket");
}());
