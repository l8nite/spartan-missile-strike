var should = require('should');
var ServiceClient = require('./lib/service-client.js');

describe('/users', function () {
    var client;

    before(function (done) {
        client = new ServiceClient();
        client.login('Service General Unit Tests', done);
    });

    describe('/users/:id', function() {
        it('should return a 500 not implemented', function (done) {
            client.get('/users/fe4d37b8-ff94-452d-ae6a-e31e30bbafd9', function(err, req, res, obj) {
                res.statusCode.should.equal(500);
                done();
            });
        });
    });

    describe('/users/:id/games', function() {
        it('should return a 500 not implemented', function (done) {
            client.get('/users/fe4d37b8-ff94-452d-ae6a-e31e30bbafd9/games', function(err, req, res, obj) {
                res.statusCode.should.equal(500);
                done();
            });
        });
    });

    describe('/users/:id/opponents', function() {
        it('should return a 500 not implemented', function (done) {
            client.get('/users/fe4d37b8-ff94-452d-ae6a-e31e30bbafd9/opponents', function(err, req, res, obj) {
                res.statusCode.should.equal(500);
                done();
            });
        });
    });
});
