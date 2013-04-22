function routeResponder (response, done) {
    return function (err, code, body) {
        if (err) {
            return done(err);
        }

        response.send(code, body);
        done();
    };
}

module.exports.routeResponder = routeResponder;
