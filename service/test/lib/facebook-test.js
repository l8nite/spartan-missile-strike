var should = require('should');
var async = require('async');
var fs = require('fs');
var path = require('path');
var fb = require('./facebook.js');

var facebookTestDataPath = path.join(__dirname, './facebook-test-data.json');

var facebookTestData;

before(function(done) {
    if (checkForCachedFacebookTestData()) {
        return done();
    }

    facebookTestData = {};

    this.timeout(20000);

    async.series([
        getApplicationAccessToken,
        createTestUser,
        writeTestDataToCacheFile,
    ], done);
});

function checkForCachedFacebookTestData () {
    console.log('Checking for cached facebook test data...');

    if (fs.existsSync(facebookTestDataPath)) {
        facebookTestData = require(facebookTestDataPath);
        return true;
    }

    return false;
}

function getApplicationAccessToken (done) {
    console.log('Fetching facebook application access token...');

    fb.getApplicationAccessToken(function(err, token) {
        if (err) {
            done(err);
        }

        facebookTestData.application_access_token = token;

        done();
    });
}

function createTestUser (done) {
    console.log('Creating facebook test user...');

    fb.createTestUser('Genghis Khan', function (err, user) {
        if (err) {
            done(err);
        }

        facebookTestData.user = user;

        done();
    });
}

function writeTestDataToCacheFile (done) {
    console.log('Writing facebook test data cache...');

    var ppJson = JSON.stringify(facebookTestData, null, 4);

    fs.writeFile(facebookTestDataPath, ppJson, function (err) {
        if (err) {
            console.log(err);
            done(err);
        }
        else {
            console.log(ppJson);
            done();
        }
    });
}

/*
after(function(done) {
    this.timeout(20000);

    console.log('Deleting test user: ', facebookTestUser);

    fb.deleteTestUser(facebookTestUser, function (err, res) {
        if (err) {
            console.log('Error deleting: ' + err);
            throw err;
        }
        else {
            console.log(res);
            done();
        }
    });
});
*/

module.exports.getFacebookTestData = function() {
    return facebookTestData;
};
