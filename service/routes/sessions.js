var install = function (server) {
    server.post('/sessions', createSession);
    server.del('/sessions/:id', deleteSession);
};

var createSession = function(req, res, next) {
    res.send(201, 'created session');
    return next();
};

var deleteSession = function(req, res, next) {
    res.send(200, 'deleted session with id: ' + req.params.id);
    return next()
};

module.exports.install = install;
