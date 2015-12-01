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
var moment = require('moment');

module.exports.bootstrap = function (cb) {

    sails.io.on('connection', function (socket) {
        if (!socket.handshake || !socket.handshake.query || !socket.handshake.query.token) return socket.disconnect();

        var token = socket.handshake.query.token;

        sailsTokenAuth.verifyToken(token, function (err, parsedToken) {
            if (err) return socket.disconnect();

            socket.join('donna');
            sails.sockets.broadcast('donna', 'notification', {join: 'User joined', user: parsedToken.userId}, socket);

            socket.on('newMsg', function (data) {

                if (!data.text || !parsedToken.userId) return socket.emit('notification', {error: 'Not enought data!'});

                var time = moment().subtract(1, 'minute');

                Message.find({where: {createdAt: {'>=': time.format()}}}).then(function (messages) {
                    if (messages.length >= 3) return socket.emit('notification', {error: 'SPAM!'});

                    Message.create({
                        text: data.text,
                        user: parsedToken.userId
                    }).then(function (message) {
                        socket.broadcast.to('donna').emit('msg', message);
                    });

                }).catch(function (err) {
                    socket.emit(socket, 'notification', {error: 'last message not sent!'});
                });
            });

            socket.on('disconnect', function () {
                sails.sockets.broadcast('donna', 'notification', {left: 'User left', user: parsedToken.userId}, socket);
                socket.leave('donna');
            });


        });
    });


    grunt.tasks('default', {}, function () {
        cb();
    });
};
