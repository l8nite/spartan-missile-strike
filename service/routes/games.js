var restify = require('restify'),
    redis = require('../lib/database.js'),
    async = require('async');

function createGame (request, response, done) {
    async.waterfall([
        function (next) { next(null, request); }, // enables arguments to first callback
        _validateCreateGameParameters,
        _determineOpponent,
    ],

    function (err, code, body) {
        if (err) {
            return done(err);
        }

        response.send(code, body);
        done();
    });
}

function _validateCreateGameParameters (request, next) {
    var opponent = request.params.opponent,
        latitude = request.params.latitude,
        longitude = request.params.longitude;

    if (opponent === undefined) {
        return next(new restify.MissingParameterError({message: 'opponent parameter is missing'}));
    }

    if (longitude === undefined) {
        return next(new restify.MissingParameterError({message: 'longitude parameter is missing'}));
    }

    if (latitude === undefined) {
        return next(new restify.MissingParameterError({message: 'latitude parameter is missing'}));
    }

    if (!/^(random|user:[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12})$/.test(opponent)) {
        return next(new restify.InvalidArgumentError({message: 'opponent must be a valid userid or "random"'}));
    }

    function isNumber(n) {
          return (typeof n == 'string' || typeof n == 'number') && !isNaN(n - 0) && n !== '';
    }

    if (!isNumber(latitude) || latitude < -90 || latitude > 90) {
        return next(new restify.InvalidArgumentError({message: 'latitude must be -90 to 90'}));
    }

    if (!isNumber(longitude) || longitude < -180 || longitude > 180) {
        return next(new restify.InvalidArgumentError({message: 'longitude must be -180 to 180'}));
    }

    next(null, request);
}

function _determineOpponent (request, next) {
    return next(new restify.InternalError({message: 'not implemented'}));
}

function fireMissile (req, res, next) {
    return next(new restify.InternalError({message: 'not implemented'}));
}

function selectBase (req, res, next) {
    return next(new restify.InternalError({message: 'not implemented'}));
}

module.exports.installAuthenticatedRouteHandlers = function (server) {
    server.post('/games', createGame);
    server.put('/games/:id/fire-missile', fireMissile);
    server.put('/games/:id/select-base', selectBase);
};

module.exports.installPublicRouteHandlers = function (server) {
};
