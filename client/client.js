(function () {
    "use strict";
    var shoe = require("shoe");
    var es = require("event-stream");

    var result = document.getElementById("messages");

    var stream = shoe("/socket");
    var s = es.mapSync(function (msg) {
        result.appendChild(document.createTextNode(msg));
        return "Client from event\n";
    });
    stream.on("data", function () {
        console.dir(arguments);
    });
    s.pipe(stream).pipe(s);

    setInterval(function () {
        stream.write("client\n");
    }, 510);
}());
