var jwt = require('jsonwebtoken');

module.exports = {

    getIp: function (req) {
        return req.headers['x-forwarded-for'] ||
            req.socket.remoteAddress ||
            req.connection.remoteAddress ||
            req.connection.socket.remoteAddress;
    },

    issueToken: function (payload) {

        var token = jwt.sign(payload, process.env.TOKEN_SECRET || "our biggest secret");
        return token;
    },

    verifyToken: function (token, verified) {
        return jwt.verify(token, process.env.TOKEN_SECRET || "our biggest secret", {}, verified);
    }
};