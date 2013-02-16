var install = function (server) {
    server.post('/sessions', createSession);
    server.del('/sessions/:id', deleteSession);
};

var redisClient = require('../lib/database.js').redisClient;
var fbgraph = require('fbgraph');

var createSession = function(req, res, next) {
    if (req.params.facebook_access_token !== undefined) {
        // query facebook for information regarding this access token
        fbgraph.setAccessToken(req.params.facebook_access_token);
        fbgraph.get('/me', function (err, fbresponse) {
            if (err && err.type === 'OAuthException') {
                res.send(400, 'invalid facebook_access_token');
            }
            else if (err) {
                console.log('unknown facebook /me error: ' + err);
                res.send(500);
            }
            else {
                /*{ id: '100005209452549',
                    name: 'Genghis Khan',
                    first_name: 'Genghis',
                    last_name: 'Khan',
                    link: 'http://www.facebook.com/profile.php?id=100005209452549',
                    gender: 'female',
                    timezone: 0,
                    locale: 'en_US',
                    updated_time: '2013-02-16T10:14:41+0000' } */

                // TODO: actually store it in the database...
                res.send(201, 'created session');
            }
        });
    }
    else {
        res.send(400, 'missing facebook_access_token parameter');
    }
    return next();
};

var deleteSession = function(req, res, next) {
    res.send(200, 'deleted session with id: ' + req.params.id);
    return next()
};

module.exports.install = install;
