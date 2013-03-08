var restify = require('restify'),
    redis = require('../lib/database.js'),
    util = require('../lib/util.js'),
    uuid = require('node-uuid'),
    async = require('async'),
    vincenty = require('../lib/vincenty.js'),
    errors = require('../lib/errors.js'),
    _ = require('underscore');

// 14000 m/s at 45 deg will travel ~20000 km, or halfway around earth
var MAXIMUM_VELOCITY = 14000;
var GRAVITY = 9.8;

function createGame (request, response, done) {
    async.waterfall([
        function (next) { next(null, request); }, // enables arguments to first callback
        _validateCreateGameParameters,
        _determineOpponent,
        _createNewGame,
        _renderGameCreatedResponse,
    ], util.routeResponder(response, done));
}

function isValidLatitude (latitude) {
    return _.isNumber(latitude) && latitude >= -90 && latitude <= 90;
}

function isValidLongitude (longitude) {
    return _.isNumber(longitude) && longitude >= -180 && longitude <= 180;
}

function isValidAngle (angle) {
    return _.isNumber(angle) && angle >= 0 && angle <= 90;
}

function isValidHeading (heading) {
    return _.isNumber(heading) && heading >= 0 && heading < 360;
}

function isValidPower (power) {
    return _.isNumber(power) && power >= 0 && power <= 100;
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

function fireMissile (request, response, done) {
    async.waterfall([
        function (next) { next(null, request); },
        _validateFireMissileParameters,
        _loadGameAndEnsureItsOurTurn,
        _validateFireMissileConditions,
        _calculateMissileTrajectory,
        _updateGameWithShotFired,
    ], util.routeResponder(response, done));
}

function _validateFireMissileParameters (request, next) {
    var latitude = request.params.latitude,
        longitude = request.params.longitude,
        angle = request.params.angle,
        heading = request.params.heading,
        power = request.params.power;

    if (longitude === undefined) {
        return next(new restify.MissingParameterError({message: 'longitude parameter is missing'}));
    }

    if (latitude === undefined) {
        return next(new restify.MissingParameterError({message: 'latitude parameter is missing'}));
    }

    if (angle === undefined ) {
        return next(new restify.MissingParameterError({message: 'angle parameter is missing'}));
    }

    if (heading === undefined) {
        return next(new restify.MissingParameterError({message: 'heading parameter is missing'}));
    }

    if (power === undefined) {
        return next(new restify.MissingParameterError({message: 'power parameter is missing'}));
    }

    if (!isValidLatitude(latitude)) {
        return next(new restify.InvalidArgumentError({message: 'latitude must be -90 to 90'}));
    }

    if (!isValidLongitude(longitude)) {
        return next(new restify.InvalidArgumentError({message: 'longitude must be -180 to 180'}));
    }

    if (!isValidAngle(angle)) {
        return next(new restify.InvalidArgumentError({message: 'angle must be 0 to 90'}));
    }

    if (!isValidHeading(heading)) {
        return next(new restify.InvalidArgumentError({message: 'heading must be [0,360)'}));
    }

    if (!isValidPower(power)) {
        return next(new restify.InvalidArgumentError({message: 'power must be 0 to 100'}));
    }

    next(null, request);
}

function _validateFireMissileConditions (request, game, next) {
    if (!game[game.opponent].hasOwnProperty('base') || game.status !== 'active') {
        return next(new errors.InvalidGameStateError());
    }

    next(null, request, game);
}

function _calculateMissileTrajectory (request, game, next) {
    var latitude = request.params.latitude,
        longitude = request.params.longitude,
        angle = request.params.angle,
        heading = request.params.heading,
        power = request.params.power;

    var velocity = (MAXIMUM_VELOCITY * power) / 100,
        distance = velocity*velocity * Math.sin(2 * angle) / GRAVITY
        vDestination = vincenty.destVincenty(latitude, longitude, heading, distance);

    var opponent = game.current === game.creator ? game.opponent : game.creator,
        opponentBase = game[opponent].base;

    var vDistance = vincenty.distVincenty(vDestination.lat, vDestination.lon, opponentBase.latitude, opponentBase.longitude);

    // it's a "hit" if it's within 8km of the target (~5 miles)
    var hit = false;
    if (vDistance < 8000) {
        hit = true;
    }

    next(null, { destination: { latitude: vDestination.lat, longitude: vDestination.lon }, hit: hit });
}

function _updateGameWithShotFired (shot, next) {
    next(null, 200, shot);
}

function selectBase (request, response, done) {
    async.waterfall([
        function (next) { next(null, request); }, // enables arguments to first callback
        _validateSelectBaseParameters,
        _loadGameAndEnsureItsOurTurn,
        _validateSelectBaseConditions,
        _updateGameWithSelectedBase,
    ], util.routeResponder(response, done));
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

function _validateSelectBaseConditions (request, game, next) {
    if (game[request.missileStrikeUserId].hasOwnProperty('base')) {
        return next(new errors.InvalidGameStateError());
    }

    next(null, request, game);
}

function _updateGameWithSelectedBase (request, game, next) {
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

function _loadGameAndEnsureItsOurTurn (request, next) {
    redis.client.get(request.params.id, function (err, gameSerialized) {
        if (err) {
            return next(err);
        }

        if (gameSerialized === null) {
            return next(new restify.InvalidArgumentError({message: 'game is not found'}));
        }

        var game = JSON.parse(gameSerialized);
        if (game.current !== request.missileStrikeUserId) {
            return next(new restify.InvalidGameStateError());
        }

        next(null, request, game);
    });
}


module.exports.installAuthenticatedRouteHandlers = function (server) {
    server.post('/games', createGame);
    server.put('/games/:id/fire-missile', fireMissile);
    server.put('/games/:id/select-base', selectBase);
};

module.exports.installPublicRouteHandlers = function (server) {
};
