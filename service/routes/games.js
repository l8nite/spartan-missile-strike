var install = function (server) {
    server.post('/games', createGame);
    server.put('/games/:id/fire-missile', fireMissile);
    server.put('/games/:id/select-base', selectBase);
};

var createGame = function(req, res, next) {
    res.send(201, 'game created');
    return next();
};

var fireMissile = function(req, res, next) {
    res.send(200, 'missile fired for game: ' + req.params.id);
    return next();
};

var selectBase = function(req, res, next) {
    res.send(200, 'select base for game: ' + req.params.id);
    return next();
};

module.exports.install = install;
