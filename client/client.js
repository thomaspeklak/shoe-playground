(function () {
    "use strict";
    var shoe = require("shoe");
    var hyperspace = require("hyperspace");
    var through = require("through");

    var stream = shoe("/socket");

    var transform = through(function (data) {
        var split = data.split(",");
        this.queue({
            first: split[0],
            second: split[1]
        });
    });

    var html = "<tr><td class='first'></td><td class='second'></td></tr>";

    var render = function () {
        return hyperspace(html, function (row) {
            return {
                "tr": {
                    class: parseInt(row.first) < parseInt(row.second) ? "row-first" : "row-second"
                },
                ".first": row.first,
                ".second": row.second
            };
        });
    };

    stream.pipe(transform).pipe(render().appendTo("#messages"));
}());
