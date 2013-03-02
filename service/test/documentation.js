var should = require('should');
var http = require('http');
var ports = require('../conf/ports.json');

describe('documentation on /', function() {
    it('should return a 200', function (done) {
        http.get({ host: 'localhost', port: ports.documentationServer, path: '/'}, function(res) {
            res.statusCode.should.equal(200);
            done();
        });
    });
});
