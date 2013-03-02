var restify = require('restify');

module.exports.requireValidSession = function (redis) {
return function (req, res, next) {
    if (!req.headers.hasOwnProperty('missileappsessionid')) {
        return next(new restify.NotAuthorizedError());
    }

    redis.get(req.headers.missileappsessionid, function (err, userIdForSession) {
        if (err) {
            return next(new restify.InternalError());
        }

        if (!userIdForSession) {
            return next(new restify.NotAuthorizedError());
        }

        req.missileStrikeUserId = userIdForSession;
        req.missileStrikeSessionId = req.headers.missileappsessionid;

        return next();
    });
};
}

