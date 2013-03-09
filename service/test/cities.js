var should = require('should');
var ServiceClient = require('./lib/service-client.js');

describe('/cities', function() {
    var client;

    before(function (done) {
        client = new ServiceClient();
        client.login('Service General Unit Tests', done);
    });

    it('should return a 500 not implemented', function (done) {
        client.get('/cities', function(err, req, res, obj) {
            res.statusCode.should.equal(500);
            done();
        });
    });
});
