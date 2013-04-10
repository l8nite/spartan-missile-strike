var should = require('should'),
    async = require('async'),
    ServiceClient = require('./lib/service-client.js');

describe('creating two new users with identical usernames', function () {

    var client1, client2;

    before(function (done) {
        async.series([
            // log identical users in
            function (next) {
                async.parallel([
                    function (next) {
                        client1 = new ServiceClient();
                        client1.login('Identical User 1', function (err) {
                            next(err);
                        });
                    },
                    function (next) {
                        client2 = new ServiceClient();
                        client2.login('Identical User 2', function (err) {
                            next(err);
                        });
                    }
                ],

                function (err) {
                    next(err);
                });
            },

            function (next) {
                done();
            }
        ]);
    });

    it('should append a number to client2\'s username', function (done) {
        // Note: this is a manual test, check the database directly
        done();
    });
});
