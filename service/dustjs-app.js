// Let's do this.
var express = require('express');
var app = express();
var path = require('path');


// configure application variables
app.set('env', 'development');
app.set('port', process.env.PORT || '3000');
app.set('domain', 'kong.idlemonkeys.net');


// set up the templating engine
var consolidate = require('consolidate');
require('dustjs-helpers');
app.engine('dust', consolidate.dust);
app.set('view engine', 'dust');
app.set('views', path.join(__dirname, '/views'));


// set up logging and error handling
app.configure('development', function () {
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));

    app.use(express.logger('dev'));
});

app.configure('production', function () {
    app.use(express.errorHandler());
    app.use(express.logger('tiny'));
});


// serve up static content
app.use(express.static(path.join(__dirname, 'public')));


// parse form variables and cookies (sign cookies with secret)
app.use(express.bodyParser());
app.use(express.cookieParser('c is for cookie'));


// set up our database / session store
var redis = require('./lib/database').redis;
var RedisStore = require('connect-redis')(express);


// set up sessionization
app.use(express.session({
    key: 'smss.id',
    store: new RedisStore({client: redis}),
    secret: 'thats good enough for me'
}));


// route our requests
app.use(app.router);


// set up stylus for compiling CSS templates
var stylusOptions = {
    src: path.join(__dirname, 'views'),
    dest: path.join(__dirname, 'public'),
};

app.configure('development', function () {
    stylusOptions.compress = false;
    stylusOptions.firebug = true;
    stylusOptions.linenos = true;
});

app.configure('production', function () {
    stylusOptions.compress = true;
});

app.use(require('stylus').middleware(stylusOptions));


// serve up favicon.ico
app.use(express.favicon());


// define routing
var routes = require('./routes');
app.all('*', require('express-force-domain')('http://kong.idlemonkeys.net:3000'));
app.get('/', routes.index);


// start server
var http = require('http');
http.createServer(app).listen(app.get('port'), function () {
    console.log("SMSS listening on port " + app.get('port') + " in " + app.get('env') + " mode");
});

process.on('SIGINT', function () {
    console.log("\nCaught SIGINT, shutting down...");
    redis.quit();
    console.log("Done.");
    process.exit();
});
