// test/lib/test-user.js
// require this file for tests requiring a logged in smss user
var async = require('async');
var client = require('./service-client').client;

// this is a long-lived access token, valid for 60 days
// if it expires, generate a new one by following the instructions here:
// https://developers.facebook.com/docs/howtos/login/extending-tokens/
var fbTestUserId = '100005307998484';
var fbTestUserAccessToken = 'AAABvzfRP6w0BAMYUjyRnd1IoByfy8WbrYYIgvVFzSkZCQ3ByN7UpJnz2PMXFoSI1gvbDGjg5vPyI6E4AxJrZA8Ev9seadm0ibFHFrubAZDZD';

var smssSessionId;

function getLoggedInSessionId (callback) {
    if (smssSessionId !== undefined) {
        return callback(null, smssSessionId);
    }

    client.post('/sessions', { facebook_access_token: fbTestUserAccessToken }, function (err, req, res, obj) {
        smssSessionId = obj.session.id;
        callback(err, smssSessionId);
    });
}
