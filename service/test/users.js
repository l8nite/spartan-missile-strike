var should = require('should');
var serviceClient = require('./lib/service-client.js');

var authnClient, client;

before(function () {
    client = serviceClient.getClient();
    authnClient = serviceClient.getAuthenticatedClient();
});

describe('/users/:id', function() {
    it('should return a 403 when unauthenticated', function (done) {
        client.get('/users/fe4d37b8-ff94-452d-ae6a-e31e30bbafd9', function (err, req, res, obj) {
            res.statusCode.should.equal(403);
            done();
        });
    });

    it('should return a 500 not implemented', function (done) {
        authnClient.get('/users/fe4d37b8-ff94-452d-ae6a-e31e30bbafd9', function(err, req, res, obj) {
            res.statusCode.should.equal(500);
            done();
        });
    });
});

describe('/users/:id/games', function() {
    it('should return a 403 when unauthenticated', function (done) {
        client.get('/users/fe4d37b8-ff94-452d-ae6a-e31e30bbafd9/games', function (err, req, res, obj) {
            res.statusCode.should.equal(403);
            done();
        });
    });

    it('should return a 500 not implemented', function (done) {
        authnClient.get('/users/fe4d37b8-ff94-452d-ae6a-e31e30bbafd9/games', function(err, req, res, obj) {
            res.statusCode.should.equal(500);
            done();
        });
    });
});

describe('/users/:id/opponents', function() {
    it('should return a 403 when unauthenticated', function (done) {
        client.get('/users/fe4d37b8-ff94-452d-ae6a-e31e30bbafd9/opponents', function (err, req, res, obj) {
            res.statusCode.should.equal(403);
            done();
        });
    });

    it('should return a 500 not implemented', function (done) {
        authnClient.get('/users/fe4d37b8-ff94-452d-ae6a-e31e30bbafd9/opponents', function(err, req, res, obj) {
            res.statusCode.should.equal(500);
            done();
        });
    });
});
