var should = require('should');
var client = require('./lib/service-test.js').client;

describe('/users/:id', function() {
    it('should return a 200', function (done) {
        client.get('/users/fe4d37b8-ff94-452d-ae6a-e31e30bbafd9', function(err, req, res, obj) {
            res.statusCode.should.equal(200);
            done();
        });
    });
});

describe('/users/:id/games', function() {
    it('should return a 200', function (done) {
        client.get('/users/fe4d37b8-ff94-452d-ae6a-e31e30bbafd9/games', function(err, req, res, obj) {
            res.statusCode.should.equal(200);
            done();
        });
    });
});

describe('/users/:id/opponents', function() {
    it('should return a 200', function (done) {
        client.get('/users/fe4d37b8-ff94-452d-ae6a-e31e30bbafd9/opponents', function(err, req, res, obj) {
            res.statusCode.should.equal(200);
            done();
        });
    });
});
