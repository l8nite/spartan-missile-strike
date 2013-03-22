var async = require('async'),
    uuid = require('node-uuid'),
    redis = require('../lib/database.js'),
    routeutil = require('../lib/routeutil.js'),
    restify = require('restify'),
    fbgraph = require('fbgraph');

// 30 days * 24 hours * 60 minutes * 60 seconds
var DEFAULT_SESSION_EXPIRY_SECONDS = 2592000;

function createSession (request, response, done) {
    async.waterfall([
        function (next) { next(null, request); }, // enables arguments to first callback
        _getFacebookAccessTokenFromRequest,
        _validateFacebookAccessTokenByQueryingGraphAPI,
        _loadMissileStrikeUser,
        _checkForExistingSession,
        _createOrUpdateSession,
        _formatCreateSessionResponse,
    ], routeutil.routeResponder(response, done));
}

function _getFacebookAccessTokenFromRequest (request, next) {
    var fbAccessToken = request.params.facebook_access_token;

    if (fbAccessToken === undefined) {
        return next(new restify.MissingParameterError({message: 'missing facebook_access_token parameter'}));
    }

    next (null, fbAccessToken);
}

function _validateFacebookAccessTokenByQueryingGraphAPI (fbAccessToken, next) {
    fbgraph.setAccessToken(fbAccessToken);

    fbgraph.get('/me', function (err, fbUser) {
        if (err) {
            if (err.type === 'OAuthException') {
                return next(new restify.InvalidArgumentError({message: 'invalid facebook_access_token'}));
            }
            else {
                return next(new restify.InternalError());
            }
        }

        next(null, fbAccessToken, fbUser);
    });
}

function _loadMissileStrikeUser (fbAccessToken, fbUser, next) {
    redis.client.get('facebook:' + fbUser.id, function (err, msUserId) {
        if (err) {
            return next(new restify.InternalError());
        }

        if (msUserId === null) {
            _createNewUser(fbAccessToken, fbUser, next);
        }
        else {
            _loadExistingUser(fbAccessToken, msUserId, next);
        }
    });
}

function _createNewUser (fbAccessToken, fbUser, next) {
    var msUser = {
        id: 'user:' + uuid.v4(),
        username: fbUser.name,
        created: (new Date()).toJSON(),
        facebook_access_token: fbAccessToken,
        facebook: fbUser,
    };

    var multi = redis.client.multi();

    multi.mset(
        'facebook:' + fbUser.id, msUser.id,
        msUser.id, JSON.stringify(msUser)
    );

    multi.sadd('users', msUser.id);

    multi.exec(function (err, res) {
        if (err) {
            return next(new restify.InternalError());
        }

        next(null, msUser);
    });
}

function _loadExistingUser (fbAccessToken, msUserId, next) {
    redis.client.get(msUserId, function (err, msUserSerialized) {
        if (err) {
            return next(new restify.InternalError());
        }

        if (msUserSerialized === null) {
            return next(new restify.InternalError({message: 'inconsistent user state'}));
        }

        var msUser = JSON.parse(msUserSerialized);
        msUser.facebook_access_token = fbAccessToken;

        next(null, msUser);
    });
}

function _checkForExistingSession (msUser, next) {
    if (!msUser.hasOwnProperty('session')) {
        return next(null, msUser, false);
    }

    redis.client.exists(msUser.session, function (err, exists) {
        if (err) {
            return next(new restify.InternalError());
        }

        next(null, msUser, exists);
    });
}

function _createOrUpdateSession (msUser, sessionExists, next) {
    var multi = redis.client.multi();

    if (!sessionExists) {
        if (msUser.hasOwnProperty('session')) {
            multi.del(msUser.session); // delete stale session pointer
        }

        msUser.session = 'session:' + uuid.v4();
    }

    multi.setex(msUser.session, DEFAULT_SESSION_EXPIRY_SECONDS, msUser.id);
    multi.set(msUser.id, JSON.stringify(msUser));

    multi.exec(function (err, replies) {
        if (err) {
            return next(new restify.InternalError());
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
    async.waterfall([
        function (next) { next(null, request); }, // enables arguments to first callback
        _deleteSessionFromDatabase,
    ], routeutil.routeResponder(response, done));
}

function _deleteSessionFromDatabase(request, next) {
    redis.client.del(request.headers.missileappsessionid, function (err, res) {
        if (err) {
            return next(new restify.InternalError());
        }

        next(null, 204);
    });
}

module.exports.installAuthenticatedRouteHandlers = function (server) {
    server.del('/sessions', deleteSession);
};

module.exports.installPublicRouteHandlers = function (server) {
    server.post('/sessions', createSession);
};
