/**
 * MessageController
 *
 * @description :: Server-side logic for managing messages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


var moment = require('moment');

//drugi nacin bez blueprint logike... https://gist.github.com/mikermcneil/6598661

// kako koristiti

//var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEsInNlY3JldCI6IjRqcGF3MDl0M3hyIiwiaWF0IjoxNDQ5NDc3MDg1fQ.S_D75-kku-DQZ1oEFRHdFrcXynP9jtqPIgJ6PNtMJmk";
//var socket = io.connect('http://localhost:1337', {query: "__sails_io_sdk_version=0.11.0"});
//
//socket.on('connect', function () {
//    socket.emit("get", {url: "/api/messages/connect", data: {token: token}}, function (data) {
//        console.log(data);
//    });
//
//    // message je ime modela...
//    socket.on("message", function (data) {
//        console.log(data);
//    });
//});
// slanje
// socket.emit('post', {url: '/api/messages/create', data: {token: token, text: "porukaaa"}}, function(data) {console.log("ode", data);})


module.exports = {
    connect: function (req, res) {
        Message.find().populate('user').then(function (messages) {

            // subscribe this req to message model create events
            Message.watch(req);

            res.ok(messages);

        }).catch(function (err) {
            res.serverError(err);
        });
    },

    create: function (req, res) {
        var params = req.params.all();
        var time = moment().subtract(1, 'minute');

        if (!params.text) return res.badRequest();

        Message.find({where: {createdAt: {'>=': time.format()}}}).then(function (messages) {
            //if (messages.length >= 3 && (!req.user.role || req.user.role.name != 'superadmin')) return res.forbidden("Spam!");

            Message.create({
                text: params.text,
                user: req.user
            }).then(function (message) {

                // fill data for user... create doesn't populate
                message.user = req.user.toJSON();

                // emit created event to all sockets subscribed to this model not including req
                Message.publishCreate(message);

                res.ok(message)

            });

        }).catch(function (err) {
            res.serverError(err);
        });
    }
};

