function createGame (req, res, next) {
    res.send(201, 'game created');
    return next();
}

function fireMissile (req, res, next) {
    res.send(200, 'missile fired for game: ' + req.params.id);
    return next();
}

function selectBase (req, res, next) {
    res.send(200, 'select base for game: ' + req.params.id);
    return next();
}

module.exports.installAuthenticatedRouteHandlers = function (server) {
    server.post('/games', createGame);
    server.put('/games/:id/fire-missile', fireMissile);
    server.put('/games/:id/select-base', selectBase);
};

module.exports.installPublicRouteHandlers = function (server) {
};
