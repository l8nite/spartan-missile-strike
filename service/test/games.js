var should = require('should');
var ServiceClient = require('./lib/service-client.js');

describe('/games', function () {
    var client;

    before(function (done) {
        client = new ServiceClient();
        client.login('Service General Unit Tests', done);
    });

    describe('/games', function () {
        it('should return a 500 not implemented', function (done) {
            client.post('/games', {}, function (err, req, res, obj) {
                res.statusCode.should.equal(500);
                done();
            });
        });
    });

    describe('/games/:id/fire-missile', function() {
        it('should return a 500 not implemented', function (done) {
            client.put('/games/fe4d37b8-ff94-452d-ae6a-e31e30bbafd9/fire-missile', {}, function(err, req, res, obj) {
                res.statusCode.should.equal(500);
                done();
            });
        });
    });

    describe('/games/:id/select-base', function() {
        it('should return a 500 not implemented', function (done) {
            client.put('/games/fe4d37b8-ff94-452d-ae6a-e31e30bbafd9/select-base', {}, function(err, req, res, obj) {
                res.statusCode.should.equal(500);
                done();
            });
        });
    });
});
