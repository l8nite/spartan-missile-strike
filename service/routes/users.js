var restify = require('restify');
var redis = require('../lib/database.js');
var async = require('async');
var _ = require('underscore');

function showUser (request, msUser, done) {
    var sanitizedUser = _.pick(msUser, 'id', 'username');
    var sanitizedFacebook = _.pick(msUser.facebook, 'id', 'name', 'link');

    sanitizedUser.facebook = sanitizedFacebook;

    done(null, 200, sanitizedUser);
}

function updateUser (request, msUser, done) {
    var username = request.params.username;

    if (username === undefined ) {
        return done(new restify.MissingParameterError());
    }

    if (username === msUser.username) {
        return done(undefined, 304);
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
    return done(new restify.InternalError({message: 'not implemented'}));
}

function listOpponents (request, msUser, done) {
    return done(new restify.InternalError({message: 'not implemented'}));
}


function userIdRequiredHandler (handler) {
    return function (request, response, done) {
        async.waterfall([
            function (next) { next(null, request); }, // enables arguments to first callback
            _validateUserIdParameter,
            _fetchUserFromDatabase,
            handler,
        ],

        function (err, code, body) {
            if (err) {
                return done(err);
            }

            response.send(code, body);
            done();
        });
    };
}

function _validateUserIdParameter (request, next) {
    if (!/^user:[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/.test(request.params.id)) {
        return next(new restify.InvalidArgumentError());
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


module.exports.installAuthenticatedRouteHandlers = function (server) {
    server.get('/users/:id', userIdRequiredHandler(showUser));
    server.put('/users/:id', userIdRequiredHandler(updateUser));
    server.get('/users/:id/games', userIdRequiredHandler(listGames));
    server.get('/users/:id/opponents', userIdRequiredHandler(listOpponents));
};

module.exports.installPublicRouteHandlers = function (server) {
};
