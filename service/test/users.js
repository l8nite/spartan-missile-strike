var should = require('should'),
    async = require('async'),
    ServiceClient = require('./lib/service-client.js'),
    _ = require('underscore');

describe('/users', function () {
    var client, client2,
        path;

    before(function (done) {
        async.parallel([
            function (next) {
                client = new ServiceClient();
                client.login('Service General Unit Tests', function (err) {
                    path = '/users/' + encodeURIComponent(client.user.id);
                    next(err);
                });
            },
            function (next) {
                client2 = new ServiceClient();
                client2.login('Service Session Unit Tests', function (err) {
                    next(err);
                });
            },
        ], function (err) {
            done(err);
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

    describe("GET someone else's /users/:id", function() {
        it('should return user details', function (done) {
            client2.get(path, function(err, req, res, obj) {
                should.not.exist(err);
                should.exist(obj);
                obj.should.have.property('id');
                obj.id.should.equal(client.user.id);
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

    describe("PUT someone else's /users/:id", function () {
        it('should return a 403 not authorized', function (done) {
            client2.put(path, { username: client2.user.username }, function (err, req, res, obj) {
                res.statusCode.should.equal(403);
                err.name.should.equal('NotAuthorizedError');
                done();
            });
        });
    });

    describe('PUT /users/:id', function () {
        it('should return an InvalidArgumentError if you use an invalid username', function (done) {
            var username = client.user.username;
            client.put(path, { username: username + '_' }, function (err, req, res, obj) {
                res.statusCode.should.equal(409);
                err.name.should.equal('InvalidArgumentError');
                done();
            });
        });

        it('should return a MissingParameterError if you use an empty username', function (done) {
            async.parallel([
                function (next) {
                    client.put(path, { username: undefined }, function (err, req, res, obj) {
                        res.statusCode.should.equal(409);
                        err.name.should.equal('MissingParameterError');
                        next();
                    });
                },
                function (next) {
                    client.put(path, {}, function (err, req, res, obj) {
                        res.statusCode.should.equal(409);
                        err.name.should.equal('MissingParameterError');
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

    describe('PUT /users/:id', function () {
        it('should return a 304 if you attempt to use a name already in use', function (done) {
            client.put(path, { username: client2.user.username }, function (err, req, res, obj) {
                res.statusCode.should.equal(304);
                done(err);
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
                obj.games[0].should.have.property('updated');
                done();
            });
        });
    });

    describe('/users/:id/opponents', function() {
        it('should return a list containing facebook friends and recent opponents', function (done) {
            client.get(path + '/opponents', function(err, req, res, obj) {
                res.statusCode.should.equal(200);
                obj.should.have.property('opponents');
                done();
            });
        });
    });

    describe('invalid id', function () {
        it('should return an InvalidArgumentError conflict', function (done) {
            client.get('/users/user%3Ainvalid', function (err, req, res, obj) {
                res.statusCode.should.equal(409);
                err.name.should.equal('InvalidArgumentError');
                done();
            });
        });
    });

    describe('GET /users/:id with an id that does not exist', function () {
        it('should return a 404 not found', function (done) {
            client.get('/users/user%3A00000000-0000-0000-0000-000000000000', function (err, req, res, obj) {
                res.statusCode.should.equal(404);
                err.name.should.equal('ResourceNotFoundError');
                done();
            });
        });
    });
});
