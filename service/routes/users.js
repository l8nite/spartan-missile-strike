var restify = require('restify');
var redis = require('../lib/database.js');
var async = require('async');
var _ = require('underscore');

function showUser (msUserId, done) {
    async.waterfall([
        function (next) { next(null, msUserId); },
        _fetchUserFromDatabase,
        _renderUserDetails
    ], done);
}

function _renderUserDetails (msUser, next) {
    var sanitizedUser = _.pick(msUser, 'id', 'username');
    var sanitizedFacebook = _.pick(msUser.facebook, 'id', 'name', 'link');

    sanitizedUser.facebook = sanitizedFacebook;

    next(null, 200, sanitizedUser);
}

function _fetchUserFromDatabase (msUserId, next) {
    redis.client.get(msUserId, function (err, msUserSerialized) {
        if (err) {
            return next(err, 500);
        }

        if (msUserSerialized === null) {
            return next(new restify.ResourceNotFoundError(), 404);
        }

        next(null, JSON.parse(msUserSerialized));
    });
}

function updateUser (msUserId, done) {
    return done('not implemented', 500);
}

function listGames (msUserId, done) {
    return done('not implemented', 500);
}

function listOpponents (msUserId, done) {
    return done('not implemented', 500);
}


function userIdRequiredHandler (handler) {
    return function (request, response, done) {
        async.waterfall([
            function (next) { next(null, request); }, // enables arguments to first callback
            _validateUserIdParameter,
            handler,
        ],

        function (err, code, body) {
            if (code) {
                response.send(code, body);
            }
            else {
                response.send(500, err);
            }

            done();
        });
    };
}

function _validateUserIdParameter (request, next) {
    if (!/user:[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}/.test(request.params.id)) {
        return next(new restify.InvalidArgumentError(), 400);
    }

    return next(null, request.params.id);
}

module.exports.installAuthenticatedRouteHandlers = function (server) {
    server.get('/users/:id', userIdRequiredHandler(showUser));
    server.put('/users/:id', userIdRequiredHandler(updateUser));
    server.get('/users/:id/games', userIdRequiredHandler(listGames));
    server.get('/users/:id/opponents', userIdRequiredHandler(listOpponents));
};

module.exports.installPublicRouteHandlers = function (server) {
};
