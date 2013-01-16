var install = function (server) {
    server.post('/sessions', createSession);
    server.del('/sessions/:id', deleteSession);
};

var createSession = function(req, res, next) {
    if (req.params.facebook !== undefined) {
        // match facebook access token against uid?
        res.send(201, 'created session');
    }
    else {
        res.send(400, 'missing facebook parameter');
    }
    return next();
};

var deleteSession = function(req, res, next) {
    res.send(200, 'deleted session with id: ' + req.params.id);
    return next()
};

module.exports.install = install;
