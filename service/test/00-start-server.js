restify = require('restify');
assert = require('assert');

before(function(done) {
    require('../server').start();
    done();
});
