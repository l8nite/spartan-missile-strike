var fbgraph = require("fbgraph");

var fbconf = require("../conf/facebook.json");

var getApplicationAccessToken = function() {
    console.log("Requesting application access token from Facebook");
    fbgraph.authorize({
        "client_id": fbconf.client_id,
        "client_secret": fbconf.client_secret,
        "grant_type": "client_credentials"
    }, function (err, res) {
        if (!err) {
            fbconf.access_token = res.access_token;
            console.log("Token: " + fbconf.access_token);
            saveAccessToken();
        }
        else {
            console.log(err);
            process.exit(-1);
        }
    });
});

var saveAccessToken = function() {
    var fs = require('fs');
    fs.write
};

getApplicationAccessToken();

