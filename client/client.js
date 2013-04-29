(function () {
    "use strict";
    var reconnect = require("reconnect");
    var MuxDemux = require("mux-demux");
    var dnode = require("dnode");
    var Doc = require("crdt").Doc;

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

        var docStream = mdm.createStream("doc");
        var doc = new Doc;
        docStream.pipe(doc.createStream()).pipe(docStream);
        doc.on("create", function (row) {
            var number = row.get("number");
            if (number) {
                messages.textContent += "DOCUMENT ROW: " + number + "\n";
            }
            var text = row.get("text");
            if (text) {
                messages.textContent += "TEXT: " + text + "\n";
            }
        });

        var d = dnode();
        d.on("remote", function (remote) {
            remote.echo("echo me", function (s) {
                console.log(s);
            });

            document.getElementById("row-start").addEventListener("click", function (e) {
                e.preventDefault();
                remote.start(function (s) {console.dir(s)});
            });

            document.getElementById("row-stop").addEventListener("click", function (e) {
                e.preventDefault();
                remote.stop(function (s) {console.dir(s)});
            });

            document.getElementById("row-add-button").addEventListener("click", function (e) {
                e.preventDefault();
                doc.add({text: document.getElementById("row-add").value});
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
