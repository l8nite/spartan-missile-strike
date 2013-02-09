var should = require("should");
var fbgraph = require('fbgraph');

var fbconf = require("../lib/facebook-config.js");

before(function(done) {
    getApplicationAccessToken(function() {
        createTestUser(function() {
            done();
        });
    });
});

var getApplicationAccessToken = function(done) {
    fbgraph.authorize({
        "client_id": fbconf.client_id,
        "client_secret": fbconf.client_secret,
        "grant_type": "client_credentials"
    }, function (err, res) {
        if (!err) {
            fbconf.access_token = res.access_token;
            done();
        }
        else {
            console.log(err);
            should.fail();
        }
    });
});

var createTestuser = function(done) {
    console.log("CREATING TEST USER (TODO)");
    done();
});
