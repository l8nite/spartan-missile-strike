var redis = require('redis');
var client;

var connect = function(done) {
    var initializing = true;

    if (client !== undefined) {
        done(null, client);
    }

    console.log("Connecting to database...");
    client = redis.createClient('6379', 'localhost');

    client.on('error', function (err) {
        console.log("Redis Error: " + err);
        process.exit(1);
    });

    client.on('connect', function () {
        console.log("Redis Connected");
        client.select(1, function (err) {
            if (!err) {
                if (initializing) {
                    initializing = false;
                    done(null, client);
                }
            }
            else {
                console.log("Could not select(1): " + err);
                process.exit(1);
            }
        });
    });
};

module.exports.connect = connect;

Object.defineProperty(module.exports, "client", {
    get: function() { return client; }
});
