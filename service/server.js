var restify = require('restify');
var fs = require('fs');

var respond = function (req, res, next) {
    res.send('hello ' + req.params.name);
};


var server = restify.createServer({
    certificate: fs.readFileSync('./certs/server.crt'),
    key: fs.readFileSync('./certs/server.key'),
    name: 'api.missileapp.com',
    version: '0.0.1'
});


server.get('/hello/:name', respond);
server.head('/hello/:name', respond);

server.listen(8433, function () {
    console.log('%s listening at %s', server.name, server.url);
});

