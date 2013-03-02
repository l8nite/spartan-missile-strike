var restify = require('restify'),
    ports = require('../../conf/ports.json');

// if expired, generate a new one by following the guide:
// https://developers.facebook.com/docs/howtos/login/extending-tokens/
var fbAccessTokenForUser = require('../conf/test-users.json');

function ServiceClient () {
    this.client = restify.createJsonClient({
        url: 'https://localhost:' + ports.apiServer,
        version: '*'
    });
}

module.exports = ServiceClient;

ServiceClient.prototype.login = function (fbUserName, callback) {
    if (this.session !== undefined) {
        return callback('already logged in');
    }

    if (fbUserName === undefined || !fbAccessTokenForUser.hasOwnProperty(fbUserName)) {
        return callback('invalid fbUserName');
    }

    var self = this;
    this.post('/sessions', { facebook_access_token: fbAccessTokenForUser[fbUserName] },
    function (err, req, res, obj) {
        if (!err) {
            self.user = obj.user;
            self.session = obj.session;
            self.client.headers.MissileAppSessionId = self.session.id;
        }

        return callback(err);
    });
};

ServiceClient.prototype.get = function () {
    this.client.get.apply(this.client, arguments);
};

ServiceClient.prototype.del = function () {
    this.client.del.apply(this.client, arguments);
};

ServiceClient.prototype.post = function () {
    this.client.post.apply(this.client, arguments);
};

ServiceClient.prototype.put = function () {
    this.client.put.apply(this.client, arguments);
};
