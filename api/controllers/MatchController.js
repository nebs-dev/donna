/**
 * MatchController
 *
 * @description :: Server-side logic for managing matches
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    /**
     * Matches list
     * @param req
     * @param res
     */
    list: function (req, res) {
        Match.find().sort('createdAt DESC').populate('messages').then(function (matches) {
            return res.ok(matches);
        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Create match
     * @param req
     * @param res
     */
    create: function (req, res) {
        var params = req.params.all();

        Match.create(params).then(function (match) {
            return res.ok(match);
        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    update: function (req, res) {
        var params = req.params.all();
        console.log(params);

        Match.update(req.params.id, params).then(function (match) {
            return res.ok(match);
        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Get one match
     * @param req
     * @param res
     */
    show: function (req, res) {
        Match.findOne(req.params.id).populate('messages').then(function (match) {
            return res.ok(match);
        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Destroy match
     * @param req
     * @param res
     */
    destroy: function (req, res) {
        Match.destroy(req.params.id).then(function () {
            return res.ok();
        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Create new message and publish
     * @param req
     * @param res
     * @returns {*}
     */
    newMessage: function (req, res) {
        var params = req.params.all();
        if (!params.matchId) return res.customBadRequest('Missing parameters.');

        Match.findOne(params.matchId).then(function (match) {
            if (!match) return res.notFound('Match not found');

            MatchMessage.create(params).then(function (msg) {
                match.messages.add(msg);
                match.save(function (err, match) {
                   if (err) return res.negotiate(err);

                    Match.publishAdd(match.id, 'messages', msg);
                    return res.ok(match.toJSON());
                });
            });
        }).catch(function (err) {
           return res.negotiate(err);
        });
    },

    /**
     * Destroy single message
     * @param req
     * @param res
     */
    destroyMsg: function (req, res) {
        MatchMessage.destroy(req.params.id).then(function () {
            return res.ok();
        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Subscribe socket on match
     * @param req
     * @param res
     */
    connect: function (req, res) {
        Match.findOne(req.params.id).populateAll().then(function (match) {
            if (!match) return res.notFound('Match not found');

            Match.subscribe(req, match.id);
            return res.ok(match);

        }).catch(function (err) {
            return res.negotiate(err);
        });
    }

};

