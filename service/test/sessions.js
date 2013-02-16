var should = require('should');
var client = require('./lib/service-test.js').client;
var fbtest = require('./lib/facebook-test.js');

describe('/sessions', function() {
    it('should return a 400 when an invalid facebook_access_token parameter is sent', function (done) {
        client.post('/sessions', { facebook_access_token: "abcdefg" }, function(err, req, res, obj) {
            res.statusCode.should.equal(400);
            done();
        });
    });

    it('should return a 201 when a valid facebook_access_token parameter is sent', function (done) {
        var user = fbtest.getFacebookTestData().user;
        client.post('/sessions', { facebook_access_token: user.access_token }, function(err, req, res, obj) {
            res.statusCode.should.equal(201);
            done();
        });
    });

    it('should return a 400 when missing facebook_access_token parameter', function (done) {
        client.post('/sessions', { }, function(err, req, res, obj) {
            res.statusCode.should.equal(400);
            done();
        });
    });
});

describe('/sessions/:id', function() {
    it('should return a 200', function (done) {
        client.del('/sessions/fe4d37b8-ff94-452d-ae6a-e31e30bbafd9', function(err, req, res, obj) {
            res.statusCode.should.equal(200);
            done();
        });
    });
});
