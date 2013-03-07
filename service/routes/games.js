var restify = require('restify'),
    redis = require('../lib/database.js'),
    uuid = require('node-uuid'),
    async = require('async'),
    _ = require('underscore');

function createGame (request, response, done) {
    async.waterfall([
        function (next) { next(null, request); }, // enables arguments to first callback
        _validateCreateGameParameters,
        _determineOpponent,
        _createNewGame,
        _renderGameCreatedResponse,
    ],

    function (err, code, body) {
        if (err) {
            return done(err);
        }

        response.send(code, body);
        done();
    });
}

function isValidLatitude (latitude) {
    return _.isNumber(latitude) && latitude >= -90 && latitude <= 90;
}

function isValidLongitude (longitude) {
    return _.isNumber(longitude) && longitude >= -180 && longitude <= 180;
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

    if (!isValidLatitude(latitude)) {
        return next(new restify.InvalidArgumentError({message: 'latitude must be -90 to 90'}));
    }

    if (!isValidLongitude(longitude)) {
        return next(new restify.InvalidArgumentError({message: 'longitude must be -180 to 180'}));
    }

    next(null, request);
}

function _determineOpponent (request, next) {
    var opponent = request.params.opponent;

    if (opponent === request.missileStrikeUserId) {
        return next(new restify.InvalidArgumentError({message: "can't play against yourself"}));
    }

    if (opponent === 'random') {
        return _selectRandomOpponent(request, next);
    }

    redis.client.exists(opponent, function (err, opponentExists) {
        if (err) {
            return next(err);
        }

        if (!opponentExists) {
            return next(new restify.InvalidArgumentError({message: 'opponent does not exist'}));
        }

        next(null, request);
    });
}

function _selectRandomOpponent (request, next) {
    var multi = redis.client.multi();

    // hacky, but fast (O(1)!)
    // remove ourself from the list, get random, put us back
    multi.smove('users', 'tmp-users', request.missileStrikeUserId);
    multi.srandmember('users');
    multi.smove('tmp-users', 'users', request.missileStrikeUserId);

    multi.exec(function (err, replies) {
        if (err) {
            return next(err);
        }

        request.params.opponent = replies[1];

        return next(null, request);
    });
}

function _createNewGame (request, next) {
    var now = new Date();
    var game = {
        id: 'game:' + uuid.v4(),
        status: 'active',
        created: now.toJSON(),
        updated: now.toJSON(),
        creator: request.missileStrikeUserId,
        opponent: request.params.opponent,
        current: request.params.opponent,
    };

    game[request.missileStrikeUserId] = {
        base: {
            latitude: request.params.latitude,
            longitude: request.params.longitude,
        },
        shots: [ ],
    };

    game[request.params.opponent] = {};

    var multi = redis.client.multi();

    multi.set(game.id, JSON.stringify(game));
    multi.zadd('games:' + request.missileStrikeUserId, now.getTime(), game.id);
    multi.zadd('games:' + request.params.opponent, now.getTime(), game.id);

    multi.exec(function (err, replies) {
        if (err) {
            return next(err);
        }

        next(null, game);
    });
}

function _renderGameCreatedResponse (game, next) {
    next(null, 201, game);
}

function fireMissile (req, res, next) {
    return next(new restify.InternalError({message: 'not implemented'}));
}

function selectBase (request, response, done) {
    async.waterfall([
        function (next) { next(null, request); }, // enables arguments to first callback
        _validateSelectBaseParameters,
        _validateSelectBaseConditions,
        _updateGameData,
    ],

    function (err, code, body) {
        if (err) {
            return done(err);
        }

        response.send(code, body);
        done();
    });
}

function _validateSelectBaseParameters (request, next) {
    var latitude = request.params.latitude,
        longitude = request.params.longitude;

    if (longitude === undefined) {
        return next(new restify.MissingParameterError({message: 'longitude parameter is missing'}));
    }

    if (latitude === undefined) {
        return next(new restify.MissingParameterError({message: 'latitude parameter is missing'}));
    }

    if (!isValidLatitude(latitude)) {
        return next(new restify.InvalidArgumentError({message: 'latitude must be -90 to 90'}));
    }

    if (!isValidLongitude(longitude)) {
        return next(new restify.InvalidArgumentError({message: 'longitude must be -180 to 180'}));
    }

    next(null, request);
}

function _validateSelectBaseConditions (request, next) {
    redis.client.get(request.params.id, function (err, gameSerialized) {
        if (err) {
            return next(err);
        }

        if (gameSerialized === null) {
            return next(new restify.InvalidArgumentError({message: 'game is not found'}));
        }

        var game = JSON.parse(gameSerialized);
        if (game.current !== request.missileStrikeUserId) {
            return next(new restify.NotAuthorizedError());
        }

        next(null, request, game);
    });
}

function _updateGameData (request, game, next) {
    if (game[request.missileStrikeUserId].hasOwnProperty('base')) {
        return next(null, 304);
    }

    game.updated = (new Date()).toJSON();
    game[request.missileStrikeUserId].base = {
        latitude: request.params.latitude,
        longitude: request.params.longitude,
    };
    // currently opponent's turn (creator base set @ creation)
    game.current = game.creator;

    redis.client.set(game.id, JSON.stringify(game), function (err) {
        if (err) {
            return next(new restify.InternalError());
        }

        return next(null, 200);
    });
}

module.exports.installAuthenticatedRouteHandlers = function (server) {
    server.post('/games', createGame);
    server.put('/games/:id/fire-missile', fireMissile);
    server.put('/games/:id/select-base', selectBase);
};

module.exports.installPublicRouteHandlers = function (server) {
};
