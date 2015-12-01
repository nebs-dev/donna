/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

var grunt = require('grunt');

module.exports.bootstrap = function (cb) {

    sails.io.on('connection', function (socket) {
        if (!socket.handshake || !socket.handshake.query || !socket.handshake.query.token) return socket.disconnect();

        var token = socket.handshake.query.token;

        sailsTokenAuth.verifyToken(token, function (err, parsedToken) {
            if (err) return socket.disconnect();

            sails.sockets.join(socket, 'donnaroom');

            console.log(socket.post);

            socket.on('disconnect', function () {
                sails.sockets.leave(socket, 'donnaroom');
            });


            //sails.sockets.broadcast("donaroom", "poruka", newOne, null);

        });
    });


    grunt.tasks('default', {}, function () {
        cb();
    });
};
