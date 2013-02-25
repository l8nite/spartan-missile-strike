function showUser (req, res, next) {
    res.send(200, 'user details for userid: ' + req.params.id);
    return next();
}

function updateUser (req, res, next) {
    res.send(200, 'updated session with id: ' + req.params.id);
    return next();
}

function listGames (req, res, next) {
    res.send(200, 'list of games for user with id: ' + req.params.id);
    return next();
}

function listOpponents (req, res, next) {
    res.send(200, 'list of opponents for user with id: ' + req.params.id);
    return next();
}

module.exports.installAuthenticatedRouteHandlers = function (server) {
    server.get('/users/:id', showUser);
    server.put('/users/:id', updateUser);
    server.get('/users/:id/games', listGames);
    server.get('/users/:id/opponents', listOpponents);
};

module.exports.installPublicRouteHandlers = function (server) {
};
