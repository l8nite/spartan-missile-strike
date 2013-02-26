var should = require('should');
var serviceClient = require('./lib/service-client.js');

var authnClient;

before(function () {
    authnClient = serviceClient.getAuthenticatedClient();
});

describe('/cities', function() {
    it('should return a 403 when unauthenticated', function (done) {
        serviceClient.getClient().get('/cities', function (err, req, res) {
            res.statusCode.should.equal(403);
            done();
        });
    });

    it('should return a 500 not implemented', function (done) {
        authnClient.get('/cities', function(err, req, res, obj) {
            res.statusCode.should.equal(500);
            done();
        });
    });
});
