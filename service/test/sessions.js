var should = require('should');
var serviceClient = require('./lib/service-client.js');

var client;
var authnClient;

before(function() {
    client = serviceClient.getClient();
    authnClient = serviceClient.getAuthenticatedClient();
});

describe('/sessions', function() {
    it('should return a 400 when an invalid facebook_access_token parameter is sent', function (done) {
        client.post('/sessions', { facebook_access_token: "abcdefg" }, function(err, req, res, obj) {
            res.statusCode.should.equal(400);
            done();
        });
    });

    describe('creating a valid session', function(done) {
        var response, data;
        before(function(done) {
            client.post('/sessions', { facebook_access_token: serviceClient.fbTestUserAccessToken }, function(err, req, res, obj) {
                response = res;
                data = obj;
                done();
            });
        });

        it('should return a 201 when a valid facebook_access_token parameter is sent', function (done) {
            response.statusCode.should.equal(201);
            done();
        });

        it('should have valid properties in the returned object', function (done) {
            data.should.have.property('session');
            data.session.should.have.property('id');
            data.should.have.property('user');
            data.user.facebook.should.have.property('access_token');
            done();
        });
    });

    it('should return a 400 when missing facebook_access_token parameter', function (done) {
        client.post('/sessions', { }, function(err, req, res, obj) {
            res.statusCode.should.equal(400);
            done();
        });
    });
});

describe('/sessions/:id', function() {
    it('should return a 403 for unauthenticated clients', function (done) {
        client.del('/sessions/fe4d37b8-ff94-452d-ae6a-e31e30bbafd9', function(err, req, res, obj) {
            res.statusCode.should.equal(403);
            done();
        });
    });

    it('should return a 500 not implemented', function (done) {
        authnClient.del('/sessions/fe4d37b8-ff94-452d-ae6a-e31e30bbafd9', function(err, req, res, obj) {
            res.statusCode.should.equal(500);
            done();
        });
    });
});
