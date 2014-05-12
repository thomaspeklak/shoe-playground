(function () {
    "use strict";
    var shoe = require("shoe");
    var Auth = require("auth-stream");

    var stream = Auth("user", "secret", shoe("/socket"));

    stream.on("data", function (data) {
        console.dir(data);
    });
}());
