/**
 * ChatController
 *
 * @description :: Server-side logic for managing chats
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var moment = require('moment');
module.exports = {

    /**
     * New message in chat
     * @param req
     * @param res
     */
    create: function (req, res) {
        var params = req.params.all();
        params.user = req.token.userId;
        var time = moment().subtract(1, 'minute');

        Message.find({where: {createdAt: {'>=': time.format()}}}).then(function(messages) {
            if (messages.length >= 3) return res.forbidden('SPAM!!!');

            Message.create(params).then(function (message) {
                return res.json(message);
            });

        }).catch(function (err) {
            return res.negotiate(err);
        });
    }

};

