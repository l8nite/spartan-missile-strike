var restify = require('restify'),
    ports = require('../../conf/ports.json'),
    _ = require('underscore');

// this is a long-lived access token, valid for 60 days
// if it expires, generate a new one by following the instructions here:
// https://developers.facebook.com/docs/howtos/login/extending-tokens/
var fbTestUserId = '100005307998484';
var fbTestUserAccessToken = 'AAABvzfRP6w0BAMYUjyRnd1IoByfy8WbrYYIgvVFzSkZCQ3ByN7UpJnz2PMXFoSI1gvbDGjg5vPyI6E4AxJrZA8Ev9seadm0ibFHFrubAZDZD';

var sessionId;

before(function (done) {
    // be sure the service is up
    getClient().post('/', function (err) {
        if (err && err.code === 'ECONNREFUSED') {
            console.log('Failed to connect to service, did you forget to start it?');
            done(err);
        }

        // log the test user into the service
        getClient().post('/sessions', { facebook_access_token: fbTestUserAccessToken }, function (err, req, res, obj) {
            sessionId = obj.session.id;
            done(err);
        });
    });
});

function getClient (options) {
    var clientOptions = {
        url: 'https://localhost:' + ports.apiServer,
        version: '*'
    };

    _.extend(clientOptions, options);

    return restify.createJsonClient(clientOptions);
}

function getAuthenticatedClient () {
    return getClient({ headers: { 'MissileAppSessionId': sessionId } });
}

module.exports.getClient = getClient;
module.exports.getAuthenticatedClient = getAuthenticatedClient;
module.exports.fbTestUserAccessToken = fbTestUserAccessToken;
