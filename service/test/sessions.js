var should = require('should');
var ServiceClient = require('./lib/service-client.js');

describe('creating /sessions', function() {
    var client;

    before(function (done) {
        client = new ServiceClient();
        done();
    });

    describe('invalid parameters', function () {
        it('should return a 409 when missing facebook_access_token parameter', function (done) {
            client.post('/sessions', { }, function (err, req, res, obj) {
                res.statusCode.should.equal(409);
                done();
            });
        });

        it('should return a 409 when an invalid facebook_access_token parameter is sent', function (done) {
            client.post('/sessions', { facebook_access_token: "abcdefg" }, function (err, req, res, obj) {
                res.statusCode.should.equal(409);
                done();
            });
        });
    });

    it('should create a new session', function (done) {
        var fbAccessTokenForUser = require('./conf/test-users.json');
        client.post('/sessions', { facebook_access_token: fbAccessTokenForUser['Service Session Unit Tests'] },
            function (err, req, res, obj) {
                should.not.exist(err);
                res.statusCode.should.equal(201);
                obj.should.have.property('session');
                obj.session.should.have.property('id');
                obj.should.have.property('user');
                obj.user.should.have.property('facebook_access_token');
                done();
            }
        );
    });
});

describe('deleting /sessions', function() {
    var client;

    before(function(done) {
        client = new ServiceClient();
        client.login('Service Session Unit Tests', done);
    });

    it('should delete valid sessions and then disallow further access', function(done) {
        client.del('/sessions', function(err, req, res, obj) {
            should.not.exist(err);
            res.statusCode.should.equal(204);

            client.del('/sessions', function(err, req, res, obj) {
                // 403 means we're not authorized any more, aka the session was invalidated
                res.statusCode.should.equal(403);
                done();
            });
        });
    });
});
