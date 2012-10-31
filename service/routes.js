var cities = require('./routes/cities.js');
var games = require('./routes/games.js');
var sessions = require('./routes/sessions.js');
var users = require('./routes/users.js');

var install = function (server) {
    cities.install(server);
    games.install(server);
    sessions.install(server);
    users.install(server);
};

module.exports.install = install;
