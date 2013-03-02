var async = require('async');
var ports = require('./conf/ports.json');
var database = require('./lib/database.js');
var sessions = require('./lib/sessions.js');

var startAPIServer = function (done) {
    async.series([
        database.connect,
        _initializeRestifyServer
    ], done);
};

function _initializeRestifyServer (done) {
    var restify = require('restify'),
        fs = require('fs'),
        routes = require('./routes.js'),
        server;

    server = restify.createServer({
        ca: fs.readFileSync('./certs/api.missileapp.com.ca-bundle'),
        certificate: fs.readFileSync('./certs/api.missileapp.com.crt'),
        key: fs.readFileSync('./certs/api.missileapp.com.key'),
        name: 'api.missileapp.com',
        version: '0.0.1',
    });

    server.use(restify.bodyParser());
    server.use(restify.queryParser());

    routes.installPublicRouteHandlers(server); // no authentication required
    server.use(sessions.requireValidSession(database.client));
    routes.installAuthenticatedRouteHandlers(server); // authentication required

    server.listen(ports.apiServer, function () {
        console.log('%s listening at %s', server.name, server.url);
    });

    server.on('listening', done);
};

var startDocumentationServer = function (done) {
    // documentation server
    var nodeStatic = require('node-static'),
        http = require('http');

    var staticServer = new(nodeStatic.Server)('./www');
    var docServer = http.createServer(function (request, response) {
        request.addListener('end', function () {
            staticServer.serve(request, response);
        });
    });

    docServer.listen(ports.documentationServer, function () {
        console.log('documentation server listening on :' + ports.documentationServer);
    });

    docServer.on('listening', done);
};

exports.start = function (done) {
    async.parallel([
        startAPIServer,
        startDocumentationServer
    ], done);
};
