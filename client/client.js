(function () {
    "use strict";
    var shoe = require("shoe");
    var MuxDemux = require("mux-demux");
    var dnode = require("dnode");

    var messages = document.getElementById("messages");

    var stream = shoe("/socket");
    var mdm = MuxDemux();

    mdm.on("connection", function (stream) {
        console.dir(stream);
    });

    mdm.pipe(stream).pipe(mdm);

    var first = mdm.createStream("first");
    first.on("data", function (data) {
        messages.textContent += "FIRST: " + data + "\n";
    });

    var second = mdm.createStream("second");
    second.on("data", function (data) {
        messages.textContent += "SECOND: " + data + "\n";
    });

    var rpc = mdm.createStream("rpc");
    var d = dnode();
    d.on("remote", function (remote) {
        console.dir("REMOTE");
        remote.start(function (res) {
            console.dir(res);
        });

        remote.echo("echo me", function (s) {
            console.dir(s);
        });
    });

    rpc.pipe(d).pipe(rpc);

}());
