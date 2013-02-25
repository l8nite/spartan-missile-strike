var async = require('async'),
    uuid = require('node-uuid'),
    redis = require('../lib/database.js').client,
    fbgraph = require('fbgraph');

var DEFAULT_SESSION_EXPIRY_SECONDS = 2592000;

function createSession (request, response, done) {
    async.waterfall([
        function (next) { next(null, request); }, // enables arguments to first callback
        _getFacebookAccessTokenFromRequest,
        _validateFacebookAccessTokenByQueryingGraphAPI,
        _loadMissileStrikeUser,
        _createOrUpdateSession,
        _formatCreateSessionResponse,
    ],

    function (err, code, body) {
        if (code) {
            response.send(code, body);
        }
        else {
            response.send(500, err);
        }
    });
}

function _getFacebookAccessTokenFromRequest (request, next) {
    var fbAccessToken = request.params.facebook_access_token;

    if (fbAccessToken === undefined) {
        return next('error', 400, 'missing facebook_access_token parameter');
    }

    next (null, fbAccessToken);
}

function _validateFacebookAccessTokenByQueryingGraphAPI (fbAccessToken, next) {
    fbgraph.setAccessToken(fbAccessToken);

    fbgraph.get('/me', function (err, fbUser) {
        if (err) {
            if (err.type === 'OAuthException') {
                return next(err, 400, 'invalid facebook_access_token');
            }
            else {
                return next(err, 500);
            }
        }

        fbUser.access_token = fbAccessToken;

        next(null, fbUser);
    });
}

function _loadMissileStrikeUser (fbUser, next) {
    redis.get('facebook:' + fbUser.id, function (err, msUserId) {
        if (err) {
            return next(err, 500);
        }

        if (msUserId === null) {
            _createNewUser(fbUser, next);
        }
        else {
            _loadExistingUser(msUserId, next);
        }
    });
}

function _createNewUser (fbUser, next) {
    var msUser = {
        id: 'user:' + uuid.v4(),
        username: fbUser.name,
        created: (new Date()).toJSON(),
        facebook: fbUser,
    };

    redis.mset(
        'facebook:' + fbUser.id, msUser.id,
        msUser.id, JSON.stringify(msUser),
        function (err, res) {
            if (err) {
                return next(err, 500);
            }

            next(null, msUser);
        }
    );
}

function _loadExistingUser (msUserId, next) {
    redis.get(msUserId, function (err, msUserSerialized) {
        if (err) {
            return next(err, 500);
        }

        var msUser = JSON.parse(msUserSerialized);

        next(null, msUser);
    });
}

function _createOrUpdateSession (msUser, next) {
    var multi = redis.multi();

    // delete existing session if the user had one
    if (msUser.hasOwnProperty('session')) {
        multi.del(msUser.session);
    }

    // create new session identifier and persist it
    msUser.session = 'session:' + uuid.v4();;
    multi.setex(msUser.session, DEFAULT_SESSION_EXPIRY_SECONDS, msUser.id);
    multi.set(msUser.id, JSON.stringify(msUser));

    multi.exec(function (err, replies) {
        if (err) {
            return next(err, 500);
        }

        next(null, msUser);
    });
}

function _formatCreateSessionResponse (msUser, next) {
    var response = {
        session: { id: msUser.session },
        user: msUser,
    };

    next(null, 201, response);
}

function deleteSession (request, response, done) {
    response.send(500, 'not implemented');
    return done();
}

module.exports.installAuthenticatedRouteHandlers = function (server) {
    server.del('/sessions/:id', deleteSession);
};

module.exports.installPublicRouteHandlers = function (server) {
    server.post('/sessions', createSession);
};
