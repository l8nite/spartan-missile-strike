var should = require('should');
var async = require('async');
var ServiceClient = require('./lib/service-client.js');

describe('/users', function () {
    var client;
    var path;

    before(function (done) {
        client = new ServiceClient();
        client.login('Service General Unit Tests', function (err) {
            if (err) {
                return done(err);
            }

            path = '/users/' + encodeURIComponent(client.user.id);
            done();
        });
    });

    describe('GET /users/:id', function() {
        it('should return user details', function (done) {
            client.get(path, function(err, req, res, obj) {
                should.not.exist(err);
                should.exist(obj);
                obj.should.have.property('id');
                obj.id.should.equal(client.user.id);
                // especially this:
                obj.facebook.should.not.have.property('access_token');
                res.statusCode.should.equal(200);
                done();
            });
        });
    });

    describe('PUT /users/:id', function () {
        it('should return a 304 if you try to set the same username', function (done) {
            client.put(path, { username: client.user.username }, function(err, req, res, obj) {
                res.statusCode.should.equal(304);
                done();
            });
        });
    });

    describe('PUT /users/:id', function () {
        it('should return a 409 if you use an invalid username', function (done) {
            var username = client.user.username;
            client.put(path, { username: username + '_' }, function (err, req, res, obj) {
                res.statusCode.should.equal(409);
                done();
            });
        });

        it('should return a 409 if you use an empty username', function (done) {
            async.parallel([
                function (next) {
                    client.put(path, { username: undefined }, function (err, req, res, obj) {
                        res.statusCode.should.equal(409);
                        next();
                    });
                },
                function (next) {
                    client.put(path, {}, function (err, req, res, obj) {
                        res.statusCode.should.equal(409);
                        next();
                    });
                },
            ], function () {
                done();
            });
        });
    });

    describe('PUT /users/:id', function () {
        it('should return a 200 if you set a new username', function (done) {
            var username = client.user.username;
            client.put(path, { username: username + ' A' }, function (err, req, res, obj) {
                res.statusCode.should.equal(200);

                // then restore it...
                client.put(path, { username: username }, function (err, req, res, obj) {
                    should.not.exist(err);
                    res.statusCode.should.equal(200);
                    done(err);
                });
            });
        });
    });

    describe('/users/:id/games', function() {
        // create a game before we attempt to test list games..
        before(function (done) {
            client.post('/games', { opponent: 'random', latitude: 0, longitude: 0 }, function (err, req, res, obj) {
                res.statusCode.should.equal(201);
                done();
            });
        });

        it('should return no games if modified since 5 minutes into the future...', function (done) {
            client.client.headers['If-Modified-Since'] = (new Date((new Date()).getTime() + 5*60000)).toUTCString();
            client.get(path + '/games', function (err, req, res, obj) {
                should.not.exist(err);
                res.statusCode.should.equal(304);
                done();
            });
            delete client.client.headers['If-Modified-Since'];
        });

        it('should return a list of games', function (done) {
            client.get(path + '/games', function(err, req, res, obj) {
                should.not.exist(err);
                res.statusCode.should.equal(200);
                obj.should.have.property('games');
                obj.games.length.should.be.above(0);
                done();
            });
        });
    });

    describe('/users/:id/opponents', function() {
        it('should return a 500 not implemented', function (done) {
            client.get(path + '/opponents', function(err, req, res, obj) {
                res.statusCode.should.equal(500);
                done();
            });
        });
    });

    describe('invalid id', function () {
        it('should return a 409 conflict', function (done) {
            client.get('/users/user%3Ainvalid', function (err, req, res, obj) {
                res.statusCode.should.equal(409);
                done();
            });
        });
    });

    describe('GET /users/:id with a valid but not authorized id', function () {
        it('should return a 403 forbidden', function (done) {
            client.get('/users/user%3A00000000-0000-0000-0000-000000000000', function (err, req, res, obj) {
                res.statusCode.should.equal(403);
                done();
            });
        });
    });
});
