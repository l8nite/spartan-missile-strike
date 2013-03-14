var should = require('should');
var ServiceClient = require('./lib/service-client.js');

describe('cross origin request header test', function () {
    var client;

    before(function (done) {
        client = new ServiceClient();
        client.login('Service General Unit Tests', done);
    });

    describe('against /', function () {
        it('should have the "Access-Control-Allow-Origin" header', function (done) {
            client.get('/users/' + encodeURIComponent(client.user.id), function (err, req, res) {
                res.headers.should.have.property('access-control-allow-origin');
                res.headers['access-control-allow-origin'].should.equal('*');
                done();
            });
        });
    });
});

