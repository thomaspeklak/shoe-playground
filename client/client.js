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

    var highest = document.getElementById("highest");
    var messages = document.getElementById("messages");
    var texts = document.getElementById("texts");

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

        var textSet = doc.createSet("type", "text");
        textSet.on("add", function (row) {
           texts.textContent += "NEW TEXT: " + row.get("text") + "\n";
        });

        var numbersSeq = doc.createSeq("type", "number");
        numbersSeq.on("add", function () {
            var numbers = [];
            var number = numbersSeq.first();
            numbers.push(number.get("number"));
            while((number = numbersSeq.next(number)) && numbers.length < 5) {
                numbers.push(number.get("number"));
            }

            highest.textContent = numbers.join("\n");
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
                doc.add({type: "text", text: document.getElementById("row-add").value});
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
