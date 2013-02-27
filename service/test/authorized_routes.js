var should = require('should');
var ServiceClient = require('./lib/service-client.js');

function MockServer () {
    this.routes = [];

    this._register = function (method, path) {
        this.routes.push({ method: method, path: path });
    }

    // this will break if we ever add more parameters to the urls
    var fakeId = '1720b1f0-8094-11e2-9e96-0800200c9a66';
    this.get = function (path) { this._register('get', path.replace(/:id/,fakeId)); };
    this.put = function (path) { this._register('put', path.replace(/:id/,fakeId)); };
    this.del = function (path) { this._register('del', path.replace(/:id/,fakeId)); };
    this.post = function (path) { this._register('post', path.replace(/:id/,fakeId)); };
}

describe('authenticated route', function () {
    var client = new ServiceClient();
    var mockServer = new MockServer();

    require('../routes.js').installAuthenticatedRouteHandlers(mockServer);

    mockServer.routes.forEach(function (route) {
        describe(route.path, function () {
            it('should return a 403', function (done) {
                var test = function (err, req, res) {
                    res.statusCode.should.equal(403);
                    done();
                };

                // restify doesn't like it if you put/post without data
                if (route.method === 'get' || route.method === 'del') {
                    client[route.method](route.path, test);
                }
                else {
                    client[route.method](route.path, {}, test);
                }
            });
        });
    });
});
