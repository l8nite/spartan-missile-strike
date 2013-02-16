var should = require('should');
var client = require('./lib/service-test.js').client;

describe('/games', function() {
    it('should return a 200', function (done) {
        client.post('/games', { facebook: "abcdefg" }, function(err, req, res, obj) {
            res.statusCode.should.equal(201);
            done();
        });
    });
});

describe('/games/:id/fire-missile', function() {
    it('should return a 200', function (done) {
        client.put('/games/fe4d37b8-ff94-452d-ae6a-e31e30bbafd9/fire-missile', {}, function(err, req, res, obj) {
            res.statusCode.should.equal(200);
            done();
        });
    });
});

describe('/games/:id/select-base', function() {
    it('should return a 200', function (done) {
        client.put('/games/fe4d37b8-ff94-452d-ae6a-e31e30bbafd9/select-base', {}, function(err, req, res, obj) {
            res.statusCode.should.equal(200);
            done();
        });
    });
});
