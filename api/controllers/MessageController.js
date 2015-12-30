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
            Message.subscribe(req, _.pluck(messages, 'id'));

            sails.sockets.blast('newUser', {
                user: UploadHelper.getFullUrl(req, req.user.toJSON()),
                total: Message.watchers().length
            });


            // TODO: update donna status in database
            if(req.user.isVIP) {
                sails.sockets.blast('donnaIn', {}, req.socket);
                req.user.isOnline = true;
            }

            req.user.save(function (err, user) {
                // Find VIP user
                User.findOne({where: {isVIP: true}}).then(function (vipUser) {
                    var baseURL = sails.getBaseurl();
                    async.each(messages, function (item, callback) {
                        if (!item.user || !item.user.file) return callback();

                        Media.findOne(item.user.file).then(function (media) {
                            media.url = baseURL + '/api/file/public/' + media.id;
                            media.thumb = baseURL + '/api/file/thumb/public/' + media.id;

                            item.user.file = media;

                            return callback();
                        }).catch(function (err) {
                            console.log(err);
                            return callback(err);
                        });

                    }, function (err) {
                        if (err) return res.negotiate(err);

                        var donnaOnline = vipUser ? vipUser.isOnline : false;
                        return res.ok({messages: messages, total: Message.watchers().length, donnaOnline: donnaOnline});
                    });
                });
            });

        }).catch(function (err) {
            res.negotiate(err);
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
                message.user = req.user.toJSON;

                Media.findOne(req.user.file).then(function (media) {
                    message.user.file = UploadHelper.getFullUrl(req, media);
                    message.user = UploadHelper.getFullUrl(req, message);

                    // emit created event to all sockets subscribed to this model not including req
                    Message.publishCreate(message.toJSON());

                    res.ok(message.toJSON());
                });
            });

        }).catch(function (err) {
            res.serverError(err);
        });
    },

    /**
     * Like/unlike chat message
     * @param req
     * @param res
     */
    like: function (req, res) {
        Social.likeUnlike(req, 'message').then(function (comment) {
            return res.ok(comment);
        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Report/unreport chat message
     * @param req
     * @param res
     */
    report: function (req, res) {
        Social.reportUnreport(req, 'message').then(function (comment) {
            return res.ok(comment);
        }).catch(function (err) {
            return res.negotiate(err);
        });
    }
};

