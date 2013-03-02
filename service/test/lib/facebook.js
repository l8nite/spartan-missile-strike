var should = require('should'),
    fbgraph = require('fbgraph');

var fbconf = require('../../conf/facebook.json');

var getApplicationAccessToken = function(done) {
    fbgraph.authorize({
        "client_id": fbconf.client_id,
        "client_secret": fbconf.client_secret,
        "grant_type": "client_credentials"
    }, function (err, res) {
        if (err) {
            console.log(err);
            done(err);
        }
        else if (res.hasOwnProperty('error')) {
            console.log(res);
            done(res);
        }
        else {
            fbconf.access_token = res.access_token;
            done(undefined, fbconf.access_token);
        }
    });
};

var createTestUser = function(name, done) {
    fbgraph.get(fbconf.client_id + '/accounts/test-users',
        {
            installed: true,
            name: name,
            method: "post",
            access_token: fbconf.access_token
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
};

var deleteTestUser = function(user, done) {
    fbgraph.del(user.id, done);
};

module.exports.getApplicationAccessToken = getApplicationAccessToken;
module.exports.createTestUser = createTestUser;
module.exports.deleteTestUser = deleteTestUser;
