var ServiceClient = require('./lib/service-client.js');

// start the service if it isn't running before we run other tests
before(function (done) {
    (new ServiceClient()).post('/', function (err) { // TODO: is there a better way?
        if (err && err.code === 'ECONNREFUSED') {
            console.log('Server is not running, starting...');
            require('../server.js').start(done);
        }
        else {
            done();
        }
    });
});
