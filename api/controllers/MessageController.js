/**
 * MessageController
 *
 * @description :: Server-side logic for managing messages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


var moment = require('moment');

//drugi nacin bez blueprint logike... https://gist.github.com/mikermcneil/6598661

// kako koristiti

//var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEsInNlY3JldCI6InpldWx2dW5taSIsImlhdCI6MTQ0OTAwNzM4Nn0.ee5uLvgtsLhuy7SoozF85eo-Kp7a_z5CbYSnwWmBLak";
//var socket = io.connect('http://localhost:1337', {query: "__sails_io_sdk_version=0.11.0"});
//
//socket.on('connect', function () {
//    socket.emit("get", {url: "/api/messages/show", data: {token: token}}, function (data) {
//        console.log(data);
//    });
//
//    // message je ime modela...
//    socket.on("message", function (data) {
//        console.log(data);
//    });
//});


module.exports = {
    show: function (req, res) {
        Message.find().populate('user').then(function (messages) {

            // uzeto iz blueprint logike sailsa
            if (req.isSocket) {
                Message.subscribe(req, messages);
                Message.watch(req);
            }

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
            if (messages.length >= 3) return res.forbidden("spam!");

            Message.create({
                text: params.text,
                user: req.options.user
            }).then(function (message) {

                // fill data for user... create doesn't populate
                message.user = req.options.user.toJSON();

                // uzeto iz blueprint logike sailsa
                if (req.isSocket) {
                    Message.subscribe(req, message);
                    Message.introduce(message);
                }

                Message.publishCreate(message, !req.options.mirror && req);


                res.ok(message)

            });

        }).catch(function (err) {
            res.serverError(err);
        });
    }
};

