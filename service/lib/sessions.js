var restify = require('restify');

module.exports.requireValidSession = function (redis) {
return function (req, res, next) {
    if (!req.headers.hasOwnProperty('missileappsessionid')) {
        return next(new restify.NotAuthorizedError());
    }

    redis.exists(req.headers.missileappsessionid, function (err, sessionExists) {
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

