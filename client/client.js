(function () {
    "use strict";
    var shoe = require("shoe");
    var Model = require("scuttlebutt/model");

    var stream = shoe("/socket");

    var numbers = new Model;

    stream.pipe(numbers.createStream()).pipe(stream);

    var messages = document.getElementById("messages");

    numbers.on("update", function (object, timestamp, source) {
        messages.textContent = "KEY: " + object[0] + "\n" +
            "VALUE: " + object[1] + "\n" +
            "TIMESTAMP: " + timestamp + "\n" +
            "SOURCE: " + source;
    });

}());
