var should = require('should');
var restify = require('restify');

var client = restify.createJsonClient({
    url: 'https://localhost:8433',
    version: '*'});


describe('/sessions', function() {
    it('should return a 200', function (done) {
        client.post('/sessions', { facebook: "abcdefg" }, function(err, req, res, obj) {
            res.statusCode.should.equal(201);
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
