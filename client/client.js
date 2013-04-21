(function () {
    "use strict";
    var shoe = require("shoe");
    var MuxDemux = require("mux-demux");

    var messages = document.getElementById("messages");

    var stream = shoe("/socket");
    var mdm = MuxDemux(function (stream) {
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

}());
