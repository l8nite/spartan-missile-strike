var should = require('should');
var http = require('http');

describe('documentation on /', function() {
    it('should return a 200', function (done) {
        http.get('http://localhost:8080', function(res) {
            res.statusCode.should.equal(200);
            done();
        });
    });
});
