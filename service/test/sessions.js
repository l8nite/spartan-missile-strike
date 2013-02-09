var should = require('should');
var restify = require('restify');
var fbgraph = require('fbgraph');
var fs = require('fs');

var client = restify.createJsonClient({
    url: 'https://localhost:8433',
    version: '*'});

var fbconf = require("../lib/facebook-config.js");

before(function(done) {
    console.log("This executed A");
    done();
});

describe('/sessions', function() {
    before(function(done) {
        console.log("This executed B");
        done();
    });
    it('should return a 201 when facebook_access_token param is sent', function (done) {
        client.post('/sessions', { facebook_access_token: "abcdefg" }, function(err, req, res, obj) {
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
