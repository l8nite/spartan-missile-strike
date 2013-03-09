function searchCities (req, res, next) {
    res.send(500, 'not implemented');
    return next();
}

module.exports.installAuthenticatedRouteHandlers = function (server) {
    server.get('/cities', searchCities);
};

module.exports.installPublicRouteHandlers = function (server) {
};
