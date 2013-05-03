(function () {
    "use strict";
    var shoe = require("shoe");
    var RemoteEventEmitter = require("remote-events");

    var stream = shoe("/socket");
    var ree = new RemoteEventEmitter();

    ree.on("pong", function () {
        console.log("pong");
        setTimeout(function () {
            ree.emit("ping");
        }, Math.random() * 1000);
    });

    ree.on("ping", function () {
        console.log("ping");
    });

    ree.emit("ping");

    stream.pipe(ree.getStream()).pipe(stream);
}());
