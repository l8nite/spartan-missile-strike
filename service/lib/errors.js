var restify = require('restify');
var util = require('util');

function InvalidGameStateError (message) {
    restify.RestError.call(this, {
        restCode: 'InvalidGameStateError',
        statusCode: 409,
        message: message,
        constructorOpt: InvalidGameStateError,
    });
    this.name = 'InvalidGameStateError';
}

util.inherits(InvalidGameStateError, restify.RestError);

module.exports.InvalidGameStateError = InvalidGameStateError;
