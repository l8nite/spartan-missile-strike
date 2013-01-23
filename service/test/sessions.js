var should = require('should');
var restify = require('restify');

var client = restify.createJsonClient({
    url: 'https://localhost:8433',
    version: '*'});


describe('/sessions', function() {
    it('should return a 201 when facebook_access_token param is sent', function (done) {
        client.post('/sessions', { facebook_access_token: "abcdefg" }, function(err, req, res, obj) {
            res.statusCode.should.equal(201);
            done();
        });
    });

    it('should not allow missing facebook_access_token parameter', function (done) {
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
