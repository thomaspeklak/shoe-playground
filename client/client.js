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
        if (stream.meta == "first") {
            stream.on("data", function (data) {
                messages.textContent += "FIRST FROM SERVER: " + data + "\n";
            });
        }
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

}());
