var should = require('should');
var ServiceClient = require('./lib/service-client.js');

describe('/games', function () {
    var client;

    before(function (done) {
        client = new ServiceClient();
        client.login('Service General Unit Tests', done);
    });

    describe('/games', function () {
        var parameters = [
            // missing parameters
            { opponent: undefined, latitude: 0, longitude: 0 },
            { opponent: "random", latitude: undefined, longitude: 0 },
            { opponent: "random", latitude: 0, longitude: undefined },
            // invalid parameters
            { opponent: "invalid", latitude: 0, longitude: 0 },
            { opponent: "random", latitude: -91, longitude: 0 },
            { opponent: "random", latitude: 0, longitude: -181 },
        ];

        parameters.forEach(function (body) {
            it('should return a 409 conflict', function (done) {
                client.post('/games', body, function (err, req, res, obj) {
                    res.statusCode.should.equal(409);
                    done();
                });
            });
        });
    });

    describe('/games', function () {
        var otherClient = new ServiceClient();

        before(function (done) {
            otherClient.login('Service Game Unit Tests', done);
        });

        it('should create a new game against the Service Session Unit Tests user', function (done) {
            client.post('/games', { opponent: otherClient.user.id, latitude: 0, longitude: 0 }, function (err, req, res, obj) {
                res.statusCode.should.equal(201);

                var properties = ['id', 'status', 'created', 'creator', 'opponent', 'current'];

                properties.forEach(function (p) {
                    obj.should.have.property(p);
                });

                obj.should.have.property(client.user.id);
                obj.should.have.property(otherClient.user.id);

                obj.current.should.equal(otherClient.user.id);
                obj.opponent.should.equal(otherClient.user.id);
                obj.creator.should.equal(client.user.id);

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
