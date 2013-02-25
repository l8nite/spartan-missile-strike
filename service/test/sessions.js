var should = require('should');
var svctest = require('./lib/service-client.js');
var fbtest = require('./lib/test-user.js');
var client = svctest.client;

describe('/sessions', function() {
    this.timeout(15000);

    it('should return a 400 when an invalid facebook_access_token parameter is sent', function (done) {
        client.post('/sessions', { facebook_access_token: "abcdefg" }, function(err, req, res, obj) {
            res.statusCode.should.equal(400);
            done();
        });
    });

    describe('creating a valid session', function(done) {
        var err, req, res, obj, fbuser;

        before(function(done) {
            fbuser = fbtest.getFacebookTestData().user;
            console.log(fbuser);

            client.post('/sessions', { facebook_access_token: fbuser.access_token }, function(er, rq, rs, ob) {
                err = er;
                req = rq;
                res = rs;
                obj = ob;

                console.log(obj);

                done();
            });
        });

        it('should return a 201 when a valid facebook_access_token parameter is sent', function (done) {
            res.statusCode.should.equal(201);
            done();
        });

        it('should have valid properties in the returned object', function (done) {
            obj.should.have.property('session');
            obj.session.should.have.property('id');
            obj.should.have.property('user');
            obj.user.facebook.should.have.property('access_token');
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
    it('should return a 403 if no SMSS-Session-ID is sent', function (done) {
        client.del('/sessions/fe4d37b8-ff94-452d-ae6a-e31e30bbafd9', function(err, req, res, obj) {
            res.statusCode.should.equal(200);
            done();
        });
    });
});
