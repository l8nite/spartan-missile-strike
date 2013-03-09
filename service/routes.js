var games = require('./routes/games.js');
var sessions = require('./routes/sessions.js');
var users = require('./routes/users.js');

var installPublicRouteHandlers = function (server) {
    games.installPublicRouteHandlers(server);
    sessions.installPublicRouteHandlers(server);
    users.installPublicRouteHandlers(server);
};

var installAuthenticatedRouteHandlers = function (server) {
    games.installAuthenticatedRouteHandlers(server);
    sessions.installAuthenticatedRouteHandlers(server);
    users.installAuthenticatedRouteHandlers(server);
};

module.exports.installPublicRouteHandlers = installPublicRouteHandlers;
module.exports.installAuthenticatedRouteHandlers = installAuthenticatedRouteHandlers;
