var should = require('should'),
    async = require('async'),
    ServiceClient = require('./lib/service-client.js');

var SAN_JOSE = { latitude: 37.3041, longitude: -121.8727 };
var PORTLAND = { latitude: 45.5236, longitude: -122.6750 };
var NEW_YORK = { latitude: 40.7142, longitude:  -74.0064 };

describe('fire-missile', function () {
    var client1, client2, client3;
    var game12, game23;

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

    // create 2 games (1 vs 2, and 2 vs 3)
    describe('setting up games', function () {
        it('should create a game between p1 and p2', function (done) {
            client1.post('/games', { opponent: client2.user.id, latitude: SAN_JOSE.latitude, longitude: SAN_JOSE.longitude }, function (err, req, res, obj) {
                res.statusCode.should.equal(201);
                game12 = obj;
                done();
            });
        });

        it('should create a game between p2 and p3', function (done) {
            client2.post('/games', { opponent: client3.user.id, latitude: PORTLAND.latitude, longitude: PORTLAND.longitude }, function (err, req, res, obj) {
                res.statusCode.should.equal(201);
                game23 = obj;
                done();
            });
        });
    });

    // - fire-missile when we haven't selected a base yet (game12, player 2 hasn't chosen base)
    describe("attempting to fire-missile before selecting a base", function () {
        it('should return an InvalidGameStateError', function (done) {
            var path = '/games/' + encodeURIComponent(game12.id) + '/fire-missile';
            var shot = { latitude: PORTLAND.latitude, longitude: PORTLAND.longitude, angle: 45, heading: 175, power: 5};
            client2.put(path, shot, function (err, req, res, obj) {
                should.exist(err);
                err.name.should.equal('InvalidGameStateError');
                res.statusCode.should.equal(409);
                done();
            });
        });
    });

    // finish game set up (select bases)
    describe('setting up bases', function () {
        it('should select portland for player 2 in game12', function (done) {
            var path = '/games/' + encodeURIComponent(game12.id) + '/select-base';
            var base = { latitude: PORTLAND.latitude, longitude: PORTLAND.longitude };
            client2.put(path, base, function (err, req, res, obj) {
                res.statusCode.should.equal(200);
                done();
            });
        });

        it('should select new york for player 3 in game23', function (done) {
            var path = '/games/' + encodeURIComponent(game23.id) + '/select-base';
            var base = { latitude: NEW_YORK.latitude, longitude: NEW_YORK.longitude };
            client3.put(path, base, function (err, req, res, obj) {
                res.statusCode.should.equal(200);
                done();
            });
        });
    });

    // - fire-missile when it's not our turn (player 2 attempts to fire in game12)
    describe("attempting to fire-missile when it isn't our turn", function () {
        it('should return an InvalidGameStateError', function (done) {
            var path = '/games/' + encodeURIComponent(game12.id) + '/fire-missile';
            var shot = { latitude: PORTLAND.latitude, longitude: PORTLAND.longitude, angle: 45, heading: 175, power: 5 };
            client2.put(path, shot, function (err, req, res, obj) {
                should.exist(err);
                err.name.should.equal('InvalidGameStateError');
                res.statusCode.should.equal(409);
                done();
            });
        });
    });

    // - fire-missile on a game that we don't own (player 1 attempts to fire in game23)
    describe("attempting to fire-missile on game that isn't ours", function () {
        it('should return an InvalidGameStateError', function (done) {
            var path = '/games/' + encodeURIComponent(game23.id) + '/fire-missile';
            var shot = { latitude: SAN_JOSE.latitude, longitude: SAN_JOSE.longitude, angle: 45, heading: 355, power: 5 };
            client1.put(path, shot, function (err, req, res, obj) {
                should.exist(err);
                err.name.should.equal('InvalidGameStateError');
                res.statusCode.should.equal(409);
                done();
            });
        });
    });

    // - fire-missile when it's our turn (player 1 in game12)
    describe("attempting to fire-missile and missing", function () {
        it('should return a 200 with hit: false', function (done) {
            var path = '/games/' + encodeURIComponent(game12.id) + '/fire-missile';
            var shot = { latitude: SAN_JOSE.latitude, longitude: SAN_JOSE.longitude, angle: 45, heading: 355, power: 5 };
            client1.put(path, shot, function (err, req, res, obj) {
                res.statusCode.should.equal(200);
                should.not.exist(err);
                obj.should.have.property('destination');
                obj.should.have.property('hit');
                obj.hit.should.equal(false);
                done();
            });
        });
    });

    // - fire-missile
    describe("attempting to fire-missile and hitting", function () {
        it('should return a 200 with hit: true', function (done) {
            var path = '/games/' + encodeURIComponent(game12.id) + '/fire-missile';
            var shot = { latitude: PORTLAND.latitude, longitude: PORTLAND.longitude, angle: 45, heading: 175, power: 5};
            client2.put(path, shot, function (err, req, res, obj) {
                res.statusCode.should.equal(200);
                should.not.exist(err);
                obj.should.have.property('destination');
                obj.should.have.property('hit');
                obj.hit.should.equal(true);
                done();
            });
        });
    });

    // - fire-missile after a game is over
    describe("attemping to fire-missile after game is over", function () {
        it('should return a 409', function (done) {
            var path = '/games/' + encodeURIComponent(game12.id) + '/fire-missile';
            var shot = { latitude: SAN_JOSE.latitude, longitude: SAN_JOSE.longitude, angle: 45, heading: 355, power: 5 };
            client1.put(path, shot, function (err, req, res, obj) {
                res.statusCode.should.equal(409);
                done();
            });
        });
    });
});