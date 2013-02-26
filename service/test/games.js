var should = require('should');
var serviceClient = require('./lib/service-client.js');

var authnClient, client;

before(function () {
    client = serviceClient.getClient();
    authnClient = serviceClient.getAuthenticatedClient();
});

describe('/games', function() {
    it('should return a 403 when unauthenticated', function (done) {
        client.post('/games', {}, function (err, req, res) {
            res.statusCode.should.equal(403);
            done();
        });
    });

    it('should return a 500 not implemented', function (done) {
        authnClient.post('/games', { facebook: "abcdefg" }, function(err, req, res, obj) {
            res.statusCode.should.equal(500);
            done();
        });
    });
});

describe('/games/:id/fire-missile', function() {
    it('should return a 403 when unauthenticated', function (done) {
        client.put('/games/fe4d37b8-ff94-452d-ae6a-e31e30bbafd9/fire-missile', {}, function (err, req, res) {
            res.statusCode.should.equal(403);
            done();
        });
    });

    it('should return a 500 not implemented', function (done) {
        authnClient.put('/games/fe4d37b8-ff94-452d-ae6a-e31e30bbafd9/fire-missile', {}, function(err, req, res, obj) {
            res.statusCode.should.equal(500);
            done();
        });
    });
});

describe('/games/:id/select-base', function() {
    it('should return a 403 when unauthenticated', function (done) {
        client.put('/games/fe4d37b8-ff94-452d-ae6a-e31e30bbafd9/select-base', {}, function (err, req, res) {
            res.statusCode.should.equal(403);
            done();
        });
    });

    it('should return a 500 not implemented', function (done) {
        authnClient.put('/games/fe4d37b8-ff94-452d-ae6a-e31e30bbafd9/select-base', {}, function(err, req, res, obj) {
            res.statusCode.should.equal(500);
            done();
        });
    });
});
