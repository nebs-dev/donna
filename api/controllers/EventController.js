/**
 * EventController
 *
 * @description :: Server-side logic for managing events
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var moment = require('moment');
module.exports = {

    /**
     * Create event && upload file
     * @param req
     * @param res
     */
    create: function (req, res) {
        var params = req.params.all();

        Event.create(params).then(function (event) {

            return [event, UploadHelper.uploadFile(req, 'event')];

        }).spread(function (event, files) {
            event.file = files[0].id;

            event.save(function (err, event) {
                if (err) return res.negotiate(err);
                return res.json(event);
            });

        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Update event && upload file
     * @param req
     * @param res
     */
    update: function (req, res) {
        var params = req.params.all();

        Event.update(req.params.id, params).then(function (event) {

            return [event[0], UploadHelper.uploadFile(req, 'event')];

        }).spread(function (event, files) {
            if (file) event.file = file[0].id;

            event.save(function (err, event) {
                if (err) return res.negotiate(err);
                return res.json(event);
            });

        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Destroy Event
     * @param req
     * @param res
     */
    destroy: function (req, res) {
        Event.destroy(req.params.id).then(function () {
            return res.ok();
        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Show single Event
     * @param req
     * @param res
     */
    show: function (req, res) {
        Event.findOne(req.params.id).populateAll().then(function (event) {
            if (!event) return res.notFound();
            return res.json(event);
        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Add comment for Event
     * @param req
     * @param res
     */
    addComment: function (req, res) {
        var params = req.params.all();
        params.user = req.token.userId;

        Event.findOne(req.params.id).then(function (event) {
            if (!event) return res.notFound('Event with that ID not found');

            delete params.id;

            // Create comment and add it to event
            Comment.create(params).then(function (comment) {

                event.comments.add(comment);
                event.save(function (err, event) {
                    if (err) return res.negotiate(err);
                    return res.json(comment);
                });
            })

        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Like/unlike event
     * @param req
     * @param res
     */
    like: function (req, res) {
        Social.likeUnlike(req, 'event').then(function (event) {
            return res.json(event);
        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * List of events
     * @param req
     * @param res
     */
    list: function (req, res) {
        var fromDate = moment().subtract(1, 'month');

        Event.find({date: {'>=': fromDate}}).then(function (events) {
            return res.json(events);
        }).catch(function(err) {
           return res.negotiate(err);
        });
    }
};

