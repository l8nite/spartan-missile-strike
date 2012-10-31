var install = function (server) {
    server.get('/cities', searchCities);
};

var searchCities = function(req, res, next) {
    res.send(200, 'list of cities will go here');
    return next();
};

module.exports.install = install;
