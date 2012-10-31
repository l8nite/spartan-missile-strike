var should = require('should');
var restify = require('restify');

var client = restify.createJsonClient({
    url: 'https://localhost:8433',
    version: '*'});


describe('/cities', function() {
    it('should return a 200', function (done) {
        client.get('/cities', function(err, req, res, obj) {
            res.statusCode.should.equal(200);
            done();
        });
    });
});
