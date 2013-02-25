var should = require('should');
var client = require('./lib/service-client.js').client;

describe('/cities', function() {
    it('should return a 200', function (done) {
        client.get('/cities', function(err, req, res, obj) {
            res.statusCode.should.equal(200);
            done();
        });
    });
});
