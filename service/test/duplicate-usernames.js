var should = require('should'),
    async = require('async'),
    ServiceClient = require('./lib/service-client.js');

describe('create users', function () {
    var client1 = new ServiceClient();
    var client2 = new ServiceClient();

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
                err.name.should.equal('NotAuthorizedError');
                done();
            });
        });
    });
});
