var restify = require('restify');
var fs = require('fs');
var redis = require('./lib/database.js').redis;
var routes = require('./routes.js');

var server = restify.createServer({
    certificate: fs.readFileSync('./certs/server.crt'),
    key: fs.readFileSync('./certs/server.key'),
    name: 'api.missileapp.com',
    version: '0.0.1',
});

server.use(restify.queryParser());

routes.install(server);

server.listen(8433, function () {
    console.log('%s listening at %s', server.name, server.url);
});

