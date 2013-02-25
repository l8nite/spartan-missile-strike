var restify = require('restify');

module.exports.requireValidSession = function (redis) {
return function (req, res, next) {
    if (!req.headers.hasOwnProperty('smss-session-id')) {
        return next(new restify.NotAuthorizedError());
    }

    redis.exists('session:' + req.headers['smss-session-id'], function (err, sessionExists) {
        if (err) {
            return next(new restify.InternalError());
        }

        if (!sessionExists) {
            return next(new restify.NotAuthorizedError());
        }

        return next();
    });
};
}

