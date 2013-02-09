var restify = require('restify');
var assert = require('assert');

before(function(done) {
    require('../server').start();
    done();
});
