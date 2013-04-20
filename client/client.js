(function () {
    "use strict";
    var shoe = require("shoe");
    var dnode = require("dnode");

    var result = document.getElementById("result");
    var stream = shoe("/socket");

    var d = dnode();
    d.on("remote", function (remote) {
        remote.echo("beep", function (s) {
            result.textContent = "echo => " + s + "\n";
        });

        remote.uppercase("beep", function (s) {
            result.textContent += "uppercase => " + s + "\n";
        });

        remote.route("/test", 1, function (err, test) {
            if (err) {
                return result.textContent += "ERROR: " + err.message + "\n";
            }
            result.textContent += JSON.stringify(test) + "\n";
        });

        remote.route("/unmatched", 1, function (err, test) {
            if (err) {
                return result.textContent += "ERROR: " + err.message + "\n";
            }
            result.textContent += JSON.stringify(test);
        });
    });
    d.pipe(stream).pipe(d);
}());
