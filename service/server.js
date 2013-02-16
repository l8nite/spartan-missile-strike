var startAPIServer = function () {
    var restify = require('restify');
    var fs = require('fs');
    var redis = require('./lib/database.js').redis;
    var routes = require('./routes.js');

    var server = restify.createServer({
        ca: fs.readFileSync('./certs/api.missileapp.com.ca-bundle'),
        certificate: fs.readFileSync('./certs/api.missileapp.com.crt'),
        key: fs.readFileSync('./certs/api.missileapp.com.key'),
        name: 'api.missileapp.com',
        version: '0.0.1',
    });

    server.use(restify.bodyParser());
    server.use(restify.queryParser());

    routes.install(server);

    server.listen(8443, function () {
        console.log('%s listening at %s', server.name, server.url);
    });
};

var startDocumentationServer = function () {
    // documentation server
    var static = require('node-static');
    var http = require('http');

    var staticServer = new(static.Server)('./www');
    var docServer = http.createServer(function (request, response) {
        request.addListener('end', function () {
            staticServer.serve(request, response);
        });
    });

    docServer.listen(8080, function () {
        console.log('documentation server listening on :8080');
    });
};

exports.start = function () {
    startAPIServer();
    startDocumentationServer();
};
