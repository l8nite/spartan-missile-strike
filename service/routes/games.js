function createGame (req, res, next) {
    res.send(500, 'not implemented');
    return next();
}

function fireMissile (req, res, next) {
    res.send(500, 'not implemented');
    // 'missile fired for game: ' + req.params.id);
    return next();
}

function selectBase (req, res, next) {
    res.send(500, 'not implemented');
    // 'select base for game: ' + req.params.id);
    return next();
}

module.exports.installAuthenticatedRouteHandlers = function (server) {
    server.post('/games', createGame);
    server.put('/games/:id/fire-missile', fireMissile);
    server.put('/games/:id/select-base', selectBase);
};

module.exports.installPublicRouteHandlers = function (server) {
};
