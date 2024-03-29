var should = require('should');
var ServiceClient = require('./lib/service-client.js');

describe('/games', function () {
    var client;

    before(function (done) {
        client = new ServiceClient();
        client.login('Service General Unit Tests', done);
    });

    describe('parameter validation', function () {
        var missingParameters = [
            { opponent: undefined, latitude: 0, longitude: 0 },
            { opponent: "random", latitude: undefined, longitude: 0 },
            { opponent: "random", latitude: 0, longitude: undefined },
        ];

        var invalidParameters = [
            { opponent: "invalid", latitude: 0, longitude: 0 },
            { opponent: "random", latitude: -91, longitude: 0 },
            { opponent: "random", latitude: 0, longitude: -181 },
        ];

        missingParameters.forEach(function (body) {
            it('should return MissingParameterError', function (done) {
                client.post('/games', body, function (err, req, res, obj) {
                    err.name.should.equal('MissingParameterError');
                    res.statusCode.should.equal(409);
                    done();
                });
            });
        });

        invalidParameters.forEach(function (body) {
            it('should return InvalidArgumentError', function (done) {
                client.post('/games', body, function (err, req, res, obj) {
                    err.name.should.equal('InvalidArgumentError');
                    res.statusCode.should.equal(409);
                    done();
                });
            });
        });
    });

    describe('creating new game', function () {
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

        it('should create a new game against a random opponent', function (done) {
            client.post('/games', { opponent: 'random', latitude: 0, longitude: 0 }, function (err, req, res, obj) {
                res.statusCode.should.equal(201);
                done();
            });
        });

        it('should not allow a new game against yourself', function (done) {
            client.post('/games', { opponent: client.user.id, latitude: 0, longitude: 0 }, function (err, req, res, obj) {
                err.name.should.equal('InvalidArgumentError');
                res.statusCode.should.equal(409);
                done();
            });
        });
    });
});
