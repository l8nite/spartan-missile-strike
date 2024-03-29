var async = require('async');
var bunyan = require('bunyan');
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
        log,
        server;

    log = bunyan.createLogger({
        name: 'api.missileapp.com',
        streams: [
            {
                stream: process.stdout,
                level: 'debug',
            },
            {
                path: 'api.missileapp.com.log',
                level: 'trace',
            }
        ],
        serializers: {
            req: bunyan.stdSerializers.req,
            res: bunyan.stdSerializers.res,
        },
    });

    server = restify.createServer({
        ca: fs.readFileSync('./certs/api.missileapp.com.ca-bundle'),
        certificate: fs.readFileSync('./certs/api.missileapp.com.crt'),
        key: fs.readFileSync('./certs/api.missileapp.com.key'),
        name: 'api.missileapp.com',
        version: '0.0.1',
        log: log,
    });

    server.use(restify.requestLogger());

    server.on('MethodNotAllowed', function (req, res) {
        if (req.method.toLowerCase() === 'options') {
            var allowHeaders = ['Accept', 'Accept-Version', 'Content-Type', 'If-Modified-Since', 'Request-Id', 'Origin', 'X-API-Version', 'X-Request-Id', 'MissileAppSessionId'];

            if (res.methods.indexOf('OPTIONS') === -1) {
                res.methods.push('OPTIONS');
            }

            if (res.methods.indexOf('PUT') === -1) {
                res.methods.push('PUT');
            }

            // TODO we should check that the access-control-request-headers match our allowHeaders
            res.header('Access-Control-Allow-Credentials', true);
            res.header('Access-Control-Allow-Headers', allowHeaders.join(', '));
            res.header('Access-Control-Allow-Methods', res.methods.join(', '));
            res.header('Access-Control-Allow-Origin', req.headers.origin || '*');

            return res.send(204);
        }
        else {
            return res.send(new restify.MethodNotAllowedError());
        }
    });

    server.use(restify.CORS());

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
        staticServer.serve(request, response, function (err, res) {
            if (err) {
                console.error("> Error serving " + request.url + " - " + err.message);
                response.writeHead(err.status, err.headers);
                response.end();
            }
            else {
                console.log("> " + request.url + " - " + res.message);
            }
        });
    });

    docServer.listen(ports.documentationServer);

    docServer.on('listening', function() {
        console.log('> documentation server listening on :' + ports.documentationServer);
        done();
    });
};

exports.start = function (done) {
    async.parallel([
        startAPIServer,
        startDocumentationServer
    ], done);
};
