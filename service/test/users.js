var should = require('should');
var ServiceClient = require('./lib/service-client.js');

describe('/users', function () {
    var client;

    before(function (done) {
        client = new ServiceClient();
        client.login('Service General Unit Tests', done);
    });

    describe('GET /users/:id', function() {
        it('should return user details', function (done) {
            var path = '/users/' + encodeURIComponent(client.user.id);
            client.get(path, function(err, req, res, obj) {
                should.not.exist(err);
                should.exist(obj);
                obj.should.have.property('id');
                obj.id.should.equal(client.user.id);
                obj.facebook.should.not.have.property('access_token');
                res.statusCode.should.equal(200);
                done();
            });
        });
    });

    describe('PUT /users/:id', function () {
        it('should return a 500 not implemented', function (done) {
            client.put('/users/user%3A00000000-0000-0000-0000-000000000000', {}, function(err, req, res, obj) {
                res.statusCode.should.equal(500);
                done();
            });
        });
    });

    describe('/users/:id/games', function() {
        it('should return a 500 not implemented', function (done) {
            client.get('/users/user%3A00000000-0000-0000-0000-000000000000/games', function(err, req, res, obj) {
                res.statusCode.should.equal(500);
                done();
            });
        });
    });

    describe('/users/:id/opponents', function() {
        it('should return a 500 not implemented', function (done) {
            client.get('/users/user%3A00000000-0000-0000-0000-000000000000/opponents', function(err, req, res, obj) {
                res.statusCode.should.equal(500);
                done();
            });
        });
    });

    describe('invalid id', function () {
        it('should return a 400 bad request', function (done) {
            client.get('/users/user%3Ainvalid', function (err, req, res, obj) {
                res.statusCode.should.equal(400);
                done();
            });
        });
    });

    describe('GET /users/:id with a valid but nonexistent id', function () {
        it('should return a 404 not found', function (done) {
            client.get('/users/user%3A00000000-0000-0000-0000-000000000000', function (err, req, res, obj) {
                res.statusCode.should.equal(404);
                done();
            });
        });
    });
});
