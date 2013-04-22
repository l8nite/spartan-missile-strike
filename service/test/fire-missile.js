var should = require('should'),
    async = require('async'),
    ServiceClient = require('./lib/service-client.js');

var PORTLAND = { latitude: 45.5236, longitude: -122.6750 };
var SAN_JOSE = { latitude: 37.3041, longitude: -121.8727 };
var NEW_YORK = { latitude: 40.7142, longitude:  -74.0064 };

var C1BASE = PORTLAND;
var C2BASE = SAN_JOSE;
var C3BASE = NEW_YORK;

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
            client1.post('/games', { opponent: client2.user.id, latitude: C1BASE.latitude, longitude: C1BASE.longitude }, function (err, req, res, obj) {
                res.statusCode.should.equal(201);
                game12 = obj;
                done();
            });
        });

        it('should create a game between p2 and p3', function (done) {
            client2.post('/games', { opponent: client3.user.id, latitude: C2BASE.latitude, longitude: C2BASE.longitude }, function (err, req, res, obj) {
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
            var shot = { latitude: C2BASE.latitude, longitude: C2BASE.longitude, angle: 45, heading: 175, power: 5};
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
        it('should select base for player 2 in game12', function (done) {
            var path = '/games/' + encodeURIComponent(game12.id) + '/select-base';
            var base = { latitude: C2BASE.latitude, longitude: C2BASE.longitude };
            client2.put(path, base, function (err, req, res, obj) {
                res.statusCode.should.equal(201);
                done();
            });
        });

        it('should select base for player 3 in game23', function (done) {
            var path = '/games/' + encodeURIComponent(game23.id) + '/select-base';
            var base = { latitude: C3BASE.latitude, longitude: C3BASE.longitude };
            client3.put(path, base, function (err, req, res, obj) {
                res.statusCode.should.equal(201);
                done();
            });
        });
    });

    // - fire-missile when it's not our turn (player 1 attempts to fire in game12)
    describe("attempting to fire-missile when it isn't our turn", function () {
        it('should return an InvalidGameStateError', function (done) {
            var path = '/games/' + encodeURIComponent(game12.id) + '/fire-missile';
            var shot = { latitude: C1BASE.latitude, longitude: C1BASE.longitude, angle: 45, heading: 175, power: 5 };
            client1.put(path, shot, function (err, req, res, obj) {
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
            var shot = { latitude: C1BASE.latitude, longitude: C1BASE.longitude, angle: 45, heading: 355, power: 5 };
            client1.put(path, shot, function (err, req, res, obj) {
                should.exist(err);
                err.name.should.equal('InvalidGameStateError');
                res.statusCode.should.equal(409);
                done();
            });
        });
    });

    // - fire-missile when it's our turn (player 2 in game12)
    describe("attempting to fire-missile and missing", function () {
        it('should return a 200 with hit: false', function (done) {
            var path = '/games/' + encodeURIComponent(game12.id) + '/fire-missile';
            var shot = { latitude: C2BASE.latitude, longitude: C2BASE.longitude, angle: 45, heading: 355, power: 5 };
            client2.put(path, shot, function (err, req, res, obj) {
                res.statusCode.should.equal(200);
                should.not.exist(err);
                obj.should.have.property('status');
                obj.should.have.property(client2.user.id);
                obj[client2.user.id].should.have.property('shots');
                var shots = obj[client2.user.id].shots;
                shots.length.should.be.above(0);
                shots[shots.length - 1].should.have.property('hit');
                shots[shots.length - 1].hit.should.equal(false);
                done();
            });
        });
    });

    // - fire-missile
    describe("attempting to fire-missile and hitting", function () {
        it('should return a 200 with hit: true', function (done) {
            var path = '/games/' + encodeURIComponent(game12.id) + '/fire-missile';
            var shot = { latitude: C1BASE.latitude, longitude: C1BASE.longitude, angle: 45, heading: 175.52, power: 22.6};
            client1.put(path, shot, function (err, req, res, obj) {
                res.statusCode.should.equal(200);
                should.not.exist(err);
                var shots = obj[client1.user.id].shots;
                shots.length.should.be.above(0);
                shots[shots.length - 1].should.have.property('hit');
                shots[shots.length - 1].hit.should.equal(true);
                done();
            });
        });
    });

    // - fire-missile after a game is over
    describe("attemping to fire-missile after game is over", function () {
        it('should return a 409', function (done) {
            var path = '/games/' + encodeURIComponent(game12.id) + '/fire-missile';
            var shot = { latitude: C1BASE.latitude, longitude: C1BASE.longitude, angle: 45, heading: 355, power: 5 };
            client1.put(path, shot, function (err, req, res, obj) {
                err.name.should.equal('InvalidGameStateError');
                res.statusCode.should.equal(409);
                done();
            });
        });
    });
});
