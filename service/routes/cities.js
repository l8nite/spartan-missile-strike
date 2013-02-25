function searchCities (req, res, next) {
    res.send(200, 'list of cities will go here');
    return next();
}

module.exports.installAuthenticatedRouteHandlers = function (server) {
    server.get('/cities', searchCities);
};

module.exports.installPublicRouteHandlers = function (server) {
};
