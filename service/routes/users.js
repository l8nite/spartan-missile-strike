var restify = require('restify'),
    redis = require('../lib/database.js'),
    util = require('../lib/util.js'),
    async = require('async'),
    fbgraph = require('fbgraph'),
    _ = require('underscore');

// 30 days ago in ms = -1 * 1000 * 60 * 60 * 24 * 30
var RECENT_GAMES_DELTA_MS = -2592000000;

function showUser (request, msUser, done) {
    done(null, 200, sanitizeUser(msUser));
}

function updateUser (request, msUser, done) {
    var username = request.params.username;

    if (username === undefined ) {
        return done(new restify.MissingParameterError());
    }

    if (username === msUser.username) {
        return done(null, 304);
    }

    if (!/^[a-zA-Z ]+$/.test(username)) {
        return done(new restify.InvalidArgumentError());
    }

    msUser.username = username;

    redis.client.set(msUser.id, JSON.stringify(msUser), function (err, result) {
        if (err) {
            return done(new restify.InternalError());
        }

        return done(null, 200);
    });
}

function listGames (request, msUser, done) {
    var rangeMin = '-inf',
        rangeMax = '+inf';

    if (request.headers.hasOwnProperty('if-modified-since')) {
        rangeMin = (new Date(request.headers['if-modified-since'])).getTime();
    }

    redis.client.zrangebyscore('games:' + msUser.id, rangeMin, rangeMax, function (err, gameIdentifiers) {
        if (err) {
            return done(new restify.InternalError());
        }

        if (gameIdentifiers === undefined || gameIdentifiers.length == 0) {
            return done(null, 304);
        }

        redis.client.mget(gameIdentifiers, function (err, gameData) {
            if (err) {
                return done(new restify.InternalError());
            }

            var games = _.map(gameData, JSON.parse);

            done(null, 200, { games: games } );
        });
    });
}

function listOpponents (request, msUser, done) {
    async.waterfall([
            function (next) { next(null, request, msUser); },
            _getFacebookFriendsWithAppInstalled,
            _getUserIdsForFacebookFriends,
            _getRecentParticipatedGames,
            _getOpponentIdsForRecentGames,
            _mergeListsAndFetchUserInformation,
            _formatListOpponentsResponse,
    ], done);
}

function _getFacebookFriendsWithAppInstalled (request, msUser, next) {
    fbgraph.setAccessToken(msUser.facebook_access_token);
    fbgraph.get('/me/friends?fields=id,name,installed', function (err, result) {
        if (err) {
            // TODO: should we force them to log out on OAuthErrors?
            return next(new restify.NotAuthorizedError());
        }

        var friends = _.where(result.data, {installed: true});

        next(null, msUser, friends);
    });

}

function _getUserIdsForFacebookFriends (msUser, facebookFriends, next) {
    var facebookIds = _.map(_.pluck(facebookFriends, 'id'), function (id) { return "facebook:" + id; });

    redis.client.mget(facebookIds, function (err, userIds) {
        if (err) {
            return next(new restify.InternalError());
        }

        next(null, msUser, _.compact(userIds));
    });
}

function _getRecentParticipatedGames (msUser, userIdsFromFacebook, next) {
    var now = new Date();
    var rangeMin = (new Date(now.getTime() + RECENT_GAMES_DELTA_MS)).getTime(),
        rangeMax = '+inf';

    redis.client.zrangebyscore('games:' + msUser.id, rangeMin, rangeMax, function (err, gameIdentifiers) {
        if (err) {
            return next(new restify.InternalError());
        }

        next(null, msUser, userIdsFromFacebook, gameIdentifiers);
    });
}

function _getOpponentIdsForRecentGames (msUser, userIdsFromFacebook, gameIdentifiers, next) {
    if (gameIdentifiers.length === 0) {
        return next(null, userIdsFromFacebook, []);
    }

    redis.client.mget(gameIdentifiers, function (err, games) {
        if (err) {
            return next(new restify.InternalError());
        }

        games = _.map(games, JSON.parse);

        var opponents = _.map(games, function (game) {
            return game.creator === msUser.id ? game.opponent : game.creator;
        });

        next(null, userIdsFromFacebook, opponents);
    });
}


function _mergeListsAndFetchUserInformation (userIdsFromFacebook, recentOpponentIds, next) {
    var merged = _.union(recentOpponentIds, userIdsFromFacebook);

    if (merged.length === 0) {
        return next(null, []);
    }

    redis.client.mget(merged, function (err, users) {
        if (err) {
            return next(new restify.InternalError());
        }

        users = _.map(users, JSON.parse);

        next(null, users);
    });
}

function _formatListOpponentsResponse (potentialOpponents, next) {
    var opponents = _.map(potentialOpponents, sanitizeUser);
    next(null, 200, { opponents: opponents });
}

function userIdRequiredHandler (handler) {
    return function (request, response, done) {
        async.waterfall([
            function (next) { next(null, request); }, // enables arguments to first callback
            _validateUserIdParameter,
            _fetchUserFromDatabase,
            handler,
        ], util.routeResponder(response, done));
    };
}

function _validateUserIdParameter (request, next) {
    if (!/^user:[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/.test(request.params.id)) {
        return next(new restify.InvalidArgumentError());
    }

    if (request.missileStrikeUserId !== request.params.id) {
        return next(new restify.NotAuthorizedError());
    }

    return next(null, request, request.params.id);
}

function _fetchUserFromDatabase (request, msUserId, next) {
    redis.client.get(msUserId, function (err, msUserSerialized) {
        if (err) {
            return next(err);
        }

        if (msUserSerialized === null) {
            return next(new restify.ResourceNotFoundError());
        }

        next(null, request, JSON.parse(msUserSerialized));
    });
}

function sanitizeUser (msUser) {
    var sanitizedUser = _.pick(msUser, 'id', 'username');
    var sanitizedFacebook = _.pick(msUser.facebook, 'id', 'name', 'link');

    sanitizedUser.facebook = sanitizedFacebook;

    return sanitizedUser;
}


module.exports.installAuthenticatedRouteHandlers = function (server) {
    server.get('/users/:id', userIdRequiredHandler(showUser));
    server.put('/users/:id', userIdRequiredHandler(updateUser));
    server.get('/users/:id/games', userIdRequiredHandler(listGames));
    server.get('/users/:id/opponents', userIdRequiredHandler(listOpponents));
};

module.exports.installPublicRouteHandlers = function (server) {
};
