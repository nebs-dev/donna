module.exports = function (req, res, next) {
    var token;

    if (req.headers && req.headers.authorization) {
        var parts = req.headers.authorization.split(' ');
        if (parts.length == 2) {
            var scheme = parts[0],
                credentials = parts[1];

            if (/^Bearer$/i.test(scheme)) {
                token = credentials;
            }
        } else {
            return res.unauthorized('Format is Authorization: Bearer [token]');
        }
    } else if (req.param('token')) {
        token = req.param('token');
        // We delete the token from param to not mess with blueprints
        delete req.query.token;
    } else {
        return res.unauthorized('No Authorization header was found');
    }

    sailsTokenAuth.verifyToken(token, function (err, newToken) {
        if (err || newToken.ip != sailsTokenAuth.getIp(req)) return res.unauthorized('The token is not valid');

        // Check user secret
        User.findOne(newToken.userId).populate('role').then(function (user) {
            if (user.secret != newToken.secret) {
                return res.unauthorized('The token is not valid');
            }


            req.token = newToken;
            req.originalToken = token;
            req.user = user;

            next();

        }).catch(function (err) {
            if (err) return res.unauthorized(err);
        });
    });
};