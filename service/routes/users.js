var install = function (server) {
    server.get('/users/:id', showUser);
    server.put('/users/:id', updateUser);
    server.get('/users/:id/games', listGames);
    server.get('/users/:id/opponents', listOpponents);
};

var showUser = function(req, res, next) {
    res.send(200, 'user details for userid: ' + req.params.id);
    return next();
};

var updateUser = function(req, res, next) {
    res.send(200, 'updated session with id: ' + req.params.id);
    return next();
};

var listGames = function(req, res, next) {
    res.send(200, 'list of games for user with id: ' + req.params.id);
    return next();
};

var listOpponents = function(req, res, next) {
    res.send(200, 'list of opponents for user with id: ' + req.params.id);
    return next();
};

module.exports.install = install;
