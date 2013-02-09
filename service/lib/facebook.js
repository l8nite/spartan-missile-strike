var should = require("should");
var fbgraph = require('fbgraph');

var configuration = {
    client_id: "122930357857037",
    client_secret: "a02a22691d2baa7eb1645d889afeb438",
};

var getApplicationAccessToken = function(done) {
    fbgraph.authorize({
        "client_id": configuration.client_id,
        "client_secret": configuration.client_secret,
        "grant_type": "client_credentials"
    }, function (err, res) {
        if (!err) {
            configuration.access_token = res.access_token;
            done(undefined, configuration.access_token);
        }
        else {
            console.log(err);
            done(err);
        }
    });
};

var createTestUser = function(name, done) {
    fbgraph.get(configuration.client_id + '/accounts/test-users',
        {
            installed: true,
            name: name,
            method: "post",
            access_token: configuration.access_token
        },
        function (err, res) {
            if (!err) {
                done(undefined, res);
            }
            else {
                done(err);
            }
        }
    );

    done();
};

var deleteTestUser = function(user, done) {
    fbgraph.del(user.id, done);
};

module.exports.configuration = configuration;
module.exports.getApplicationAccessToken = getApplicationAccessToken;
module.exports.createTestuser = createTestUser;
module.exports.deleteTestUser = deleteTestUser;
