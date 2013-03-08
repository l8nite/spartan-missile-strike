var should = require('should'),
    async = require('async'),
    ServiceClient = require('./lib/service-client.js');

describe('select-base', function () {
    var client1, client2, client3;
    var game12, game23;

    // we need 3 users in order to test select-base fully
    // - select-base when it's our turn (1vs2)
    // - select-base on a game that we don't own (2vs3)
    before(function (done) {
        async.parallel([
            function (next) {
                client1 = new ServiceClient();
                client1.login('Service General Unit Tests', function (err) {
                    next(err);
                });
            },
            function (next) {
                client2 = new ServiceClient();
                client2.login('Service Game Unit Tests', function (err) {
                    next(err);
                });
            },
            function (next) {
                client3 = new ServiceClient();
                client3.login('Service Session Unit Tests', function (err) {
                    next(err);
                });
            },
        ], function (err) {
            done(err);
        });
    });

    describe('setting up games for select-base', function () {
        it('should create a game between p1 and p2', function (done) {
            client1.post('/games', { opponent: client2.user.id, latitude: 0, longitude: 0 }, function (err, req, res, obj) {
                res.statusCode.should.equal(201);
                game12 = obj;
                done();
            });
        });

        it('should create a game between p2 and p3', function (done) {
            client2.post('/games', { opponent: client3.user.id, latitude: 0, longitude: 0 }, function (err, req, res, obj) {
                res.statusCode.should.equal(201);
                game23 = obj;
                done();
            });
        });
    });

    describe("attempting to select-base when it's our turn", function () {
        it('should succeed', function (done) {
            var path = '/games/' + encodeURIComponent(game12.id) + '/select-base';
            var base = { latitude: 0, longitude: 0 };
            client2.put(path, base, function (err, req, res, obj) {
                should.not.exist(err);
                res.statusCode.should.equal(200);
                done();
            });
        });
    });

    describe("attempting to select-base when we already have...", function () {
        it('should return a 409', function (done) {
            var path = '/games/' + encodeURIComponent(game12.id) + '/select-base';
            var base = { latitude: 0, longitude: 0 };
            client1.put(path, base, function (err, req, res, obj) {
                res.statusCode.should.equal(409);
                done();
            });
        });
    });

    describe("attempting to select-base from game that isn't ours", function () {
        it('should be not authorized', function (done) {
            var path = '/games/' + encodeURIComponent(game23.id) + '/select-base';
            var base = { latitude: 0, longitude: 0 };
            client1.put(path, base, function (err, req, res, obj) {
                res.statusCode.should.equal(403);
                done();
            });
        });
    });
});
