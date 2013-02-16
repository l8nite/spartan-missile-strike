var restify = require('restify');
var ports = require('../../conf/ports.json');

before(function(done) {
    require('../../server').start(done);
});

var client = restify.createJsonClient({
    url: 'https://localhost:' + ports.apiServer,
    version: '*'});

module.exports.client = client;
